const { Loan, User, Book } = require('../models');

exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId, startDate, endDate } = req.body;

    // Vérifie si l'utilisateur n'a pas déjà 2 prêts
    const loansCount = await Loan.count({ where: { userId } });
    if (loansCount >= 2) return res.status(400).json({ error: "L'utilisateur a déjà 2 livres empruntés" });

    // Vérifie la durée du prêt
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    if (diff > 15) return res.status(400).json({ error: "Durée du prêt > 15 jours" });

    const loan = await Loan.create({ userId, bookId, startDate, endDate });
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLoansByUser = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.params.userId },
      include: [User, Book]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: "Prêt non trouvé" });
    await loan.destroy();
    res.json({ message: "Prêt supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
