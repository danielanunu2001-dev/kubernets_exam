module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define("Loan", {
    startDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    endDate: { type: DataTypes.DATE, allowNull: true },
    statut: { type: DataTypes.STRING, allowNull: false, defaultValue: "en cours" }
  });
  return Loan;
};
