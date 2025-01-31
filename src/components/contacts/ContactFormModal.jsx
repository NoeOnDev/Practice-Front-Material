import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

export const ContactFormModal = ({
  open,
  contact,
  onClose,
  onSubmit,
  onChange,
  title
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Lada</InputLabel>
                <Select
                  label="Lada"
                  name="phone_code"
                  value={contact.phone_code}
                  onChange={onChange}
                  required
                >
                  <MenuItem value="+52">+52 (MX)</MenuItem>
                  <MenuItem value="+1">+1 (USA)</MenuItem>
                  <MenuItem value="+34">+34 (ESP)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
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
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="estado"
                  value={contact.estado}
                  onChange={onChange}
                  required
                >
                  <MenuItem value="CDMX">Ciudad de México</MenuItem>
                  <MenuItem value="JAL">Jalisco</MenuItem>
                  <MenuItem value="NL">Nuevo León</MenuItem>
                </Select>
              </FormControl>
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
