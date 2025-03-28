import { useState } from "react";
import { Box, Typography, Paper, Alert, Divider, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
          <strong>{selectedType?.name}</strong>. Con esta configuración, podrás
          gestionar citas con los siguientes campos:
        </Typography>

        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Campos básicos:
        </Typography>

        <Box
          component="ul"
          sx={{
            mb: 3,
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
            <strong>Título de la cita</strong> - Descripción breve del servicio
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            <strong>Estado</strong> - Pendiente, Confirmada o Cancelada
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            <strong>Fecha y hora de inicio</strong> - Momento en que comienza la
            cita
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            <strong>Fecha y hora de fin</strong> - Momento en que termina la
            cita
          </Typography>
        </Box>

        {selectedType?.fields && selectedType.fields.length > 0 ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Campos personalizados:
            </Typography>
            <Box
              component="ul"
              sx={{
                pl: 3,
                overflow: "auto",
                maxHeight: "250px",
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
          </>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info">
              Esta opción no incluye campos personalizados adicionales.
            </Alert>
          </>
        )}

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
