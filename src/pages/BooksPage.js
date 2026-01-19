import React, { useEffect, useState, useCallback } from "react";
import { getBooks, getUsers, createLoan } from "../api";
import {
  Container, Typography, Grid, Card, CardContent,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, MenuItem, Snackbar, Alert
} from "@mui/material";

export default function BooksPage({ token }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  // Charger livres et utilisateurs
  const loadBooks = useCallback(async () => {
    const data = await getBooks(token);
    setBooks(Array.isArray(data) ? data : []);
  }, [token]);

  const loadUsers = useCallback(async () => {
    const data = await getUsers(token);
    setUsers(Array.isArray(data) ? data : []);
  }, [token]);

  useEffect(() => {
    if (token) {
      loadBooks();
      loadUsers();
    }
  }, [token, loadBooks, loadUsers]);

  const filteredBooks = books.filter(b =>
    b.titre.toLowerCase().includes(search.toLowerCase()) ||
    b.auteur.toLowerCase().includes(search.toLowerCase())
  );

  // Créer un prêt pour le livre sélectionné
  async function handleCreateLoan() {
    if (!userId || !startDate || !endDate) {
      setSnack({ open: true, severity: "warning", message: "Veuillez remplir tous les champs." });
      return;
    }
    const res = await createLoan(token, {
      userId,
      bookId: selectedBook.id,
      startDate,
      endDate
    });
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || "Erreur création prêt" });
    } else {
      setSnack({ open: true, severity: "success", message: "Prêt créé avec succès ✅" });
      setUserId(""); setStartDate(""); setEndDate("");
      setSelectedBook(null);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>📚 Liste des livres</Typography>

      <TextField
        label="Recherche"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredBooks.map(b => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 6, cursor: "pointer" }}
              onClick={() => setSelectedBook(b)}
            >
              <CardContent>
                <Typography variant="h6">{b.titre}</Typography>
                <Typography color="text.secondary">{b.auteur}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogue d’informations + création de prêt */}
      <Dialog open={!!selectedBook} onClose={() => setSelectedBook(null)} fullWidth maxWidth="sm">
        <DialogTitle>📖 Détails du livre</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <>
              <Typography variant="h6">{selectedBook.titre}</Typography>
              <Typography>Auteur : {selectedBook.auteur}</Typography>
              <Typography>Édition : {selectedBook.edition}</Typography>
              {selectedBook.isbn_13 && <Typography>ISBN : {selectedBook.isbn_13}</Typography>}
              {selectedBook.coverId && (
                <img
                  alt={selectedBook.titre}
                  src={`https://covers.openlibrary.org/b/id/${selectedBook.coverId}-L.jpg`}
                  style={{ marginTop: 12, width: "100%", borderRadius: 8 }}
                />
              )}

              <Typography variant="h6" sx={{ mt: 3 }}>➕ Créer un prêt</Typography>
              <TextField
                select
                label="Utilisateur"
                fullWidth
                sx={{ mt: 2 }}
                value={userId}
                onChange={e => setUserId(e.target.value)}
              >
                <MenuItem value="">— Sélectionner —</MenuItem>
                {users.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.prenom} {u.nom} ({u.email})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="date"
                label="Date début"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <TextField
                type="date"
                label="Date fin"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBook(null)}>Fermer</Button>
          <Button variant="contained" onClick={handleCreateLoan}>Créer le prêt</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
