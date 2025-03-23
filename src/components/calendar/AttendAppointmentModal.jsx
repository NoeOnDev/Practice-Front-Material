import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { attendAppointment } from "../../services/appointmentService";

export const AttendAppointmentModal = ({
  open,
  appointment,
  onClose,
  formStructure = { custom_fields: [] },
  onAttendComplete,
}) => {
  const [customFieldValues, setCustomFieldValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && appointment) {
      const initialValues = {};
      formStructure.custom_fields.forEach((field) => {
        if (appointment[`custom_${field.id}`] !== undefined) {
          initialValues[`custom_${field.id}`] =
            appointment[`custom_${field.id}`];
        } else {
          if (field.type === "boolean") {
            initialValues[`custom_${field.id}`] = false;
          } else if (
            field.type === "select" &&
            field.options &&
            field.options.length > 0
          ) {
            initialValues[`custom_${field.id}`] = field.options[0];
          } else if (field.type === "number") {
            initialValues[`custom_${field.id}`] = 0;
          } else {
            initialValues[`custom_${field.id}`] = "";
          }
        }
      });
      setCustomFieldValues(initialValues);
    }
  }, [open, appointment, formStructure]);

  const handleFieldChange = (event) => {
    const { name, value, checked, type } = event.target;

    if (type === "checkbox") {
      setCustomFieldValues((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setCustomFieldValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!appointment?.id) return;

    try {
      setSubmitting(true);

      await attendAppointment(appointment.id, {
        status: "attended",
        field_values: Object.entries(customFieldValues).reduce(
          (acc, [key, value]) => {
            if (key.startsWith("custom_")) {
              const fieldId = key.replace("custom_", "");
              acc[fieldId] = value;
            }
            return acc;
          },
          {}
        ),
      });

      onAttendComplete && onAttendComplete();
      onClose();
    } catch (error) {
      console.error("Error al atender la cita:", error);
      alert(
        "Ocurrió un error al atender la cita. Por favor, inténtelo de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderCustomField = (field) => {
    const fieldId = `custom_${field.id}`;
    const fieldValue = customFieldValues[fieldId];

    switch (field.type) {
      case "text":
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue || ""}
            onChange={handleFieldChange}
            required={field.required}
            margin="normal"
          />
        );
      case "number":
        return (
          <TextField
            key={field.id}
            fullWidth
            type="number"
            label={field.name}
            name={fieldId}
            value={fieldValue || 0}
            onChange={handleFieldChange}
            required={field.required}
            margin="normal"
          />
        );
      case "select":
        return (
          <FormControl key={field.id} fullWidth margin="normal">
            <InputLabel>{field.name}</InputLabel>
            <Select
              label={field.name}
              name={fieldId}
              value={fieldValue || ""}
              onChange={handleFieldChange}
              required={field.required}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "boolean":
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                name={fieldId}
                checked={!!fieldValue}
                onChange={handleFieldChange}
              />
            }
            label={field.name}
            sx={{ my: 1 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Atender Cita</Typography>
      </DialogTitle>
      <DialogContent>
        {appointment && (
          <Box sx={{ mt: 2 }}>
            {formStructure.custom_fields.length > 0 ? (
              formStructure.custom_fields.map((field) =>
                renderCustomField(field)
              )
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay campos personalizados configurados para este tipo de
                cita.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={
            submitting && <CircularProgress size={16} color="inherit" />
          }
        >
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AttendAppointmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  appointment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  formStructure: PropTypes.object,
  onAttendComplete: PropTypes.func,
};
