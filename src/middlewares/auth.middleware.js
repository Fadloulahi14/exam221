const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token d\'authentification manquant');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new ApiError(401, 'Token expiré');
    throw new ApiError(401, 'Token invalide');
  }

  const user = await User.findByPk(decoded.id);
  if (!user) throw new ApiError(401, 'Utilisateur introuvable');

  req.user = user;
  next();
});

module.exports = authMiddleware;
