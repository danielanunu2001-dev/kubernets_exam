// src/components/Home.js
import React from "react";
import {
  Container, Typography, Button, Box, Card, CardContent
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
      <Card sx={{ borderRadius: 4, boxShadow: 8, p: 4 }}>
        <CardContent>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
            📚 Bienvenue à BiblioConnect
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Votre bibliothèque intelligente, moderne et interactive — version 2026 🚀
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 2, borderRadius: 3, fontSize: "1.1rem" }}
            >
              🔐 Connexion
            </Button>

            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="secondary"
              sx={{ px: 4, py: 2, borderRadius: 3, fontSize: "1.1rem" }}
            >
              📝 Inscription
            </Button>

            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              color="success"
              sx={{ px: 4, py: 2, borderRadius: 3, fontSize: "1.1rem" }}
            >
              🚀 Tableau de bord
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
