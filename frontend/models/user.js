const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      nom: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      prenom: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      age: { 
        type: DataTypes.INTEGER 
      },
      ecole: { 
        type: DataTypes.STRING 
      },
      email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
      },
      password: { 
        type: DataTypes.STRING, 
        allowNull: false,
        defaultValue: 'changeme' // valeur par défaut pour les anciens utilisateurs
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    });
  }
}

module.exports = User;
