import { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Link, 
  Paper,
  Container,
  CircularProgress,
  Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authUser";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    const userData = {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await registerUser(userData);
      localStorage.setItem("userEmail", response.email || email);
      navigate("/verify");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Error en el registro. Por favor inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={6} sx={{ padding: 4, width: '100%' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Registro
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Confirmar Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Registrarse"}
          </Button>
          <Link component={RouterLink} to="/login" sx={{ marginTop: 2 }}>
            ¿Ya tienes una cuenta? Inicia Sesión
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};
