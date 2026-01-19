const express = require("express");
const router = express.Router();
const { Loan, User, Book } = require("../db");
const authMiddleware = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/auth");

// ✅ Lister tous les prêts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ["id", "nom", "prenom", "email"] },
        { model: Book, attributes: ["id", "titre", "auteur", "isbn_13"] }
      ]
    });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Créer un prêt
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, bookId, endDate } = req.body;

    const loan = await Loan.create({
      UserId: userId,
      BookId: bookId,
      endDate: endDate || null,
      statut: "en cours"
    });

    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Supprimer un prêt (admin uniquement)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    await loan.destroy();
    res.json({ message: "Prêt supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Modifier un prêt (admin uniquement)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    await loan.update(req.body);
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
