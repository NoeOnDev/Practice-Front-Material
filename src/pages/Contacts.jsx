import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { createContact } from "../services/contactService";

export const Contacts = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    lada: "",
    telefono: "",
    estado: "",
    direccion: "",
    fechaNacimiento: null,
    notas: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const transformedData = {
      first_name: formData.nombres,
      last_name: formData.apellidoPaterno,
      middle_name: formData.apellidoMaterno,
      email: formData.email,
      phone_code: formData.lada,
      phone_number: formData.telefono,
      state:
        formData.estado === "CDMX"
          ? "Mexico City"
          : formData.estado === "JAL"
            ? "Jalisco"
            : "Nuevo Leon",
      address: formData.direccion,
      birth_date: formData.fechaNacimiento
        ? formData.fechaNacimiento.toISOString().split("T")[0]
        : null,
      notes: formData.notas,
    };

    try {
      await createContact(transformedData);
      alert("Contacto guardado exitosamente");
      setFormData({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        lada: "",
        telefono: "",
        estado: "",
        direccion: "",
        fechaNacimiento: null,
        notas: "",
      });
    } catch (error) {
      alert("Error al guardar el contacto");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 800,
          width: "100%",
          mx: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Nuevo Contacto
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nombre(s)"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Apellido Materno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Lada</InputLabel>
                <Select
                  label="Lada"
                  name="lada"
                  value={formData.lada}
                  onChange={handleChange}
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
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
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
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
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
                  value={formData.fechaNacimiento}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      fechaNacimiento: newValue,
                    }));
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
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Guardar Contacto
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
