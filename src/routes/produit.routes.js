const router = require('express').Router();
const { create, getAll, getOne, update, remove, increment, decrement } = require('../controllers/produit.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { produitValidator, produitUpdateValidator, quantiteValidator } = require('../validators/produit.validator');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits avec upload d'images via ImgBB
 */

/**
 * @swagger
 * /api/produits:
 *   post:
 *     tags: [Produits]
 *     summary: Créer un produit (avec image optionnelle)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [libelle, prixUnitaire]
 *             properties:
 *               libelle:
 *                 type: string
 *                 example: Ordinateur portable
 *               prixUnitaire:
 *                 type: number
 *                 format: float
 *                 example: 999.99
 *               quantiteStock:
 *                 type: integer
 *                 example: 0
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du produit (JPEG, PNG, WEBP, GIF — max 32MB)
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', upload.single('image'), produitValidator, validate, create);

/**
 * @swagger
 * /api/produits:
 *   get:
 *     tags: [Produits]
 *     summary: Lister tous les produits (paginé)
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
 *         description: Liste des produits
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     tags: [Produits]
 *     summary: Récupérer un produit par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit introuvable
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     tags: [Produits]
 *     summary: Mettre à jour un produit (avec remplacement d'image optionnel)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               libelle:
 *                 type: string
 *               prixUnitaire:
 *                 type: number
 *               quantiteStock:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit introuvable
 */
router.put('/:id', upload.single('image'), produitUpdateValidator, validate, update);

/**
 * @swagger
 * /api/produits/{id}:
 *   delete:
 *     tags: [Produits]
 *     summary: Supprimer un produit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Produit supprimé
 *       404:
 *         description: Produit introuvable
 */
router.delete('/:id', remove);

/**
 * @swagger
 * /api/produits/{id}/increment:
 *   patch:
 *     tags: [Produits]
 *     summary: Incrémenter le stock d'un produit
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
 *             required: [quantite]
 *             properties:
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       200:
 *         description: Stock incrémenté
 *       404:
 *         description: Produit introuvable
 */
router.patch('/:id/increment', quantiteValidator, validate, increment);

/**
 * @swagger
 * /api/produits/{id}/decrement:
 *   patch:
 *     tags: [Produits]
 *     summary: Décrémenter le stock d'un produit
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
 *             required: [quantite]
 *             properties:
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Stock décrémenté
 *       400:
 *         description: Stock insuffisant
 *       404:
 *         description: Produit introuvable
 */
router.patch('/:id/decrement', quantiteValidator, validate, decrement);

module.exports = router;
