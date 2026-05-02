const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Fichier trop volumineux (max 10 MB)' });
  }

  if (err instanceof ApiError) {
    const response = { success: false, message: err.message };
    if (err.errors?.length) response.errors = err.errors;
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map(e => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, message: 'Erreur de validation', errors });
  }

  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0]?.path || 'champ';
    return res.status(409).json({ success: false, message: `La valeur du champ '${field}' existe déjà` });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ success: false, message: 'Impossible : des enregistrements liés existent' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expiré' });
  }

  console.error('Erreur non gérée:', err);
  return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
};

module.exports = errorMiddleware;
