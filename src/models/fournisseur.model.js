const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fournisseur = sequelize.define('Fournisseur', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Le nom du fournisseur est requis' } },
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Le téléphone est requis' } },
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'L\'adresse est requise' } },
  },
}, { timestamps: true });

module.exports = Fournisseur;
