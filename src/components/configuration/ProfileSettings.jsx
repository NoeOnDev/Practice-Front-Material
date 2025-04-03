import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { getCurrentUser } from "../../services/userService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    photoURL: null,
    id: null,
    emailVerified: false,
    hasCustomFields: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setProfile(userData.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setImageUploading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/profile/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile((prev) => ({
        ...prev,
        photoURL: response.data.photoURL,
      }));
      alert("Imagen de perfil actualizada exitosamente.");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("No se pudo subir la imagen. Intenta nuevamente.");
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6">Configuración del Perfil</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={profile.photoURL || "/default-avatar.png"}
          alt="Imagen de perfil"
          sx={{ width: 100, height: 100 }}
        />
        <Button variant="outlined" component="label" disabled={imageUploading}>
          {imageUploading ? "Subiendo..." : "Cambiar Imagen"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Nombre"
        value={profile.displayName}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="Correo Electrónico"
        value={profile.email}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="Estado de Verificación"
        value={profile.emailVerified ? "Verificado" : "No Verificado"}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="Campos Personalizados"
        value={profile.hasCustomFields ? "Habilitados" : "Deshabilitados"}
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  );
};

ProfileSettings.propTypes = {
  profile: PropTypes.object,
  onSave: PropTypes.func,
};