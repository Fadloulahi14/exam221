const { body } = require('express-validator');

const approvisionnementValidator = [
  body('quantite')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un entier supérieur à 0'),
  body('fournisseurId')
    .isUUID()
    .withMessage('L\'identifiant du fournisseur est invalide'),
  body('produitId')
    .isUUID()
    .withMessage('L\'identifiant du produit est invalide'),
];

const approvisionnementUpdateValidator = [
  body('quantite')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un entier supérieur à 0'),
  body('fournisseurId')
    .optional()
    .isUUID()
    .withMessage('L\'identifiant du fournisseur est invalide'),
  body('produitId')
    .optional()
    .isUUID()
    .withMessage('L\'identifiant du produit est invalide'),
];

module.exports = { approvisionnementValidator, approvisionnementUpdateValidator };
