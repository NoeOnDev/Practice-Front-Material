import {
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAppointmentsRaw, deleteAppointment } from "../services/appointmentService";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import { AppointmentsHeader } from "../components/appointments/AppointmentsHeader";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [customFields, setCustomFields] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    // Esta función se implementará más adelante para abrir un modal
    // o redirigir a la página de creación de citas
    console.log("Nueva cita");
  };

  const handleEditAppointment = (appointment) => {
    // Implementar función para editar cita
    console.log("Editar cita:", appointment);
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
          />
        )}
      </Paper>
    </Box>
  );
};
