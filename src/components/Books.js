import React, { useEffect, useState, useCallback } from "react";
import { getBooks, importBooks } from "../api";
import {
  Container, Typography, Grid, Card, CardContent,
  TextField, FormControl, InputLabel, Select, MenuItem, Pagination,
  Button, Snackbar, Alert, Box
} from "@mui/material";

export default function BooksPage({ token }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("titre");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [importQuery, setImportQuery] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  const loadBooks = useCallback(async () => {
    const data = await getBooks(token);
    const allBooks = Array.isArray(data) ? data : [];
    const perPage = 9;
    setTotalPages(Math.ceil(allBooks.length / perPage));
    const start = (page - 1) * perPage;
    setBooks(allBooks.slice(start, start + perPage));
  }, [token, page]);

  useEffect(() => {
    if (token) loadBooks();
  }, [token, page, loadBooks]);

  const sortedBooks = [...books]
    .filter(b =>
      b.titre.toLowerCase().includes(search.toLowerCase()) ||
      b.auteur.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "titre") return a.titre.localeCompare(b.titre);
      if (sortBy === "auteur") return a.auteur.localeCompare(b.auteur);
      if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  // Fonction pour importer un livre
  async function handleImportBook() {
    if (!importQuery.trim()) {
      setSnack({ open: true, severity: "warning", message: "Veuillez entrer un titre ou ISBN." });
      return;
    }
    const res = await importBooks(token, importQuery);
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || "Erreur import livre" });
    } else {
      setSnack({ open: true, severity: "success", message: "Livre importé avec succès ✅" });
      setImportQuery("");
      loadBooks(); // recharge la liste
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>📚 Liste des livres</Typography>

      {/* Barre de recherche et tri */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Recherche"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tri par</InputLabel>
            <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <MenuItem value="titre">Titre</MenuItem>
              <MenuItem value="auteur">Auteur</MenuItem>
              <MenuItem value="date">Date d’ajout</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Import de livres */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Importer un livre (titre ou ISBN)"
          fullWidth
          value={importQuery}
          onChange={e => setImportQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleImportBook}>
          Importer
        </Button>
      </Box>

      {/* Liste des livres */}
      <Grid container spacing={3}>
        {sortedBooks.map(b => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
              <CardContent>
                <Typography variant="h6">{b.titre}</Typography>
                <Typography color="text.secondary">{b.auteur}</Typography>
                {b.edition && <Typography color="text.secondary">Édition: {b.edition}</Typography>}
                {b.coverId && (
                  <img
                    alt={b.titre}
                    src={`https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`}
                    style={{ marginTop: 12, width: "100%", borderRadius: 8 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />

      {/* Snackbar feedback */}
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
