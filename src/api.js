const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

async function request(path, method = "GET", token = null, body = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    if (!res.ok) {
      try {
        return { error: JSON.parse(text) };
      } catch {
        return { error: text || res.statusText };
      }
    }

    return res.status === 204 ? null : JSON.parse(text);
  } catch (err) {
    return { error: err.message || "Erreur réseau" };
  }
}

// Auth
export async function login(credentials) {
  return request("/auth/login", "POST", null, credentials);
}

export async function registerUser(payload) {
  return request("/auth/register", "POST", null, payload);
}

// Users
export async function getUsers(token) {
  return request("/users", "GET", token);
}

export async function getUserDetails(token, userId) {
  return request(`/users/${userId}`, "GET", token);
}

// Books
export async function getBooks(token) {
  return request("/books", "GET", token);
}

export async function importBooks(token, query) {
  return request(`/books/import?query=${encodeURIComponent(query)}`, "POST", token);
}

// Loans
export async function getLoans(token) {
  return request("/loans", "GET", token);
}

export async function getMyLoans(token) {
  return request("/loans/my", "GET", token);
}

export async function createLoan(token, loanData) {
  return request("/loans", "POST", token, loanData);
}

export async function finishMyLoan(token, loanId) {
  return request(`/loans/my/${loanId}/finish`, "POST", token);
}

export async function finishLoan(token, loanId) {
  return request(`/loans/${loanId}/finish`, "POST", token);
}

export async function deleteMyLoan(token, loanId) {
  return request(`/loans/my/${loanId}`, "DELETE", token);
}

export async function deleteLoan(token, loanId) {
  return request(`/loans/${loanId}`, "DELETE", token);
}

export async function updateLoan(token, loanId, payload) {
  return request(`/loans/${loanId}`, "PUT", token, payload);
}
