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
import { getAppointmentFormStructure } from "../../services/appointmentService";
import { FormPreviewStep } from "./onboarding/FormPreviewStep";
import { CustomizeFormStep } from "./onboarding/CustomizeFormStep";

export const BusinessTypeOnboarding = ({ businessTypes, onComplete }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formStructure, setFormStructure] = useState(null);
  const [customizationCompleted, setCustomizationCompleted] = useState(false);

  const steps = ["Seleccionar tipo de negocio", "Vista previa", "Personalizar"];

  const handleNext = async () => {
    if (activeStep === 0 && !selectedType) return;

    if (activeStep === 1) {
      try {
        setLoading(true);
        await selectBusinessType(selectedType.id);

        const structure = await getAppointmentFormStructure();
        setFormStructure(structure);
      } catch (error) {
        console.error("Error al preparar la personalización:", error);
        alert("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
        return;
      } finally {
        setLoading(false);
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);

      if (activeStep === 1) {
        await selectBusinessType(selectedType.id);
      }

      onComplete();
    } catch (error) {
      console.error("Error al finalizar el onboarding:", error);
      alert("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizationComplete = () => {
    setCustomizationCompleted(true);
  };

  const handleSkipCustomization = () => {
    handleFinish();
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
      case 2:
        return (
          <CustomizeFormStep
            formStructure={formStructure}
            selectedType={selectedType}
            onComplete={handleCustomizationComplete}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) return !selectedType;
    return false;
  };

  const isFinishDisabled = () => {
    if (activeStep === 2) return !customizationCompleted && loading;
    return loading;
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
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

        {activeStep === 1 && (
          <Button
            variant="outlined"
            onClick={handleSkipCustomization}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Finalizar sin personalizar
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            disabled={isNextDisabled() || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Siguiente"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinish}
            disabled={isFinishDisabled()}
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
