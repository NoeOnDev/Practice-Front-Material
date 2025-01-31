import { useState, useEffect } from "react";
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
    estado: "CDMX",
    address: "",
    fechaNacimiento: null,
    notes: "",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContactos(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar contactos:", err);
        setError("No se pudieron cargar los contactos");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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
      fechaNacimiento: new Date(contact.birth_date),
      estado:
        contact.state === "Mexico City"
          ? "CDMX"
          : contact.state === "Jalisco"
            ? "JAL"
            : "NL",
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
        first_name: editingContact.first_name,
        last_name: editingContact.last_name,
        middle_name: editingContact.middle_name,
        email: editingContact.email,
        phone_code: editingContact.phone_code,
        phone_number: editingContact.phone_number,
        state:
          editingContact.estado === "CDMX"
            ? "Mexico City"
            : editingContact.estado === "JAL"
              ? "Jalisco"
              : "Nuevo Leon",
        address: editingContact.address,
        birth_date: editingContact.fechaNacimiento.toISOString().split("T")[0],
        notes: editingContact.notes,
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
      await deleteContact(deletingContact.id);
      const updatedContacts = await getContacts();
      setContactos(updatedContacts);
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
      estado: "CDMX",
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
      const updatedContacts = await getContacts();
      setContactos(updatedContacts);
      alert("Contacto creado exitosamente");
      handleCloseCreate();
    } catch (error) {
      console.error("Error al crear el contacto:", error);
      alert("Error al crear el contacto");
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : contactos.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        ></Paper>
      ) : (
        <ContactsTable
          contacts={contactos}
          onRowClick={handleOpenModal}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteDialog}
        />
      )}

      <ViewContactModal
        open={open}
        contact={selectedContact}
        onClose={handleClose}
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
