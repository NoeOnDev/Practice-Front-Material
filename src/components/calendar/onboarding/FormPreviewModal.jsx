import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Autocomplete,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { es } from "date-fns/locale";

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
  });

  const [customFields, setCustomFields] = useState({});

  useState(() => {
    if (businessType?.fields) {
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
  }, [businessType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCustomFieldChange = (event) => {
    const { name, value, checked } = event.target;
    if (name.includes("custom_") && event.target.type === "checkbox") {
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

  const renderCustomField = (field) => {
    const fieldId = `custom_${field.id}`;
    const fieldValue =
      customFields[fieldId] !== undefined ? customFields[fieldId] : "";

    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue}
            onChange={handleCustomFieldChange}
            required={field.required}
          />
        );

      case "select":
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel id={`${fieldId}-label`}>{field.name}</InputLabel>
            <Select
              labelId={`${fieldId}-label`}
              label={field.name}
              name={fieldId}
              value={fieldValue}
              onChange={handleCustomFieldChange}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "number":
        return (
          <TextField
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue}
            onChange={handleCustomFieldChange}
            required={field.required}
            type="number"
          />
        );

      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!fieldValue}
                onChange={(e) =>
                  handleCustomFieldChange({
                    target: {
                      name: fieldId,
                      type: "checkbox",
                      checked: e.target.checked,
                    },
                  })
                }
                name={fieldId}
              />
            }
            label={field.name}
          />
        );

      default:
        return null;
    }
  };

  if (!businessType) return null;

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

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={sampleContacts}
              getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name}`
              }
              value={formValues.contact}
              onChange={(event, newValue) => {
                setFormValues({ ...formValues, contact: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Contacto"
                  required
                  placeholder="Seleccione un contacto"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1">
                      {`${option.first_name} ${option.last_name}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título de la Cita"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                name="status"
                value={formValues.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="confirmed">Confirmada</MenuItem>
                <MenuItem value="cancelled">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <DateTimePicker
                label="Inicio"
                value={formValues.start}
                onChange={(newValue) => {
                  setFormValues({ ...formValues, start: newValue });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <DateTimePicker
                label="Fin"
                value={formValues.end}
                onChange={(newValue) => {
                  setFormValues({ ...formValues, end: newValue });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {businessType.fields && businessType.fields.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="500" sx={{ my: 1 }}>
                  Campos personalizados
                </Typography>
              </Grid>

              {businessType.fields.map((field) => (
                <Grid
                  item
                  xs={12}
                  md={field.type === "boolean" ? 12 : 6}
                  key={field.id}
                >
                  {renderCustomField(field)}
                </Grid>
              ))}
            </>
          )}
        </Grid>
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
