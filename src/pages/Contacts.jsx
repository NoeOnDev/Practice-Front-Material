import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
} from "../services/contactService";
import { ContactsTable } from "../components/contacts/ContactsTable";
import { ViewContactModal } from "../components/contacts/ViewContactModal";
import { ContactFormModal } from "../components/contacts/ContactFormModal";
import AddIcon from "@mui/icons-material/Add";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { apiDateToDate, dateToApiDate } from "../utils/dateUtils";
import { useDebounce } from "../hooks/useDebounce";
import { searchContacts } from "../services/contactService";

export const Contacts = () => {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_code: "+52",
    phone_number: "",
    estado: "",
    address: "",
    fechaNacimiento: null,
    notes: "",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = useDebounce(
    useCallback(
      async (query) => {
        if (!query.trim()) {
          const response = await getContacts(page, rowsPerPage);
          setContactos(response.data);
          setTotalRows(response.total);
          setSearching(false);
          return;
        }

        try {
          setSearching(true);
          const response = await searchContacts(query, page, rowsPerPage);
          setContactos(response.data);
          setTotalRows(response.total);
        } catch (error) {
          console.error("Error al buscar contactos:", error);
          setError("Error al buscar contactos");
        } finally {
          setSearching(false);
        }
      },
      [page, rowsPerPage]
    ),
    300
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      const fetchContacts = async () => {
        try {
          setLoading(true);
          const response = await getContacts(page, rowsPerPage);
          setContactos(response.data);
          setTotalRows(response.total);
          setError(null);
        } catch (err) {
          console.error("Error al cargar contactos:", err);
          setError("No se pudieron cargar los contactos");
          setContactos([]);
        } finally {
          setLoading(false);
        }
      };

      fetchContacts();
    } else {
      handleSearch(searchQuery);
    }
  }, [page, rowsPerPage, searchQuery, handleSearch]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContact(null);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact({
      ...contact,
      fechaNacimiento: apiDateToDate(contact.birth_date),
      estado: contact.state,
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditingContact(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedData = {
        ...editingContact,
        birth_date: dateToApiDate(editingContact.fechaNacimiento),
        state: editingContact.estado,
      };

      await updateContact(editingContact.id, updatedData);

      const updatedContacts = await getContacts();
      setContactos(updatedContacts);

      alert("Contacto actualizado exitosamente");
      handleCloseEdit();
    } catch (error) {
      console.error("Error al actualizar el contacto:", error);
      alert("Error al actualizar el contacto");
    }
  };

  const handleOpenDeleteDialog = (contact) => {
    setDeletingContact(contact);
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDelete(false);
    setDeletingContact(null);
  };

  const handleDeleteContact = async () => {
    try {
      const response = await deleteContact(deletingContact.id);
      setContactos(response.contacts);
      alert("Contacto eliminado exitosamente");
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      alert("Error al eliminar el contacto");
    }
  };

  const handleOpenCreateModal = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewContact({
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      phone_code: "+52",
      phone_number: "",
      estado: "",
      address: "",
      fechaNacimiento: null,
      notes: "",
    });
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    try {
      const transformedData = {
        first_name: newContact.first_name,
        last_name: newContact.last_name,
        middle_name: newContact.middle_name,
        email: newContact.email,
        phone_code: newContact.phone_code,
        phone_number: newContact.phone_number,
        state:
          newContact.estado === "CDMX"
            ? "Mexico City"
            : newContact.estado === "JAL"
              ? "Jalisco"
              : "Nuevo Leon",
        address: newContact.address,
        birth_date: newContact.fechaNacimiento?.toISOString().split("T")[0],
        notes: newContact.notes,
      };

      await createContact(transformedData);
      const updatedContacts = await getContacts(page, rowsPerPage);
      setContactos(updatedContacts.data);
      setTotalRows(updatedContacts.total);
      alert("Contacto creado exitosamente");
      handleCloseCreate();
    } catch (error) {
      console.error("Error al crear el contacto:", error);
      alert("Error al crear el contacto");
    }
  };

  const handleMultipleDelete = async (selectedIds) => {
    if (confirm(`¿Estás seguro de eliminar ${selectedIds.length} contactos?`)) {
      try {
        for (const id of selectedIds) {
          await deleteContact(id);
        }

        const updatedContacts = await getContacts(page, rowsPerPage);
        setContactos(updatedContacts.data);
        setTotalRows(updatedContacts.total);

        alert("Contactos eliminados exitosamente");
      } catch (error) {
        console.error("Error al eliminar contactos:", error);
        alert("Error al eliminar los contactos");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {contactos.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2.125rem",
              },
            }}
          >
            Mis Contactos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateModal}
            startIcon={<AddIcon />}
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: "0.9rem",
              },
              py: { xs: 1 },
              px: { xs: 2 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Nuevo Contacto
          </Button>
        </Box>
      )}

      <Box sx={{ flex: 1, minHeight: 0 }}>
        {error ? (
          <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : contactos.length === 0 && !searchQuery ? (
          <Paper
            sx={{
              p: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              backgroundColor: "background.default",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 200,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ContactMailIcon
                sx={{
                  fontSize: 120,
                  color: "text.secondary",
                  opacity: 0.7,
                }}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                  },
                }}
              >
                No tienes contactos guardados
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                  },
                  maxWidth: 500,
                  mx: "auto",
                  mb: 3,
                }}
              >
                Agrega tu primer contacto haciendo clic en el botón
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenCreateModal}
                startIcon={<AddIcon />}
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.9rem",
                  },
                  py: { xs: 1 },
                  px: { xs: 3 },
                }}
              >
                Agregar Primer Contacto
              </Button>
            </Box>
          </Paper>
        ) : (
          <ContactsTable
            contacts={contactos}
            onRowClick={handleOpenModal}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleOpenDeleteDialog}
            onMultipleDelete={handleMultipleDelete}
            page={page}
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            searchQuery={searchQuery}
            onSearchChange={(value) => setSearchQuery(value)}
          />
        )}
      </Box>

      <ViewContactModal
        open={open}
        contact={selectedContact}
        onClose={handleClose}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

      <ContactFormModal
        open={openCreate}
        contact={newContact}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
        onChange={handleCreateChange}
        title="Nuevo Contacto"
      />

      <ContactFormModal
        open={openEdit}
        contact={editingContact}
        onClose={handleCloseEdit}
        onSubmit={handleEditSubmit}
        onChange={handleEditChange}
        title="Editar Contacto"
      />

      <Dialog open={openDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar a{" "}
            {deletingContact
              ? `${deletingContact.first_name} ${deletingContact.last_name}`
              : "este contacto"}
            ?
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleDeleteContact}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
