import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function Dashboard({ user, stats }) {
  const navigate = useNavigate();

  // 👇 Vérifie si c'est l'admin principal
  const isAdminPrincipal =
    user?.role === "admin" && user?.email === "admin@biblio.com";

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        👋 Bienvenue {user?.prenom} {user?.nom}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {user?.email} —{" "}
        {isAdminPrincipal ? (
          <strong style={{ color: "red" }}>Administrateur principal</strong>
        ) : (
          <strong>{user?.role?.toUpperCase()}</strong>
        )}
      </Typography>
      <Divider sx={{ my: 3 }} />

      {/* Cards */}
      <Grid container spacing={3}>
        {/* 📚 Livres */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <LibraryBooksIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                📚 Livres
              </Typography>
              <Typography variant="h4">{stats?.books || 0}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                fullWidth
                onClick={() => navigate("/books")}
              >
                Voir les livres
              </Button>
              {isAdminPrincipal && (
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() => navigate("/books/add")}
                >
                  ➕ Ajouter un livre
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 👥 Utilisateurs */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <GroupIcon color="secondary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                👥 Utilisateurs
              </Typography>
              <Typography variant="h4">{stats?.users || 0}</Typography>
              {isAdminPrincipal ? (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={() => navigate("/users")}
                >
                  Gérer les utilisateurs
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={() => navigate("/profile")}
                >
                  Mon profil
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 📖 Prêts */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <AssignmentIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                📖 Prêts
              </Typography>
              <Typography variant="h4">{stats?.loans || 0}</Typography>
              {isAdminPrincipal ? (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={() => navigate("/loans")}
                >
                  Voir tous les prêts
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={() => navigate("/loans/my")}
                >
                  Mes prêts
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
