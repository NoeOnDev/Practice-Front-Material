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
} from "@mui/material";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { es } from "date-fns/locale";
import { CustomFields } from "./CustomFields";

export const AppointmentForm = ({
  appointment,
  onChange,
  contacts,
  loading,
  inputValue,
  onInputChange,
  readOnlyDates,
}) => {
  const contactValue = appointment?.contact || null;
  const isReadOnly =
    appointment?.status === "attended" || appointment?.status === "cancelled";
  const hasFieldValues =
    appointment?.field_values && appointment.field_values.length > 0;

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
          disabled={isReadOnly}
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
          disabled={isReadOnly}
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
            disabled={!appointment?.id || isReadOnly}
          >
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem
              value="attended"
              disabled={appointment?.status === "pending"}
            >
              Atendida
            </MenuItem>
            <MenuItem value="cancelled">Cancelada</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label="Inicio"
            value={appointment?.start || null}
            readOnly={readOnlyDates || isReadOnly}
            onChange={(newValue) => {
              !readOnlyDates &&
                !isReadOnly &&
                onChange({
                  target: { name: "start", value: newValue },
                });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                disabled: isReadOnly,
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateTimePicker
            label="Fin"
            value={appointment?.end || null}
            readOnly={readOnlyDates || isReadOnly}
            onChange={(newValue) => {
              !readOnlyDates &&
                !isReadOnly &&
                onChange({
                  target: { name: "end", value: newValue },
                });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                disabled: isReadOnly,
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12}>
      {isReadOnly && hasFieldValues && (
        <CustomFields
          fields={appointment.field_values.map((fv) => fv.field)}
          values={appointment.field_values.reduce((acc, fv) => {
            acc[`custom_${fv.field.id}`] = fv.value;
            return acc;
          }, {})}
          readOnly={true}
          gridSize={{ xs: 12, sm: 12 }}
        />
      )}
      </Grid>
    </Grid>
  );
};

AppointmentForm.propTypes = {
  appointment: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  contacts: PropTypes.array,
  loading: PropTypes.bool,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  readOnlyDates: PropTypes.bool,
  formStructure: PropTypes.object,
};

AppointmentForm.defaultProps = {
  appointment: {},
  contacts: [],
  loading: false,
  readOnlyDates: false,
  formStructure: { custom_fields: [] },
};
