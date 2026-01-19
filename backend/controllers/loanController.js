// controllers/loanController.js
const { Loan, User, Book } = require('../db');

// Récupérer tous les prêts
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ['id', 'prenom', 'nom', 'email'] },
        { model: Book, attributes: ['id', 'titre', 'auteur', 'edition'] }
      ]
    });
    res.json(loans);
  } catch (err) {
    console.error("❌ Erreur getAllLoans:", err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Récupérer un prêt par ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'prenom', 'nom', 'email'] },
        { model: Book, attributes: ['id', 'titre', 'auteur', 'edition'] }
      ]
    });
    if (!loan) return res.status(404).json({ message: 'Prêt non trouvé' });
    res.json(loan);
  } catch (err) {
    console.error("❌ Erreur getLoanById:", err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Créer un prêt
exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId, startDate, endDate } = req.body;
    console.log("📩 Données reçues pour création prêt:", req.body);

    if (!userId || !bookId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // Vérifier existence utilisateur et livre
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);
    if (!user || !book) {
      return res.status(404).json({ message: 'Utilisateur ou livre introuvable' });
    }

    const loan = await Loan.create({ userId, bookId, startDate, endDate, finished: false });
    res.status(201).json(loan);
  } catch (err) {
    console.error("❌ Erreur createLoan:", err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Mettre à jour un prêt
exports.updateLoan = async (req, res) => {
  try {
    const { startDate, endDate, finished } = req.body;
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Prêt non trouvé' });

    await loan.update({ startDate, endDate, finished });
    res.json({ message: 'Prêt mis à jour', loan });
  } catch (err) {
    console.error("❌ Erreur updateLoan:", err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Supprimer un prêt
exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Prêt non trouvé' });

    await loan.destroy();
    res.json({ message: 'Prêt supprimé' });
  } catch (err) {
    console.error("❌ Erreur deleteLoan:", err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};
