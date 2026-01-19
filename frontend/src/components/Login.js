// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setSnack({ open: true, severity: "warning", message: "Email et mot de passe requis" });
      return;
    }

    try {
      const res = await login({ email, password }); // ✅ envoie un objet JSON
      if (res?.error) {
        setSnack({ open: true, severity: "error", message: res.error.message || "Erreur de connexion" });
      } else {
        const token = res.token || res.accessToken || "";
        if (token) {
          localStorage.setItem("token", token);
          setToken(token);
          setSnack({ open: true, severity: "success", message: "Connexion réussie ✅" });
          navigate("/"); // redirige vers Dashboard
        } else {
          setSnack({ open: true, severity: "error", message: "Jeton non reçu du serveur" });
        }
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "Erreur serveur" });
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>🔑 Connexion</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Se connecter
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
