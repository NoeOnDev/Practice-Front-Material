import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { verifyEmail, resendVerificationCode } from "../services/authUser";

export const Verify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const userData = { email, code };

    try {
      await verifyEmail(userData);
      localStorage.removeItem("userEmail");
      setSuccessMsg("¡Correo verificado exitosamente! Redirigiendo...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Verification failed:", error);
      setError(error.response?.data?.message || "Error de verificación. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setResending(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await resendVerificationCode(email);
      setSuccessMsg(`Nuevo código enviado a ${response.email}`);
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error("Error al reenviar código:", error);
      setError(error.response?.data?.message || "Error al reenviar el código");
    } finally {
      setResending(false);
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
            Verificación
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
          
          {successMsg && (
            <Alert severity="success" sx={{ width: "100%" }}>
              {successMsg}
            </Alert>
          )}
          
          <Typography variant="body1" gutterBottom align="center">
            Te hemos enviado un código de verificación a:<br />
            <strong>{email}</strong>
          </Typography>
          
          <TextField
            label="Código de Verificación"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : "Verificar"}
          </Button>
          
          <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
            {canResend ? (
              <Button 
                onClick={handleResendCode} 
                disabled={resending}
                sx={{ textTransform: 'none' }}
              >
                {resending ? <CircularProgress size={20} /> : "Reenviar código"}
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Reenviar código en {countdown} segundos
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
