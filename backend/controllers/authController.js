// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function register(req, res) {
  try {
    const { nom, prenom, email, password, age, ecole } = req.body;
    if (!nom || !prenom || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email déjà utilisé' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, prenom, email, password: hashed, age, ecole });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = { login, register };
