const { Book } = require("../db");
const { searchBooks } = require("../services/openLibrary");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre non trouvé" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { titre, auteur, edition } = req.body;
    if (!titre || !auteur) return res.status(400).json({ error: "Champs requis manquants" });

    const book = await Book.create({ titre, auteur, edition });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre non trouvé" });

    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Livre non trouvé" });

    await book.destroy();
    res.json({ message: "Livre supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Import depuis Open Library
exports.importBooks = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) return res.status(400).json({ error: "Mot-clé manquant" });

    const books = await searchBooks(query.trim());
    let created = 0;

    for (const b of books) {
      const [record, wasCreated] = await Book.findOrCreate({
        where: { titre: b.titre, auteur: b.auteur },
        defaults: b
      });
      if (wasCreated) created++;
    }

    res.json({ message: `✅ Import terminé : ${created} nouveaux livres`, totalFetched: books.length, imported: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur import Open Library" });
  }
};
