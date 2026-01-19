import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Box,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Brightness4, Brightness7, MenuBook, Menu as MenuIcon } from "@mui/icons-material";

import Login from "./components/Login";
import Users from "./components/Users";
import Books from "./components/Books";
import Loans from "./components/Loans";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Home from "./components/Home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🎨 Thème moderne
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
      success: { main: "#2e7d32" }
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h6: { fontWeight: 600 }
    }
  });

  // Sauvegarde des préférences
  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("darkMode", darkMode);
  }, [token, darkMode]);

  // 🧭 Liens de navigation
  const navLinks = token
    ? [
        { label: "Dashboard", path: "/" },
        { label: "Utilisateurs", path: "/users" },
        { label: "Livres", path: "/books" },
        { label: "Prêts", path: "/loans" },
        { label: "Inscription", path: "/signup" }
      ]
    : [{ label: "Connexion", path: "/login" }];

  // Gestion déconnexion
  const handleLogout = () => {
    setToken("");
    setSnack({ open: true, severity: "info", message: "Déconnecté avec succès ✅" });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Barre de navigation */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <MenuBook sx={{ mr: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              📚 Ebook Library 2026
            </Typography>

            {/* Menu desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {navLinks.map(link => (
                <Button
                  key={link.path}
                  color="inherit"
                  component={Link}
                  to={link.path}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Menu mobile */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Toggle Dark Mode */}
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Connexion / Déconnexion */}
            {token && (
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Drawer mobile */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map(link => (
              <ListItem
                button
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Routes */}
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/signup" element={<Signup />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <Dashboard
                    user={{
                      prenom: "Admin",
                      nom: "Biblio",
                      email: "admin@biblio.com"
                    }}
                    stats={{ books: 3, loans: 2, users: 5 }}
                    token={token}
                  />
                }
              />
              <Route path="/users" element={<Users token={token} />} />
              <Route path="/books" element={<Books token={token} />} />
              <Route path="/loans" element={<Loans token={token} />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          {/* Page 404 */}
          <Route path="*" element={<Typography sx={{ p: 3 }}>❌ Page non trouvée</Typography>} />
        </Routes>

        {/* Snackbar feedback */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack(s => ({ ...s, open: false }))}
        >
          <Alert severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Router>
    </ThemeProvider>
  );
}

export default App;
