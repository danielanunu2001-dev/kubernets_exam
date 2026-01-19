// src/components/Signup.js
import React, { useState } from "react";
import { registerUser } from "../api";
import {
  Container, Card, CardContent, TextField, Button,
  Typography, Snackbar, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", password: "", age: "", ecole: ""
  });
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { prenom, nom, email, password } = form;
    if (!prenom || !nom || !email || !password) {
      setSnack({ open: true, severity: "warning", message: "Veuillez remplir les champs obligatoires" });
      return;
    }
    const res = await registerUser(form);
    if (res?.error || res?.message) {
      setSnack({ open: true, severity: "error", message: res.message || res.error?.message || "Erreur" });
    } else {
      setSnack({ open: true, severity: "success", message: "✅ Compte créé avec succès !" });
      setTimeout(() => navigate("/login"), 1500);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>📝 Inscription</Typography>
          <form onSubmit={handleSubmit}>
            <TextField name="prenom" label="Prénom" fullWidth sx={{ mb: 2 }} value={form.prenom} onChange={onChange} />
            <TextField name="nom" label="Nom" fullWidth sx={{ mb: 2 }} value={form.nom} onChange={onChange} />
            <TextField name="email" label="Email" type="email" fullWidth sx={{ mb: 2 }} value={form.email} onChange={onChange} />
            <TextField name="password" label="Mot de passe" type="password" fullWidth sx={{ mb: 2 }} value={form.password} onChange={onChange} />
            <TextField name="age" label="Âge" fullWidth sx={{ mb: 2 }} value={form.age} onChange={onChange} />
            <TextField name="ecole" label="École" fullWidth sx={{ mb: 2 }} value={form.ecole} onChange={onChange} />
            <Button variant="contained" fullWidth type="submit">S'inscrire</Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
