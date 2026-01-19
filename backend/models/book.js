module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    titre: { type: DataTypes.STRING, allowNull: false },
    auteur: { type: DataTypes.STRING, allowNull: false },
    edition: { type: DataTypes.STRING },
    isbn_13: { type: DataTypes.STRING, unique: true },
    coverId: { type: DataTypes.INTEGER }
  });
  return Book;
};
