const { Produit } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const { libelle, prixUnitaire, quantiteStock } = req.body;
  let imageData = {};

  if (req.file) {
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    imageData = { image: url, imagePublicId: publicId };
  }

  const produit = await Produit.create({ libelle, prixUnitaire, quantiteStock: quantiteStock || 0, ...imageData });
  return ApiResponse.created(res, { produit }, 'Produit créé');
});

const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const { count, rows } = await Produit.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });

  const pagination = { page, limit, total: count, totalPages: Math.ceil(count / limit) };
  return ApiResponse.success(res, { produits: rows }, 'Produits récupérés', 200, pagination);
});

const getOne = asyncHandler(async (req, res) => {
  const produit = await Produit.findByPk(req.params.id);
  if (!produit) throw new ApiError(404, 'Produit introuvable');
  return ApiResponse.success(res, { produit }, 'Produit récupéré');
});

const update = asyncHandler(async (req, res) => {
  const produit = await Produit.findByPk(req.params.id);
  if (!produit) throw new ApiError(404, 'Produit introuvable');

  const { libelle, prixUnitaire, quantiteStock } = req.body;
  const updateData = {};
  if (libelle !== undefined) updateData.libelle = libelle;
  if (prixUnitaire !== undefined) updateData.prixUnitaire = prixUnitaire;
  if (quantiteStock !== undefined) updateData.quantiteStock = quantiteStock;

  if (req.file) {
    const ancienPublicId = produit.imagePublicId;
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    updateData.image = url;
    updateData.imagePublicId = publicId;
    // Suppression de l'ancienne image sur Cloudinary après mise à jour réussie
    await produit.update(updateData);
    await deleteFromCloudinary(ancienPublicId);
    return ApiResponse.success(res, { produit }, 'Produit mis à jour');
  }

  await produit.update(updateData);
  return ApiResponse.success(res, { produit }, 'Produit mis à jour');
});

const remove = asyncHandler(async (req, res) => {
  const produit = await Produit.findByPk(req.params.id);
  if (!produit) throw new ApiError(404, 'Produit introuvable');

  const publicId = produit.imagePublicId;
  await produit.destroy();
  // Suppression de l'image Cloudinary après destruction en base
  await deleteFromCloudinary(publicId);

  return res.status(204).send();
});

const increment = asyncHandler(async (req, res) => {
  const produit = await Produit.findByPk(req.params.id);
  if (!produit) throw new ApiError(404, 'Produit introuvable');

  const { quantite } = req.body;
  await produit.increment('quantiteStock', { by: quantite });
  await produit.reload();
  return ApiResponse.success(res, { produit }, `Stock incrémenté de ${quantite}`);
});

const decrement = asyncHandler(async (req, res) => {
  const produit = await Produit.findByPk(req.params.id);
  if (!produit) throw new ApiError(404, 'Produit introuvable');

  const { quantite } = req.body;
  if (produit.quantiteStock < quantite) {
    throw new ApiError(400, `Stock insuffisant : stock actuel = ${produit.quantiteStock}, demandé = ${quantite}`);
  }

  await produit.decrement('quantiteStock', { by: quantite });
  await produit.reload();
  return ApiResponse.success(res, { produit }, `Stock décrémenté de ${quantite}`);
});

module.exports = { create, getAll, getOne, update, remove, increment, decrement };
