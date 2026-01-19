// controllers/loans.js
const { Loan, User, Book } = require("../db");

// Admin : voir tous les prêts
exports.getLoansController = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [User, Book],
      order: [["createdAt", "DESC"]],
    });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: "Impossible de récupérer les prêts" });
  }
};

// Utilisateur : voir ses propres prêts
exports.getMyLoansController = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id },
      include: [Book],
    });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: "Impossible de récupérer vos prêts" });
  }
};

// Créer un prêt
exports.createLoanController = async (req, res) => {
  try {
    const { bookId, startDate, endDate } = req.body;
    const loan = await Loan.create({
      userId: req.user.id,
      bookId,
      startDate,
      endDate,
      finished: false,
    });
    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ error: "Erreur création prêt" });
  }
};

// Admin : modifier un prêt
exports.updateLoanController = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, dateRetour } = req.body;

    const loan = await Loan.findByPk(id);
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    if (statut) loan.statut = statut;
    if (dateRetour) loan.dateRetour = dateRetour;

    await loan.save();
    res.json({ message: "Prêt modifié avec succès", loan });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Utilisateur : modifier son propre prêt
exports.updateMyLoanController = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const loan = await Loan.findOne({ where: { id, userId: req.user.id } });
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    if (startDate) loan.startDate = startDate;
    if (endDate) loan.endDate = endDate;

    await loan.save();
    res.json({ message: "Votre prêt a été modifié", loan });
  } catch (err) {
    res.status(500).json({ error: "Erreur modification prêt" });
  }
};

// Utilisateur : terminer son propre prêt (POST)
exports.finishMyLoanController = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findOne({ where: { id, userId: req.user.id } });
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    loan.finished = true;
    loan.dateRetour = new Date();

    await loan.save();
    res.json({ message: "Prêt terminé avec succès", loan });
  } catch (err) {
    res.status(500).json({ error: "Erreur terminer prêt" });
  }
};

// Admin : terminer n’importe quel prêt (POST)
exports.finishLoanController = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findByPk(id);
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    loan.finished = true;
    loan.dateRetour = new Date();

    await loan.save();
    res.json({ message: "Prêt terminé par l’administrateur", loan });
  } catch (err) {
    res.status(500).json({ error: "Erreur terminer prêt" });
  }
};

// Utilisateur : supprimer son propre prêt
exports.deleteMyLoanController = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findOne({ where: { id, userId: req.user.id } });
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    await loan.destroy();
    res.json({ message: "Prêt supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression prêt" });
  }
};

// Admin : supprimer n’importe quel prêt
exports.deleteLoanController = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findByPk(id);
    if (!loan) return res.status(404).json({ error: "Prêt introuvable" });

    await loan.destroy();
    res.json({ message: "Prêt supprimé par l’administrateur" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression prêt" });
  }
};
