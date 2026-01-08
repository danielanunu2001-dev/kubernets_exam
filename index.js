require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();

// 🔹 Importation sequelize et modèles
const { sequelize, User, Book } = require('./models');

// 🔹 Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const loanRoutes = require('./routes/loans');

// 🔹 Middleware
app.use(express.json());

// 🔹 Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

// 🔹 Frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Gestion erreurs
app.use((err, req, res, next) => {
  console.error('❗ Erreur serveur :', err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// 🔹 PORT
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB réussie');

    await sequelize.sync();
    console.log('📚 Tables synchronisées');

    // 🔹 SEED UTILISATEUR
    const existingUser = await User.findOne({
      where: { email: 'admin@biblio.com' }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await User.create({
        nom: 'Admin',
        prenom: 'Biblio',
        age: 30,
        ecole: 'Université Fès',
        email: 'admin@biblio.com',
        password: hashedPassword
      });

      console.log('👤 Utilisateur admin créé');
    }

    // 🔹 SEED LIVRES
    const booksCount = await Book.count();

    if (booksCount === 0) {
      await Book.bulkCreate([
        {
          titre: 'Le Petit Prince',
          auteur: 'Antoine de Saint-Exupéry',
          edition: 'Gallimard'
        },
        {
          titre: '1984',
          auteur: 'George Orwell',
          edition: 'Secker & Warburg'
        },
        {
          titre: 'L’Étranger',
          auteur: 'Albert Camus',
          edition: 'Gallimard'
        }
      ]);

      console.log('📘 Livres ajoutés à la base');
    }

    // 🔹 Lancement serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
      console.log(`🌐 Frontend : http://localhost:${PORT}/index.html`);
    });

  } catch (err) {
    console.error('❌ Erreur démarrage :', err);
  }
})();
