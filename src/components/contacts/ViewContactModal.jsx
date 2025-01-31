import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";

export const ViewContactModal = ({ open, contact, onClose }) => {
  if (!contact) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles del Contacto</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Nombre Completo</Typography>
            <Typography>
              {`${contact.first_name} ${contact.last_name} ${contact.middle_name}`}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{contact.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Teléfono</Typography>
            <Typography>{`${contact.phone_code} ${contact.phone_number}`}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Estado</Typography>
            <Typography>{contact.state}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Dirección</Typography>
            <Typography>{contact.address}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Fecha de Nacimiento</Typography>
            <Typography>{contact.birth_date}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Notas</Typography>
            <Typography>{contact.notes}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

ViewContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  contact: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
