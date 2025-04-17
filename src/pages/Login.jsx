import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signIn(email, password);
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ display: "flex", alignItems: "center", minHeight: "100vh" }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: "100%" }}>
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
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
          </Button>
          <Link component={RouterLink} to="/register" sx={{ marginTop: 2 }}>
            ¿No tienes una cuenta? Regístrate
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};
