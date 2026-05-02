const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = asyncHandler(async (req, res) => {
  const { nom, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, 'Cet email est déjà utilisé');

  const user = await User.create({ nom, email, password });

  return ApiResponse.created(res, { user }, 'Utilisateur créé avec succès');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(401, 'Identifiants incorrects');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Identifiants incorrects');

  const token = generateToken(user);

  return ApiResponse.success(res, { token, user }, 'Connexion réussie');
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { user: req.user }, 'Profil récupéré');
});

module.exports = { register, login, me };
