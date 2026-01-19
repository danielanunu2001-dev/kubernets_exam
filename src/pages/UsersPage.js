import React, { useEffect, useState } from "react";
import { getUsers } from "../api";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import UserDetails from "../components/UserDetails";

export default function UsersPage({ token, isAdmin }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers(token);
      if (data && !data.error) setUsers(Array.isArray(data) ? data : []);
    }
    if (token && isAdmin) fetchUsers();
  }, [token, isAdmin]);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>👥 Liste des utilisateurs</Typography>

      {isAdmin ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>École</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nom}</TableCell>
                  <TableCell>{u.prenom}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.ecole}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => setSelectedUserId(u.id)}>Voir détails</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedUserId && <UserDetails token={token} userId={selectedUserId} isAdmin={true} />}
        </>
      ) : (
        <Typography>Vous n’avez pas accès aux informations des autres utilisateurs.</Typography>
      )}
    </Container>
  );
}
