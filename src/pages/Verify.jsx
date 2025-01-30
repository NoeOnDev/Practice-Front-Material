import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authUser";

export const Verify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await verifyEmail(email, code);
      localStorage.removeItem("userEmail");
      alert("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
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
        Verificación
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ingresa el código que se ha enviado a {email}
      </Typography>
      <TextField
        label="Código de Verificación"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Verificar
      </Button>
    </Box>
  );
};
