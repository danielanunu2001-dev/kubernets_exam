import React, { useState } from "react";
import UserDetails from "./UserDetails";

function Users({ users, token, isAdmin }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {isAdmin ? (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <button onClick={() => setSelectedUserId(u.id)}>
                {u.nom} {u.prenom}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Vous n’avez pas accès aux informations des autres utilisateurs.</p>
      )}

      {selectedUserId && (
        <UserDetails userId={selectedUserId} token={token} isAdmin={isAdmin} />
      )}

      {!isAdmin && (
        <UserDetails userId={null} token={token} isAdmin={false} />
      )}
    </div>
  );
}

export default Users;
