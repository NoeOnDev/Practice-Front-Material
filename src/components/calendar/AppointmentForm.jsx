import {
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
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { es } from "date-fns/locale";

export const AppointmentForm = ({
  appointment,
  onChange,
  customFields,
  onCustomFieldChange,
  formStructure,
  contacts,
  loading,
  inputValue,
  onInputChange,
  readOnlyDates,
  isPreview,
}) => {
  const renderCustomField = (field) => {
    const fieldId = `custom_${field.id}`;
    const fieldValue =
      customFields && customFields[fieldId] !== undefined
        ? customFields[fieldId]
        : appointment && appointment[fieldId] !== undefined
          ? appointment[fieldId]
          : "";

    const handleFieldChange = onCustomFieldChange || onChange;

    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue}
            onChange={handleFieldChange}
            required={field.required}
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue}
            onChange={handleFieldChange}
            required={field.required}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
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
              onChange={handleFieldChange}
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
                  handleFieldChange({
                    target: {
                      name: fieldId,
                      type: "checkbox",
                      value: e.target.checked,
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

  const contactValue = appointment?.contact || null;

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Autocomplete
          fullWidth
          options={contacts || []}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name}`
          }
          value={contactValue}
          loading={loading}
          inputValue={inputValue || ""}
          onInputChange={(event, newInputValue) => {
            onInputChange && onInputChange(newInputValue);
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
              placeholder="Seleccione un contacto"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
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
          value={appointment?.title || ""}
          onChange={onChange}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            name="status"
            value={appointment?.status || "pending"}
            onChange={onChange}
            required
          >
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="confirmed">Confirmada</MenuItem>
            <MenuItem value="cancelled">Cancelada</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label="Inicio"
            value={appointment?.start || null}
            readOnly={readOnlyDates}
            onChange={(newValue) => {
              !readOnlyDates &&
                onChange({
                  target: { name: "start", value: newValue },
                });
            }}
            slotProps={{
              textField: { fullWidth: true, required: true },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label="Fin"
            value={appointment?.end || null}
            readOnly={readOnlyDates}
            onChange={(newValue) => {
              !readOnlyDates &&
                onChange({
                  target: { name: "end", value: newValue },
                });
            }}
            slotProps={{
              textField: { fullWidth: true, required: true },
            }}
          />
        </LocalizationProvider>
      </Grid>

      {((formStructure?.custom_fields &&
        formStructure.custom_fields.length > 0) ||
        (isPreview &&
          appointment?.fields &&
          appointment.fields.length > 0)) && (
        <>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" fontWeight="500" sx={{ my: 1 }}>
              Campos personalizados
            </Typography>
            <Grid container spacing={2}>
              {(isPreview
                ? appointment?.fields
                : formStructure?.custom_fields
              )?.map((field) => (
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
        </>
      )}
    </Grid>
  );
};

AppointmentForm.propTypes = {
  appointment: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  customFields: PropTypes.object,
  onCustomFieldChange: PropTypes.func,
  formStructure: PropTypes.object,
  contacts: PropTypes.array,
  loading: PropTypes.bool,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  readOnlyDates: PropTypes.bool,
  isPreview: PropTypes.bool,
};

AppointmentForm.defaultProps = {
  appointment: {},
  formStructure: { default_fields: [], custom_fields: [] },
  contacts: [],
  loading: false,
  readOnlyDates: false,
  isPreview: false,
};
