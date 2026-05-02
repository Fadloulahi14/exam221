const { body } = require('express-validator');

const produitValidator = [
  body('libelle').trim().notEmpty().withMessage('Le libellé est requis'),
  body('prixUnitaire')
    .isFloat({ min: 0 })
    .withMessage('Le prix unitaire doit être un nombre positif'),
  body('quantiteStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un entier positif ou nul'),
];

const produitUpdateValidator = [
  body('libelle').optional().trim().notEmpty().withMessage('Le libellé ne peut pas être vide'),
  body('prixUnitaire')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix unitaire doit être un nombre positif'),
  body('quantiteStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un entier positif ou nul'),
];

const quantiteValidator = [
  body('quantite')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un entier supérieur à 0'),
];

module.exports = { produitValidator, produitUpdateValidator, quantiteValidator };
