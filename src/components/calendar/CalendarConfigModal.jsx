import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Divider,
  Grid,
  Checkbox,
} from "@mui/material";
import PropTypes from "prop-types";

export const CalendarConfigModal = ({
  open,
  onClose,
  config,
  onConfigChange,
}) => {
  const weekDays = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 0, label: "Domingo" },
  ];

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "daysOfWeek") {
      onConfigChange({
        ...config,
        businessHours: {
          ...config.businessHours,
          daysOfWeek: checked
            ? [...config.businessHours.daysOfWeek, value]
            : config.businessHours.daysOfWeek.filter((day) => day !== value),
        },
      });
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      onConfigChange({
        ...config,
        [parent]: {
          ...config[parent],
          [child]: value,
        },
      });
    } else {
      onConfigChange({
        ...config,
        [name]: value !== undefined ? value : checked,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configuración del Calendario</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Horario Laboral
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
              Días laborales
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {weekDays.map((day) => (
                <Grid item xs={6} sm={4} key={day.value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={config.businessHours.daysOfWeek.includes(
                          day.value
                        )}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "daysOfWeek",
                              value: day.value,
                              checked: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label={day.label}
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hora de inicio</InputLabel>
                  <Select
                    value={config.businessHours.startTime}
                    onChange={handleChange}
                    name="businessHours.startTime"
                    label="Hora de inicio"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <MenuItem
                        key={i}
                        value={`${i.toString().padStart(2, "0")}:00`}
                      >
                        {`${i.toString().padStart(2, "0")}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hora de fin</InputLabel>
                  <Select
                    value={config.businessHours.endTime}
                    onChange={handleChange}
                    name="businessHours.endTime"
                    label="Hora de fin"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <MenuItem
                        key={i}
                        value={`${i.toString().padStart(2, "0")}:00`}
                      >
                        {`${i.toString().padStart(2, "0")}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CalendarConfigModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired,
};
