// src/pages/LoansPage.js
import React, { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Button, Divider, Snackbar, Alert, Box, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { getUsers, getBooks, getLoans, createLoan, finishLoan, updateLoan, deleteLoan } from "../api";
import DoneIcon from '@mui/icons-material/Done';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function LoansPage({ token }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  // État pour édition
  const [editOpen, setEditOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [editUserId, setEditUserId] = useState("");
  const [editBookId, setEditBookId] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  useEffect(() => {
    if (!token) return;
    loadInitial();
    // eslint-disable-next-line
  }, [token]);

  async function loadInitial() {
    const [uRes, bRes, lRes] = await Promise.all([getUsers(token), getBooks(token), getLoans(token)]);
    if (uRes?.error) setSnack({ open: true, severity: "error", message: uRes.error.message || JSON.stringify(uRes.error) });
    else setUsers(Array.isArray(uRes) ? uRes : []);
    if (bRes?.error) setSnack({ open: true, severity: "error", message: bRes.error.message || JSON.stringify(bRes.error) });
    else setBooks(Array.isArray(bRes) ? bRes : []);
    if (lRes?.error) setSnack({ open: true, severity: "error", message: lRes.error.message || JSON.stringify(lRes.error) });
    else setLoans(Array.isArray(lRes) ? lRes : []);
  }

  async function handleCreateLoan() {
    if (!userId || !bookId || !startDate || !endDate) {
      setSnack({ open: true, severity: "warning", message: "Veuillez remplir tous les champs." });
      return;
    }
    const res = await createLoan(token, { userId, bookId, startDate, endDate });
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || JSON.stringify(res.error) });
    } else {
      setSnack({ open: true, severity: "success", message: "Prêt créé." });
      setUserId(""); setBookId(""); setStartDate(""); setEndDate("");
      if (res.id) setLoans(prev => [res, ...prev]);
      else loadInitial();
    }
  }

  async function handleFinishLoan(loanId) {
    if (!window.confirm("Confirmer la fin du prêt ?")) return;
    const res = await finishLoan(token, loanId);
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || JSON.stringify(res.error) });
    } else {
      setSnack({ open: true, severity: "success", message: "Prêt marqué comme terminé." });
      setLoans(prev => prev.map(l => (l.id === loanId ? { ...l, finished: true } : l)));
    }
  }

  // Ouvrir le dialogue d'édition et préremplir
  function openEditDialog(loan) {
    setEditingLoan(loan);
    setEditUserId(loan.userId || loan.User?.id || "");
    setEditBookId(loan.bookId || loan.Book?.id || "");
    setEditStartDate(loan.startDate || "");
    setEditEndDate(loan.endDate || "");
    setEditOpen(true);
  }

  // Valider la modification
  async function handleUpdateLoan() {
    if (!editingLoan) return;
    if (!editUserId || !editBookId || !editStartDate || !editEndDate) {
      setSnack({ open: true, severity: "warning", message: "Tous les champs d'édition sont requis." });
      return;
    }

    const payload = {
      userId: editUserId,
      bookId: editBookId,
      startDate: editStartDate,
      endDate: editEndDate
    };

    const res = await updateLoan(token, editingLoan.id, payload);
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || JSON.stringify(res.error) });
    } else {
      setSnack({ open: true, severity: "success", message: "Prêt mis à jour." });
      setLoans(prev => prev.map(l => (l.id === editingLoan.id ? { ...l, ...res } : l)));
      setEditOpen(false);
      setEditingLoan(null);
    }
  }

  // Annuler (supprimer) un prêt
  async function handleCancelLoan(loanId) {
    if (!window.confirm("Voulez-vous vraiment annuler ce prêt ? Cette action est irréversible.")) return;
    const res = await deleteLoan(token, loanId);
    if (res?.error) {
      setSnack({ open: true, severity: "error", message: res.error.message || JSON.stringify(res.error) });
    } else {
      setSnack({ open: true, severity: "success", message: "Prêt annulé." });
      setLoans(prev => prev.filter(l => l.id !== loanId));
    }
  }

  const filtered = loans.filter(l => {
    const u = l.User || {};
    const b = l.Book || {};
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (u.email || "").toLowerCase().includes(q) ||
           (b.titre || "").toLowerCase().includes(q) ||
           (u.prenom || "").toLowerCase().includes(q) ||
           (u.nom || "").toLowerCase().includes(q);
  });

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>📖 Gestion des prêts</Typography>

      {/* Formulaire de création */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField select label="Utilisateur" fullWidth value={userId} onChange={e => setUserId(e.target.value)}>
                <MenuItem value="">— Sélectionner —</MenuItem>
                {users.map(u => <MenuItem key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.email})</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField select label="Livre" fullWidth value={bookId} onChange={e => setBookId(e.target.value)}>
                <MenuItem value="">— Sélectionner —</MenuItem>
                {books.map(b => <MenuItem key={b.id} value={b.id}>{b.titre} — {b.auteur}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField type="date" label="Date début" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField type="date" label="Date fin" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreateLoan}>Créer le prêt</Button>
              <Button variant="outlined" sx={{ ml: 2 }} onClick={loadInitial} startIcon={<RefreshIcon />}>Rafraîchir</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recherche */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField label="🔍 Rechercher par email, nom ou titre" fullWidth value={search} onChange={e => setSearch(e.target.value)} />
      </Box>

      {/* Liste détaillée en tableau */}
      <Typography variant="h5" gutterBottom>📋 Liste des prêts</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Livre</TableCell>
            <TableCell>Date début</TableCell>
            <TableCell>Date fin</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(l => {
            const u = l.User || {};
            const b = l.Book || {};
            return (
              <TableRow key={l.id}>
                <TableCell>{u.prenom} {u.nom} ({u.email})</TableCell>
                <TableCell>{b.titre} — {b.auteur}</TableCell>
                <TableCell>{l.startDate}</TableCell>
                <TableCell>{l.endDate || "En cours"}</TableCell>
                <TableCell>{l.finished ? "Terminé" : "Actif"}</TableCell>
                <TableCell>
                  {!l.finished && (
                    <>
                      <IconButton onClick={() => handleFinishLoan(l.id)} title="Finir le prêt">
                        <DoneIcon color="success" />
                      </IconButton>

                      <IconButton onClick={() => openEditDialog(l)} title="Modifier le prêt">
                        <EditIcon color="primary" />
                      </IconButton>

                      <IconButton onClick={() => handleCancelLoan(l.id)} title="Annuler le prêt">
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Dialogue d'édition */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier le prêt</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
            <TextField select label="Utilisateur" fullWidth value={editUserId} onChange={e => setEditUserId(e.target.value)}>
              <MenuItem value="">— Sélectionner —</MenuItem>
              {users.map(u => <MenuItem key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.email})</MenuItem>)}
            </TextField>

            <TextField select label="Livre" fullWidth value={editBookId} onChange={e => setEditBookId(e.target.value)}>
              <MenuItem value="">— Sélectionner —</MenuItem>
              {books.map(b => <MenuItem key={b.id} value={b.id}>{b.titre} — {b.auteur}</MenuItem>)}
            </TextField>

            <TextField type="date" label="Date début" fullWidth InputLabelProps={{ shrink: true }} value={editStartDate} onChange={e => setEditStartDate(e.target.value)} />
            <TextField type="date" label="Date fin" fullWidth InputLabelProps={{ shrink: true }} value={editEndDate} onChange={e => setEditEndDate(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditOpen(false); setEditingLoan(null); }}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateLoan}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
