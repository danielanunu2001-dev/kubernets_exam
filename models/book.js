const { DataTypes, Model } = require('sequelize');

class Book extends Model {
  static initModel(sequelize) {
    Book.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      auteur: {
        type: DataTypes.STRING
      },
      edition: {
        type: DataTypes.STRING
      }
    }, {
      sequelize,
      modelName: 'Book',
      tableName: 'Books'
    });
  }
}

module.exports = Book;
