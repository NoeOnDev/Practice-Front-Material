import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Fade,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import { customScrollbarStyles } from "../../../utils/styleUtils";

export const TypeSelectionStep = ({
  businessTypes,
  selectedType,
  onSelectType,
}) => {
  return (
    <>
      <Box
        sx={{
          maxWidth: "lg",
          width: "100%",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 2 }}>
          Bienvenido a tu agenda
        </Typography>

        <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 1 }}>
          Antes de continuar, elige el tipo de negocio que mejor se adapte a tus
          necesidades
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Selecciona una de las opciones para continuar
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          ...customScrollbarStyles,
          p: 1,
        }}
      >
        {businessTypes.map((type) => (
          <Grid item xs={12} md={4} key={type.id}>
            <Card
              elevation={selectedType?.id === type.id ? 8 : 1}
              sx={{
                height: "100%",
                border: selectedType?.id === type.id ? 3 : 0,
                borderColor: "primary.main",
                position: "relative",
                overflow: "visible",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedType?.id === type.id && (
                <Fade in={selectedType?.id === type.id}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -9,
                      right: -9,
                      backgroundColor: "primary.main",
                      color: "white",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </Box>
                </Fade>
              )}
              <CardActionArea
                onClick={() => onSelectType(type)}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  height: "100%",
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
    </>
  );
};

TypeSelectionStep.propTypes = {
  businessTypes: PropTypes.array.isRequired,
  selectedType: PropTypes.object,
  onSelectType: PropTypes.func.isRequired,
};
