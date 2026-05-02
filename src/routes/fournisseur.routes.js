const router = require('express').Router();
const { create, getAll, getOne, update, remove } = require('../controllers/fournisseur.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { fournisseurValidator, fournisseurUpdateValidator } = require('../validators/fournisseur.validator');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Fournisseurs
 *   description: Gestion des fournisseurs
 */

/**
 * @swagger
 * /api/fournisseurs:
 *   post:
 *     tags: [Fournisseurs]
 *     summary: Créer un fournisseur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, telephone, adresse]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Fournisseur SARL
 *               telephone:
 *                 type: string
 *                 example: +33612345678
 *               adresse:
 *                 type: string
 *                 example: 10 rue de la Paix, Paris
 *     responses:
 *       201:
 *         description: Fournisseur créé
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Non authentifié
 */
router.post('/', fournisseurValidator, validate, create);

/**
 * @swagger
 * /api/fournisseurs:
 *   get:
 *     tags: [Fournisseurs]
 *     summary: Lister tous les fournisseurs (paginé)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/fournisseurs/{id}:
 *   get:
 *     tags: [Fournisseurs]
 *     summary: Récupérer un fournisseur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Fournisseur trouvé
 *       404:
 *         description: Fournisseur introuvable
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /api/fournisseurs/{id}:
 *   put:
 *     tags: [Fournisseurs]
 *     summary: Mettre à jour un fournisseur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour
 *       404:
 *         description: Fournisseur introuvable
 */
router.put('/:id', fournisseurUpdateValidator, validate, update);

/**
 * @swagger
 * /api/fournisseurs/{id}:
 *   delete:
 *     tags: [Fournisseurs]
 *     summary: Supprimer un fournisseur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Fournisseur supprimé
 *       404:
 *         description: Fournisseur introuvable
 *       409:
 *         description: Fournisseur a des approvisionnements liés
 */
router.delete('/:id', remove);

module.exports = router;
