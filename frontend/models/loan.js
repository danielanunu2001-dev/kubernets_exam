const { DataTypes, Model } = require('sequelize');

class Loan extends Model {
  static initModel(sequelize) {
    Loan.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Loan',
      tableName: 'Loans'
    });
  }
}

module.exports = Loan;
