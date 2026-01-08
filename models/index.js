const { Sequelize } = require('sequelize');
const path = require('path');

// Initialisation de la connexion à la base SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Importation des modèles
const User = require('./user');
const Book = require('./book');
const Loan = require('./loan');

// Initialisation des modèles avec sequelize
User.initModel(sequelize);
Book.initModel(sequelize);
Loan.initModel(sequelize);

// Associations entre modèles
User.hasMany(Loan, { foreignKey: 'userId', onDelete: 'CASCADE' });
Loan.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Loan, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Loan.belongsTo(Book, { foreignKey: 'bookId' });

// Export de sequelize et des modèles
module.exports = { sequelize, User, Book, Loan };
