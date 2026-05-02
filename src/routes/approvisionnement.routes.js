const router = require('express').Router();
const { create, getAll, getOne, update, remove } = require('../controllers/approvisionnement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { approvisionnementValidator, approvisionnementUpdateValidator } = require('../validators/approvisionnement.validator');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Approvisionnements
 *   description: Gestion des approvisionnements avec mise à jour automatique du stock
 */

/**
 * @swagger
 * /api/approvisionnements:
 *   post:
 *     tags: [Approvisionnements]
 *     summary: Créer un approvisionnement (incrémente le stock automatiquement via transaction)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantite, fournisseurId, produitId]
 *             properties:
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               fournisseurId:
 *                 type: string
 *                 format: uuid
 *               produitId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Approvisionnement créé et stock incrémenté
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: Fournisseur ou produit introuvable
 */
router.post('/', approvisionnementValidator, validate, create);

/**
 * @swagger
 * /api/approvisionnements:
 *   get:
 *     tags: [Approvisionnements]
 *     summary: Lister tous les approvisionnements avec fournisseur et produit
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
 *         description: Liste des approvisionnements
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/approvisionnements/{id}:
 *   get:
 *     tags: [Approvisionnements]
 *     summary: Récupérer un approvisionnement par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Approvisionnement trouvé
 *       404:
 *         description: Approvisionnement introuvable
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /api/approvisionnements/{id}:
 *   put:
 *     tags: [Approvisionnements]
 *     summary: Mettre à jour un approvisionnement (ajuste le stock si la quantité change)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *               fournisseurId:
 *                 type: string
 *                 format: uuid
 *               produitId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Approvisionnement mis à jour
 *       400:
 *         description: Stock insuffisant
 *       404:
 *         description: Approvisionnement introuvable
 */
router.put('/:id', approvisionnementUpdateValidator, validate, update);

/**
 * @swagger
 * /api/approvisionnements/{id}:
 *   delete:
 *     tags: [Approvisionnements]
 *     summary: Supprimer un approvisionnement (décrémente le stock)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Approvisionnement supprimé
 *       400:
 *         description: Stock deviendrait négatif
 *       404:
 *         description: Approvisionnement introuvable
 */
router.delete('/:id', remove);

module.exports = router;
