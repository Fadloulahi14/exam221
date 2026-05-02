require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const fournisseurRoutes = require('./routes/fournisseur.routes');
const produitRoutes = require('./routes/produit.routes');
const approvisionnementRoutes = require('./routes/approvisionnement.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Sécurité — CSP désactivée pour Swagger UI (scripts inline requis)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Rate limiting global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes' },
}));

// Logs
app.use(morgan('dev'));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/approvisionnements', approvisionnementRoutes);

// Route de santé
app.get('/health', (req, res) => res.json({ success: true, message: 'API opérationnelle' }));

// Route 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route introuvable' }));

// Middleware d'erreurs global (doit être en dernier)
app.use(errorMiddleware);

module.exports = app;
