const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Approvisionnement = sequelize.define('Approvisionnement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La quantité doit être au moins 1' },
      notNull: { msg: 'La quantité est requise' },
    },
  },
}, { timestamps: true });

module.exports = Approvisionnement;
