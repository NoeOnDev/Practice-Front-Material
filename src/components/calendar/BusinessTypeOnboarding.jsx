import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { selectBusinessType } from "../../services/businessService";

export const BusinessTypeOnboarding = ({ businessTypes, onComplete }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [mode, setMode] = useState("customize");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleTypeSelection = (businessType) => {
    setSelectedType(businessType);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);
      await selectBusinessType(selectedType.id, mode);
      onComplete();
    } catch (error) {
      console.error("Error al seleccionar el tipo de negocio:", error);
      alert("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Bienvenido a tu agenda
      </Typography>

      <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        Antes de continuar, elige el tipo de negocio que mejor se adapte a tus
        necesidades
      </Typography>

      <Grid container spacing={3} maxWidth="lg">
        {businessTypes.map((type) => (
          <Grid item xs={12} md={4} key={type.id}>
            <Card
              elevation={selectedType?.id === type.id ? 8 : 1}
              sx={{
                height: "100%",
                border: selectedType?.id === type.id ? 2 : 0,
                borderColor: "primary.main",
                transition: "all 0.3s",
              }}
            >
              <CardActionArea
                onClick={() => handleTypeSelection(type)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {type.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {type.description}
                  </Typography>

                  {type.fields?.length > 0 && (
                    <Box sx={{ mt: "auto" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Campos incluidos:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {type.fields.slice(0, 3).map((field) => (
                          <Typography
                            component="li"
                            variant="body2"
                            key={field.id}
                          >
                            {field.name}
                          </Typography>
                        ))}
                        {type.fields.length > 3 && (
                          <Typography variant="body2" color="text.secondary">
                            Y {type.fields.length - 3} más...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar selección</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Has seleccionado <strong>{selectedType?.name}</strong> como tu tipo
            de negocio.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Cómo quieres usar este template?
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Modo</InputLabel>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              label="Modo"
            >
              <MenuItem value="customize">Personalizar (Recomendado)</MenuItem>
              <MenuItem value="use_template">Usar tal cual</MenuItem>
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ mt: 3 }} variant="outlined">
            No te preocupes, podrás cambiar esta configuración más adelante
            desde los ajustes de tu cuenta. Tu elección actual solo es el punto
            de partida.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

BusinessTypeOnboarding.propTypes = {
  businessTypes: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
};
