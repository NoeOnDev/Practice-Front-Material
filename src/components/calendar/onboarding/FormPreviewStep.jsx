import { useState } from "react";
import { Box, Typography, Paper, Alert, Button, Grid } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PropTypes from "prop-types";
import { FormPreviewModal } from "./FormPreviewModal";
import { customScrollbarStyles } from "../../../utils/styleUtils";

export const FormPreviewStep = ({ selectedType }) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "lg",
        mt: 2,
        overflow: "auto",
        maxHeight: "100%",
        ...customScrollbarStyles,
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        Vista previa del formulario
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          position: "relative",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {selectedType?.name}
        </Typography>

        <Typography variant="body1" paragraph>
          Has seleccionado el tipo de negocio{" "}
          <strong>{selectedType?.name}</strong>. Con esta configuración, tu
          agenda funcionará en dos etapas:
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Primera etapa: Creación de cita */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{ p: 2, height: "100%", bgcolor: "background.default" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="600">
                  Etapa 1: Creación de cita
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                Al crear una nueva cita, utilizarás estos campos básicos que son
                comunes para todos los tipos de negocio:
              </Typography>

              <Box
                component="ul"
                sx={{
                  pl: 3,
                  overflow: "auto",
                  maxHeight: "200px",
                  ...customScrollbarStyles,
                }}
              >
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Contacto</strong> - Selección del cliente para la cita
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Título de la cita</strong> - Descripción breve del
                  servicio
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Estado</strong> - Pendiente, Confirmada o Cancelada
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Fecha y hora de inicio</strong> - Momento en que
                  comienza la cita
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  <strong>Fecha y hora de fin</strong> - Momento en que termina
                  la cita
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Segunda etapa: Atención de cita */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{ p: 2, height: "100%", bgcolor: "background.default" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="600">
                  Etapa 2: Atención de cita
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                Durante la atención al cliente, registrarás información
                específica según el tipo de negocio que has seleccionado:
              </Typography>

              {selectedType?.fields && selectedType.fields.length > 0 ? (
                <Box
                  component="ul"
                  sx={{
                    pl: 3,
                    overflow: "auto",
                    maxHeight: "200px",
                    ...customScrollbarStyles,
                  }}
                >
                  {selectedType.fields.map((field) => (
                    <Typography component="li" key={field.id} sx={{ mb: 1 }}>
                      <strong>{field.name}</strong>
                      <Typography component="span" color="text.secondary">
                        {field.required ? " (Obligatorio)" : " (Opcional)"}
                      </Typography>
                      {field.type === "select" && field.options?.length > 0 && (
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, ml: 2 }}
                        >
                          Opciones: {field.options.join(", ")}
                        </Typography>
                      )}
                      {field.type && (
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, ml: 2 }}
                        >
                          Tipo: {renderFieldType(field.type)}
                        </Typography>
                      )}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  Este tipo de negocio no incluye campos adicionales para la
                  atención de citas.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>¿Cómo funciona?</strong> Primero agendarás una cita con los
            datos básicos (etapa 1). Cuando el cliente llegue, podrás hacer clic
            en &quot;Atender cita&quot; para registrar los detalles específicos
            (etapa 2).
          </Typography>
        </Alert>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setPreviewModalOpen(true)}
          >
            Ver formulario de ejemplo
          </Button>
        </Box>
      </Paper>

      <FormPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        businessType={selectedType}
      />
    </Box>
  );
};

const renderFieldType = (type) => {
  switch (type) {
    case "text":
      return "Campo de texto";
    case "select":
      return "Lista desplegable";
    case "number":
      return "Campo numérico";
    case "boolean":
      return "Casilla de verificación";
    default:
      return type;
  }
};

FormPreviewStep.propTypes = {
  selectedType: PropTypes.object,
};
