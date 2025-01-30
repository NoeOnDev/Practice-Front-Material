import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export const Verify = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Verification Code:", code);
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
