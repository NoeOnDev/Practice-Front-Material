import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import PropTypes from "prop-types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { selectBusinessType } from "../../services/businessService";
import { TypeSelectionStep } from "./onboarding/TypeSelectionStep";
import { FormPreviewStep } from "./onboarding/FormPreviewStep";

export const BusinessTypeOnboarding = ({ businessTypes, onComplete }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Seleccionar tipo de negocio", "Vista previa"];

  const handleNext = () => {
    if (activeStep === 0 && !selectedType) return;
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);

      await selectBusinessType(selectedType.id);

      onComplete();
    } catch (error) {
      console.error("Error al seleccionar el tipo de negocio:", error);
      alert("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TypeSelectionStep
            businessTypes={businessTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        );
      case 1:
        return <FormPreviewStep selectedType={selectedType} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        position: "relative",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "lg", mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {renderStepContent()}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 4,
          pt: 2,
          borderTop: 1,
          borderColor: "divider",
          width: "100%",
        }}
      >
        {activeStep > 0 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ minWidth: 120 }}
          >
            Atrás
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={!selectedType}
            sx={{ minWidth: 120 }}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinish}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Finalizar"
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
};

BusinessTypeOnboarding.propTypes = {
  businessTypes: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
};
