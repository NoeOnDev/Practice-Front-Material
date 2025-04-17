import { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import { AppointmentsHeader } from "../components/appointments/AppointmentsHeader";
import { AppointmentFormModal } from "../components/calendar/AppointmentFormModal";
import {
  getAppointmentsAndSearch,
  deleteAppointment,
  updateAppointment,
} from "../services/appointmentService";
import { getContactsAndSearch } from "../services/contactService";
import { getAppointmentFields } from "../services/appointmentFieldService";
import { useDebounce } from "../hooks/useDebounce";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [customFields, setCustomFields] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [contactsLoading, setContactsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formStructure, setFormStructure] = useState({ custom_fields: [] });

  const [filters, setFilters] = useState({
    status: null,
    start_date: null,
    end_date: null,
    contact_id: null,
    sort_by: "start",
    sort_order: "desc",
  });

  const loadContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await getContactsAndSearch("", 1, 100);
      setContacts(response.data);
    } catch (error) {
      console.error("Error al cargar contactos para filtro:", error);
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        const fields = await getAppointmentFields();
        setFormStructure({
          custom_fields: fields,
        });
      } catch (error) {
        console.error("Error cargando campos personalizados:", error);
      }
    };

    loadCustomFields();
  }, []);

  const handleSearch = useDebounce(
    useCallback(
      async (query) => {
        try {
          setSearchLoading(true);
          const searchParams = {
            query,
            page,
            per_page: rowsPerPage,
            ...Object.fromEntries(
              Object.entries(filters).filter(([key, value]) => value !== null)
            ),
          };
          const response = await getAppointmentsAndSearch(searchParams);

          const fetchedAppointments = response.data;

          const allFields = extractCustomFields(fetchedAppointments);
          setCustomFields(allFields);

          const processedAppointments = processAppointmentsWithCustomFields(
            fetchedAppointments,
            allFields
          );

          setAppointments(processedAppointments);
          setTotalRows(response.total);
          setError(null);
        } catch (error) {
          console.error("Error al buscar citas:", error);
          setError("Error al buscar citas");
          setAppointments([]);
        } finally {
          setSearchLoading(false);
        }
      },
      [page, rowsPerPage, filters]
    ),
    300
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        const searchParams = {
          query: "",
          page: 1,
          per_page: rowsPerPage,
          ...Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== null)
          ),
        };
        const response = await getAppointmentsAndSearch(searchParams);

        const fetchedAppointments = response.data;

        const allFields = extractCustomFields(fetchedAppointments);
        setCustomFields(allFields);

        const processedAppointments = processAppointmentsWithCustomFields(
          fetchedAppointments,
          allFields
        );

        setAppointments(processedAppointments);
        setTotalRows(response.total);
        setError(null);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
        setError("Error al cargar las citas");
        setAppointments([]);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [rowsPerPage, filters]);

  useEffect(() => {
    if (!initialLoading) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, page, rowsPerPage, filters, handleSearch, initialLoading]);

  const extractCustomFields = (appointments) => {
    const fieldsMap = new Map();

    appointments.forEach((appointment) => {
      if (appointment.field_values && appointment.field_values.length > 0) {
        appointment.field_values.forEach((fieldValue) => {
          if (fieldValue.field) {
            fieldsMap.set(fieldValue.field.id, {
              id: fieldValue.field.id,
              name: fieldValue.field.name,
              type: fieldValue.field.type,
            });
          }
        });
      }
    });

    return Array.from(fieldsMap.values());
  };

  const processAppointmentsWithCustomFields = (appointments, customFields) => {
    return appointments.map((appointment) => {
      const processedAppointment = {
        id: appointment.id,
        title: appointment.title,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        contactName: `${appointment.contact.first_name} ${appointment.contact.last_name}`,
        contact: appointment.contact,
        contact_id: appointment.contact.id,
        created_at: appointment.created_at,
        updated_at: appointment.updated_at,
        field_values: appointment.field_values,
      };

      customFields.forEach((field) => {
        processedAppointment[`custom_${field.id}`] = "";
      });

      if (appointment.field_values && appointment.field_values.length > 0) {
        appointment.field_values.forEach((fieldValue) => {
          if (fieldValue.field) {
            processedAppointment[`custom_${fieldValue.field.id}`] =
              fieldValue.value;
          }
        });
      }

      return processedAppointment;
    });
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const searchParams = {
        query: searchQuery,
        page,
        per_page: rowsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== null)
        ),
      };
      const response = await getAppointmentsAndSearch(searchParams);

      const fetchedAppointments = response.data;

      const allFields = extractCustomFields(fetchedAppointments);
      setCustomFields(allFields);

      const processedAppointments = processAppointmentsWithCustomFields(
        fetchedAppointments,
        allFields
      );

      setAppointments(processedAppointments);
      setTotalRows(response.total);
      setError(null);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      setError("Error al cargar las citas");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setSearchLoading(true);
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleNewAppointment = () => {
    const startDate = new Date();
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    setSelectedAppointment({
      title: "",
      contact: null,
      start: startDate,
      end: endDate,
      status: "pending",
    });
    setOpenModal(true);
  };

  const handleEditAppointment = (appointment) => {
    const formattedAppointment = {
      ...appointment,
      start: new Date(appointment.start),
      end: new Date(appointment.end),
      contact: {
        id: appointment.contact_id,
        first_name: appointment.contactName.split(" ")[0],
        last_name: appointment.contactName.split(" ").slice(1).join(" "),
      },
    };

    setSelectedAppointment(formattedAppointment);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment({
      ...selectedAppointment,
      [name]: value,
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const appointmentData = {
        title: selectedAppointment.title,
        contact_id: selectedAppointment.contact?.id,
        start: selectedAppointment.start,
        end: selectedAppointment.end,
        status: selectedAppointment.status,
      };

      await updateAppointment(selectedAppointment.id, appointmentData);
      await fetchAppointments();
      setOpenModal(false);
      alert("Cita actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      alert("Error al actualizar la cita");
    }
  };

  const handleAttendComplete = async () => {
    await fetchAppointments();
    setOpenModal(false);
  };

  const handleDeleteAppointment = async (appointment) => {
    if (confirm(`¿Estás seguro de eliminar la cita "${appointment.title}"?`)) {
      try {
        const response = await deleteAppointment(appointment.id);

        if (response.appointments) {
          const allFields = extractCustomFields(response.appointments);
          setCustomFields(allFields);

          const processedAppointments = processAppointmentsWithCustomFields(
            response.appointments,
            allFields
          );

          setAppointments(processedAppointments);
          setTotalRows(response.appointments.length);
        } else {
          await handleSearch(searchQuery);
        }

        alert("Cita eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
        alert("Error al eliminar la cita");
      }
    }
  };

  const handleMultipleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar ${selected.length} citas?`)) {
      try {
        let lastResponse = null;
        for (const id of selected) {
          lastResponse = await deleteAppointment(id);
        }

        if (lastResponse && lastResponse.appointments) {
          const allFields = extractCustomFields(lastResponse.appointments);
          setCustomFields(allFields);

          const processedAppointments = processAppointmentsWithCustomFields(
            lastResponse.appointments,
            allFields
          );

          setAppointments(processedAppointments);
          setTotalRows(lastResponse.appointments.length);
        } else {
          await fetchAppointments();
        }

        setSelected([]);
        alert("Citas eliminadas exitosamente");
      } catch (error) {
        console.error("Error al eliminar las citas:", error);
        alert("Error al eliminar las citas");
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: null,
      start_date: null,
      end_date: null,
      contact_id: null,
      sort_by: "start",
      sort_order: "desc",
    });
    setPage(1);
  };

  if (initialLoading) {
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
      {appointments.length > 0 && (
        <AppointmentsHeader
          selectedCount={selected.length}
          onMultipleDelete={handleMultipleDelete}
          onCreateNew={handleNewAppointment}
          setSelected={setSelected}
        />
      )}

      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {error ? (
          <Typography color="error" sx={{ p: 3 }}>
            {error}
          </Typography>
        ) : appointments.length === 0 && !searchQuery ? (
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
              <CalendarTodayIcon
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
                No tienes citas guardadas
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
                Crea tu primera cita en el apartado de agenda.
              </Typography>
            </Box>
          </Paper>
        ) : (
          <AppointmentsTable
            appointments={appointments}
            customFields={customFields}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
            selected={selected}
            setSelected={setSelected}
            searchQuery={searchQuery}
            onSearchChange={(value) => setSearchQuery(value)}
            loading={searchLoading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            contacts={contacts}
          />
        )}
      </Paper>

      <AppointmentFormModal
        open={openModal}
        appointment={selectedAppointment || {}}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onChange={handleModalChange}
        onDelete={handleDeleteAppointment}
        title={
          selectedAppointment?.status === "attended" ||
          selectedAppointment?.status === "cancelled"
            ? "Detalles de la Cita"
            : selectedAppointment?.id
              ? "Editar Cita"
              : "Nueva Cita"
        }
        formStructure={formStructure}
        onAttendComplete={handleAttendComplete}
      />
    </Box>
  );
};
