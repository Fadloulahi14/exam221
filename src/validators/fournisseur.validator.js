const { body } = require('express-validator');

const fournisseurValidator = [
  body('nom').trim().notEmpty().withMessage('Le nom du fournisseur est requis'),
  body('telephone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('adresse').trim().notEmpty().withMessage('L\'adresse est requise'),
];

const fournisseurUpdateValidator = [
  body('nom').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('telephone').optional().trim().notEmpty().withMessage('Le téléphone ne peut pas être vide'),
  body('adresse').optional().trim().notEmpty().withMessage('L\'adresse ne peut pas être vide'),
];

module.exports = { fournisseurValidator, fournisseurUpdateValidator };
