const { Approvisionnement, Fournisseur, Produit, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const includeOptions = [
  { model: Fournisseur, attributes: ['id', 'nom', 'telephone', 'adresse'] },
  { model: Produit, attributes: ['id', 'libelle', 'prixUnitaire', 'quantiteStock', 'image'] },
];

const create = asyncHandler(async (req, res) => {
  const { quantite, fournisseurId, produitId, date } = req.body;

  const t = await sequelize.transaction();
  try {
    const fournisseur = await Fournisseur.findByPk(fournisseurId, { transaction: t });
    if (!fournisseur) throw new ApiError(404, 'Fournisseur introuvable');

    const produit = await Produit.findByPk(produitId, { transaction: t });
    if (!produit) throw new ApiError(404, 'Produit introuvable');

    const appro = await Approvisionnement.create(
      { quantite, fournisseurId, produitId, date: date || new Date() },
      { transaction: t }
    );

    await produit.increment('quantiteStock', { by: quantite, transaction: t });

    await t.commit();

    const result = await Approvisionnement.findByPk(appro.id, { include: includeOptions });
    return ApiResponse.created(res, { approvisionnement: result }, 'Approvisionnement créé et stock mis à jour');
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const { count, rows } = await Approvisionnement.findAndCountAll({
    include: includeOptions,
    limit,
    offset,
    order: [['date', 'DESC']],
  });

  const pagination = { page, limit, total: count, totalPages: Math.ceil(count / limit) };
  return ApiResponse.success(res, { approvisionnements: rows }, 'Approvisionnements récupérés', 200, pagination);
});

const getOne = asyncHandler(async (req, res) => {
  const appro = await Approvisionnement.findByPk(req.params.id, { include: includeOptions });
  if (!appro) throw new ApiError(404, 'Approvisionnement introuvable');
  return ApiResponse.success(res, { approvisionnement: appro }, 'Approvisionnement récupéré');
});

const update = asyncHandler(async (req, res) => {
  const appro = await Approvisionnement.findByPk(req.params.id);
  if (!appro) throw new ApiError(404, 'Approvisionnement introuvable');

  const { quantite, fournisseurId, produitId } = req.body;

  const t = await sequelize.transaction();
  try {
    if (quantite !== undefined && quantite !== appro.quantite) {
      const produit = await Produit.findByPk(appro.produitId, { transaction: t });
      const diff = quantite - appro.quantite;

      if (diff < 0 && produit.quantiteStock + diff < 0) {
        throw new ApiError(400, `Stock insuffisant pour réduire l'approvisionnement : stock = ${produit.quantiteStock}, réduction = ${Math.abs(diff)}`);
      }

      if (diff > 0) {
        await produit.increment('quantiteStock', { by: diff, transaction: t });
      } else {
        await produit.decrement('quantiteStock', { by: Math.abs(diff), transaction: t });
      }
    }

    const updateData = {};
    if (quantite !== undefined) updateData.quantite = quantite;
    if (fournisseurId !== undefined) {
      const f = await Fournisseur.findByPk(fournisseurId, { transaction: t });
      if (!f) throw new ApiError(404, 'Fournisseur introuvable');
      updateData.fournisseurId = fournisseurId;
    }
    if (produitId !== undefined) updateData.produitId = produitId;

    await appro.update(updateData, { transaction: t });
    await t.commit();

    const result = await Approvisionnement.findByPk(appro.id, { include: includeOptions });
    return ApiResponse.success(res, { approvisionnement: result }, 'Approvisionnement mis à jour');
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

const remove = asyncHandler(async (req, res) => {
  const appro = await Approvisionnement.findByPk(req.params.id);
  if (!appro) throw new ApiError(404, 'Approvisionnement introuvable');

  const t = await sequelize.transaction();
  try {
    const produit = await Produit.findByPk(appro.produitId, { transaction: t });
    if (!produit) throw new ApiError(404, 'Produit introuvable');

    if (produit.quantiteStock < appro.quantite) {
      throw new ApiError(400, `Suppression impossible : le stock deviendrait négatif (stock = ${produit.quantiteStock}, appro = ${appro.quantite})`);
    }

    await produit.decrement('quantiteStock', { by: appro.quantite, transaction: t });
    await appro.destroy({ transaction: t });
    await t.commit();

    return res.status(204).send();
  } catch (err) {
    await t.rollback();
    throw err;
  }
});

module.exports = { create, getAll, getOne, update, remove };
