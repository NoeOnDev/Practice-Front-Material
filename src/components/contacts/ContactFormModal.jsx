import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";
import { COUNTRY_CODES } from "./countryCodes";
import { ESTADOS_MEXICO } from "./estadosMexico";

export const ContactFormModal = ({
  open,
  contact,
  onClose,
  onSubmit,
  onChange,
  title,
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nombre(s)"
                name="first_name"
                value={contact.first_name}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="last_name"
                value={contact.last_name}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Apellido Materno"
                name="middle_name"
                value={contact.middle_name}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Correo Electrónico"
                name="email"
                value={contact.email}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                options={COUNTRY_CODES}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return `${option.code}  ${option.label}`;
                }}
                filterOptions={(options, { inputValue }) => {
                  const searchTerm = inputValue.toLowerCase();
                  return options.filter(
                    option => 
                      option.code.toLowerCase().includes(searchTerm) || 
                      option.label.toLowerCase().includes(searchTerm)
                  );
                }}
                value={COUNTRY_CODES.find((c) => c.code === contact.phone_code) || null}
                onChange={(event, newValue) => {
                  onChange({
                    target: {
                      name: "phone_code",
                      value: newValue ? newValue.code : "+52",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Código de País"
                    required
                    fullWidth
                    placeholder="Buscar por código o país..."
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" color="text.secondary">
                        {option.code}
                      </Typography>
                      <Typography variant="body1">
                        {option.label}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone_number"
                value={contact.phone_number}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Autocomplete
                fullWidth
                options={ESTADOS_MEXICO}
                value={contact.estado}
                onChange={(event, newValue) => {
                  onChange({
                    target: {
                      name: "estado",
                      value: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Estado" required fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={contact.address}
                onChange={onChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={contact.fechaNacimiento}
                  onChange={(newValue) => {
                    onChange({
                      target: {
                        name: "fechaNacimiento",
                        value: newValue,
                      },
                    });
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                name="notes"
                value={contact.notes}
                onChange={onChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ContactFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  contact: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
