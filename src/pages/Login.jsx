import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authUser";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { email, password };

    try {
      const response = await loginUser(userData);
      localStorage.setItem("token", response.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        marginTop: 8,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Iniciar Sesión
      </Button>
      <Link component={RouterLink} to="/register" sx={{ marginTop: 2 }}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </Box>
  );
};
