const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produit = sequelize.define('Produit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: { msg: 'Le libellé est requis' } },
  },
  prixUnitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Le prix ne peut pas être négatif' },
      notNull: { msg: 'Le prix unitaire est requis' },
    },
  },
  quantiteStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Le stock ne peut pas être négatif' },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: true });

module.exports = Produit;
