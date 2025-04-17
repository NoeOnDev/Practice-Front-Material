import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FieldsManagement } from "../components/configuration/FieldsManagement";
import { ProfileSettings } from "../components/configuration/ProfileSettings";
import { getAppointmentFields } from "../services/appointmentFieldService";

export const AppointmentFieldsConfig = () => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const fieldsData = await getAppointmentFields();
      setFields(fieldsData);
    } catch (error) {
      console.error("Error cargando campos personalizados:", error);
      setError(
        "No se pudieron cargar los campos personalizados. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldsChange = (updatedFields) => {
    setFields(updatedFields);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
          Configuración
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Campos Personalizados" />
          <Tab label="Perfil" />
        </Tabs>

        {activeTab === 0 && (
          <>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <FieldsManagement
                fields={fields}
                onFieldsChange={handleFieldsChange}
                onRefresh={loadFields}
              />
            )}
          </>
        )}

        {activeTab === 1 && <ProfileSettings />}
      </Paper>
    </Box>
  );
};