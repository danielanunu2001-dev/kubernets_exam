const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { Book } = require("../db");
const authMiddleware = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/auth");

// ✅ Liste des livres
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Importer des livres (admin uniquement)
router.post("/import", authMiddleware, isAdmin, async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Query manquante" });
    }

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    const imported = [];
    for (const doc of data.docs.slice(0, 5)) {
      const [book, created] = await Book.findOrCreate({
        where: { isbn_13: doc.isbn ? doc.isbn[0] : null },
        defaults: {
          titre: doc.title,
          auteur: doc.author_name ? doc.author_name[0] : "Inconnu",
          edition: doc.publisher ? doc.publisher[0] : "Inconnue",
          isbn_13: doc.isbn ? doc.isbn[0] : null,
          coverId: doc.cover_i || null,
        },
      });
      if (created) imported.push(book);
    }

    res.json({ imported });
  } catch (err) {
    console.error("Erreur import:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Ajouter un livre manuellement (admin uniquement)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { titre, auteur, edition, isbn_13, coverId } = req.body;
    const book = await Book.create({ titre, auteur, edition, isbn_13, coverId });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
