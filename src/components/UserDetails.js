import React, { useEffect, useState } from "react";
import { getUserDetails, getMyLoans } from "../api";
import { Typography, List, ListItem, Paper } from "@mui/material";

export default function UserDetails({ userId, token, isAdmin }) {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin && userId) {
          const res = await getUserDetails(token, userId);
          if (res && !res.error) {
            setUser(res.user || res);
            setLoans(res.loans || []);
          } else {
            setUser(null);
            setLoans([]);
          }
        } else {
          const res = await getMyLoans(token);
          if (res && !res.error) {
            setLoans(Array.isArray(res) ? res.filter(l => !l.finished) : []);
          } else {
            setLoans([]);
          }
        }
      } catch (err) {
        setUser(null);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token, isAdmin]);

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      {isAdmin && user && (
        <>
          <Typography variant="h6">Informations utilisateur</Typography>
          <Typography><strong>Nom :</strong> {user.nom}</Typography>
          <Typography><strong>Prénom :</strong> {user.prenom}</Typography>
          <Typography><strong>Email :</strong> {user.email}</Typography>
          <Typography><strong>École :</strong> {user.ecole}</Typography>
        </>
      )}

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Prêts en cours</Typography>
      {loans.length === 0 ? (
        <Typography>Aucun prêt en cours.</Typography>
      ) : (
        <List>
          {loans.map((loan) => (
            <ListItem key={loan.id}>
              📖 {loan.Book?.titre || loan.bookTitle || "Titre inconnu"} — du {loan.startDate} au {loan.endDate}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
