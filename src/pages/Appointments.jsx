import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import { AppointmentsHeader } from "../components/appointments/AppointmentsHeader";
import { AppointmentFormModal } from "../components/calendar/AppointmentFormModal";
import {
  getAppointmentsRaw,
  deleteAppointment,
  updateAppointment,
} from "../services/appointmentService";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [customFields, setCustomFields] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formStructure, setFormStructure] = useState({ custom_fields: [] });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentsRaw();

      const fetchedAppointments = response.data;

      const allFields = extractCustomFields(fetchedAppointments);
      setCustomFields(allFields);

      const processedAppointments = processAppointmentsWithCustomFields(
        fetchedAppointments,
        allFields
      );

      setAppointments(processedAppointments);
      setTotalRows(response.total || fetchedAppointments.length);
      setError(null);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      setError("Error al cargar las citas");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = (event, newPage) => {
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
        await deleteAppointment(appointment.id);
        await fetchAppointments();
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
        for (const id of selected) {
          await deleteAppointment(id);
        }
        await fetchAppointments();
        setSelected([]);
        alert("Citas eliminadas exitosamente");
      } catch (error) {
        console.error("Error al eliminar las citas:", error);
        alert("Error al eliminar las citas");
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
