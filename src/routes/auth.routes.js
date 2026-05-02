const router = require('express').Router();
const { register, login, me } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et gestion des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Créer un compte utilisateur
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, email, password]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', registerValidator, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Se connecter et obtenir un token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie, token retourné
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', loginValidator, validate, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authMiddleware, me);

module.exports = router;
