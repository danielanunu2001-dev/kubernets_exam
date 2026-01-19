// controllers/books.js
const { Book } = require("../db");
const fetch = require("node-fetch");

// GET /api/books
exports.getBooksController = async (req, res) => {
  try {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de récupérer les livres" });
  }
};

// POST /api/books
exports.createBookController = async (req, res) => {
  try {
    const { titre, auteur, edition, isbn_13, coverId } = req.body;
    const book = await Book.create({ titre, auteur, edition, isbn_13, coverId });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erreur création livre" });
  }
};

// POST /api/books/import
exports.importBookController = async (req, res) => {
  try {
    const { query } = req.query || req.body;
    if (!query) return res.status(400).json({ error: "Paramètre 'query' requis" });

    // Appel OpenLibrary
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      return res.status(404).json({ error: "Livre introuvable" });
    }

    const doc = data.docs[0];
    const newBook = await Book.create({
      titre: doc.title,
      auteur: doc.author_name ? doc.author_name[0] : "Inconnu",
      edition: doc.publisher ? doc.publisher[0] : "—",
      isbn_13: doc.isbn ? doc.isbn[0] : null,
      coverId: doc.cover_i || null,
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur import livre" });
  }
};
