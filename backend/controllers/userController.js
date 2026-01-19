// controllers/userController.js
const bcrypt = require('bcrypt');
const { User } = require('../db');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, age, ecole } = req.body;
    if (!nom || !prenom || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email déjà utilisé' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, prenom, email, password: hashed, age, ecole });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nom, prenom, age, ecole } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await user.update({ nom, prenom, age, ecole });
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await user.destroy();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
