const sequelize = require('../config/database');
const User = require('./user.model');
const Fournisseur = require('./fournisseur.model');
const Produit = require('./produit.model');
const Approvisionnement = require('./approvisionnement.model');

// Associations
Fournisseur.hasMany(Approvisionnement, { foreignKey: 'fournisseurId', onDelete: 'RESTRICT' });
Approvisionnement.belongsTo(Fournisseur, { foreignKey: 'fournisseurId' });

Produit.hasMany(Approvisionnement, { foreignKey: 'produitId', onDelete: 'RESTRICT' });
Approvisionnement.belongsTo(Produit, { foreignKey: 'produitId' });

module.exports = { sequelize, User, Fournisseur, Produit, Approvisionnement };
