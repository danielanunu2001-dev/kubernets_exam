const { Sequelize, DataTypes } = require("sequelize");

// Connexion avec DATABASE_URL défini dans .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

// Import des modèles (en minuscule car tes fichiers sont en minuscule)
const User = require("./models/user")(sequelize, DataTypes);
const Book = require("./models/book")(sequelize, DataTypes);
const Loan = require("./models/loan")(sequelize, DataTypes);

// Relations
User.hasMany(Loan);
Loan.belongsTo(User);

Book.hasMany(Loan);
Loan.belongsTo(Book);

module.exports = { sequelize, User, Book, Loan };
