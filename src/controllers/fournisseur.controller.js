const { Fournisseur, Approvisionnement } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const { nom, telephone, adresse } = req.body;
  const fournisseur = await Fournisseur.create({ nom, telephone, adresse });
  return ApiResponse.created(res, { fournisseur }, 'Fournisseur créé');
});

const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const { count, rows } = await Fournisseur.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });

  const pagination = { page, limit, total: count, totalPages: Math.ceil(count / limit) };
  return ApiResponse.success(res, { fournisseurs: rows }, 'Fournisseurs récupérés', 200, pagination);
});

const getOne = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findByPk(req.params.id);
  if (!fournisseur) throw new ApiError(404, 'Fournisseur introuvable');
  return ApiResponse.success(res, { fournisseur }, 'Fournisseur récupéré');
});

const update = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findByPk(req.params.id);
  if (!fournisseur) throw new ApiError(404, 'Fournisseur introuvable');

  const { nom, telephone, adresse } = req.body;
  await fournisseur.update({ nom, telephone, adresse });
  return ApiResponse.success(res, { fournisseur }, 'Fournisseur mis à jour');
});

const remove = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findByPk(req.params.id);
  if (!fournisseur) throw new ApiError(404, 'Fournisseur introuvable');

  const count = await Approvisionnement.count({ where: { fournisseurId: fournisseur.id } });
  if (count > 0) throw new ApiError(409, 'Impossible de supprimer : ce fournisseur a des approvisionnements liés');

  await fournisseur.destroy();
  return res.status(204).send();
});

module.exports = { create, getAll, getOne, update, remove };
