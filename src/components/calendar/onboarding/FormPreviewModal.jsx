import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import { AppointmentForm } from "../AppointmentForm";
import { AttendAppointmentModal } from "../AttendAppointmentModal";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getStatusInfo } from "../../../utils/appointmentUtils";

export const FormPreviewModal = ({ open, onClose, businessType }) => {
  const [formValues, setFormValues] = useState({
    contact: {
      id: 1,
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan.perez@example.com",
    },
    title: "Ejemplo de título",
    status: "pending",
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    fields: [],
  });

  const [customFields, setCustomFields] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendModalOpen, setAttendModalOpen] = useState(false);

  const sampleContacts = [
    {
      id: 1,
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan.perez@example.com",
    },
    {
      id: 2,
      first_name: "María",
      last_name: "González",
      email: "maria.gonzalez@example.com",
    },
    {
      id: 3,
      first_name: "Carlos",
      last_name: "Rodríguez",
      email: "carlos.rodriguez@example.com",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCustomFieldChange = (name, value) => {
    setCustomFields({
      ...customFields,
      [name]: value,
    });
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleAttendClick = () => {
    setAttendModalOpen(true);
  };

  const handleAttendClose = () => {
    setAttendModalOpen(false);
  };

  const handleAttendComplete = () => {
    setAttendModalOpen(false);
    alert("La cita ha sido atendida exitosamente (Simulación)");
    setFormValues({
      ...formValues,
      status: "attended",
    });
  };

  useEffect(() => {
    if (businessType?.fields) {
      const initialCustomFields = {};
      businessType.fields.forEach((field) => {
        initialCustomFields[`custom_${field.id}`] =
          field.type === "boolean"
            ? false
            : field.type === "select" && field.options?.length > 0
              ? field.options[0]
              : "";
      });
      setCustomFields(initialCustomFields);
    }
    setTimeout(() => setLoading(false), 0);
  }, [businessType]);

  if (!businessType) return null;

  const showAttendButton = formValues.status === "pending";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">
            Vista previa: {businessType.name}
          </Typography>
          <Chip
            size="small"
            label={getStatusInfo(formValues.status).label}
            color={getStatusInfo(formValues.status).color}
            sx={{ ml: 1 }}
          />
        </Box>
        {showAttendButton && (
          <IconButton
            color="primary"
            onClick={handleAttendClick}
            size="small"
            sx={{ mr: 1 }}
            title="Atender cita (Simulación)"
          >
            <MedicalServicesIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Esta es una vista previa interactiva del formulario para citas del
          tipo &quot;{businessType.name}&quot;.
          {showAttendButton && (
            <span>
              {" "}
              Puedes hacer clic en el botón de atender cita para ver los campos
              de atención.
            </span>
          )}
        </Typography>

        <AppointmentForm
          appointment={formValues}
          onChange={handleChange}
          customFields={customFields}
          onCustomFieldChange={handleCustomFieldChange}
          contacts={sampleContacts}
          loading={loading}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          readOnlyDates={false}
          isPreview={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>

      <AttendAppointmentModal
        open={attendModalOpen}
        appointment={formValues}
        onClose={handleAttendClose}
        formStructure={{ custom_fields: businessType?.fields || [] }}
        onAttendComplete={handleAttendComplete}
      />
    </Dialog>
  );
};

FormPreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  businessType: PropTypes.object,
};
