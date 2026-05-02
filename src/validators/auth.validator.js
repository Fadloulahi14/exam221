const { body } = require('express-validator');

const registerValidator = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

module.exports = { registerValidator, loginValidator };
