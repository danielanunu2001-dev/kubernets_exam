// services/openLibrary.js
import fetch from "node-fetch";

export async function searchBooks(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
  const data = await res.json();

  return (data.docs || []).map((doc) => ({
    titre: doc.title || "Titre inconnu",
    auteur: Array.isArray(doc.author_name) ? doc.author_name.join(", ") : "Auteur inconnu",
    edition: Array.isArray(doc.publisher) ? doc.publisher[0] : null,
    isbn_10: Array.isArray(doc.isbn) ? doc.isbn.find((i) => i.length === 10) : null,
    isbn_13: Array.isArray(doc.isbn) ? doc.isbn.find((i) => i.length === 13) : null,
    coverId: doc.cover_i || null
  }));
}
