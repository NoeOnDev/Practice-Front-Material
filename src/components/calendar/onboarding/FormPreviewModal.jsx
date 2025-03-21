import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { AppointmentForm } from "../AppointmentForm";

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

  useEffect(() => {
    if (businessType?.fields) {
      setFormValues((prev) => ({
        ...prev,
        fields: businessType.fields,
      }));

      const initialCustomFields = {};
      businessType.fields.forEach((field) => {
        if (field.type === "boolean") {
          initialCustomFields[`custom_${field.id}`] = false;
        } else if (
          field.type === "select" &&
          field.options &&
          field.options.length > 0
        ) {
          initialCustomFields[`custom_${field.id}`] = field.options[0];
        } else if (field.type === "number") {
          initialCustomFields[`custom_${field.id}`] = 0;
        } else {
          initialCustomFields[`custom_${field.id}`] = "";
        }
      });
      setCustomFields(initialCustomFields);
    }
  }, [businessType, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCustomFieldChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (type === "checkbox") {
      setCustomFields({
        ...customFields,
        [name]: checked,
      });
    } else {
      setCustomFields({
        ...customFields,
        [name]: value,
      });
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    setLoading(true);
    setTimeout(() => setLoading(false), 0);
  };

  if (!businessType) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Vista previa del formulario: {businessType.name}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Esta es una vista previa interactiva del formulario para citas del
          tipo &quot;{businessType.name}&quot;.
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
    </Dialog>
  );
};

FormPreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  businessType: PropTypes.object,
};
