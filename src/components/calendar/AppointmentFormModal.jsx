import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { es } from "date-fns/locale";
import { useState } from "react";
import { getContactsAndSearch } from "../../services/contactService";
import { useDebounce } from "../../hooks/useDebounce";
import DeleteIcon from "@mui/icons-material/Delete";

export const AppointmentFormModal = ({
  open,
  appointment,
  onClose,
  onSubmit,
  onChange,
  onDelete,
  title,
  formStructure = { default_fields: [], custom_fields: [] },
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSearchChange = async (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getContactsAndSearch(value);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error buscando contactos:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearchChange, 300);

  const renderCustomField = (field) => {
    const fieldId = `custom_${field.id}`;
    const fieldValue =
      appointment[fieldId] !== undefined ? appointment[fieldId] : "";

    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue}
            onChange={onChange}
            required={field.required}
          />
        );

      case "select":
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.name}</InputLabel>
            <Select
              label={field.name}
              name={fieldId}
              value={fieldValue}
              onChange={onChange}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!fieldValue}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: fieldId,
                      value: e.target.checked,
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

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Box>
            {appointment.id && (
              <IconButton color="error" onClick={onDelete} size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={searchResults}
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.last_name}`
                }
                value={appointment.contact}
                loading={loading}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  debouncedSearch(newInputValue);
                }}
                onChange={(event, newValue) => {
                  onChange({
                    target: { name: "contact", value: newValue },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contacto"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div>
                      <Typography variant="body1">
                        {`${option.first_name} ${option.last_name}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </div>
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Título de la Cita"
                name="title"
                value={appointment.title}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DateTimePicker
                  label="Inicio"
                  value={appointment.start}
                  readOnly
                  slotProps={{
                    textField: { fullWidth: true },
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
                  value={appointment.end}
                  readOnly
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="status"
                  value={appointment.status}
                  onChange={onChange}
                  required
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="confirmed">Confirmada</MenuItem>
                  <MenuItem value="cancelled">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formStructure.custom_fields &&
              formStructure.custom_fields.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {formStructure.custom_fields.map((field) => (
                      <Grid
                        item
                        xs={12}
                        md={field.type === "boolean" ? 12 : 6}
                        key={field.id}
                      >
                        {renderCustomField(field)}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}
        >
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

AppointmentFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  appointment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  title: PropTypes.string.isRequired,
  formStructure: PropTypes.object,
};
