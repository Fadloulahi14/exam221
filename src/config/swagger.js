const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Supply API — Gestion des Approvisionnements',
      version: '1.0.0',
      description: 'API RESTful complète pour gérer les approvisionnements d\'une boutique',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Serveur de développement' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nom: { type: 'string', example: 'Jean Dupont' },
            email: { type: 'string', format: 'email', example: 'jean@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Fournisseur: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nom: { type: 'string', example: 'Fournisseur SARL' },
            telephone: { type: 'string', example: '+33612345678' },
            adresse: { type: 'string', example: '10 rue de la Paix, Paris' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Produit: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            libelle: { type: 'string', example: 'Ordinateur portable' },
            prixUnitaire: { type: 'number', format: 'decimal', example: 999.99 },
            quantiteStock: { type: 'integer', example: 10 },
            image: { type: 'string', format: 'uri', example: 'https://res.cloudinary.com/dtegzv2pw/image/upload/v1234567890/supply-api/produits/1234567890_ordinateur.jpg' },
            imagePublicId: { type: 'string', example: 'supply-api/produits/1234567890_ordinateur' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Approvisionnement: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            quantite: { type: 'integer', example: 5 },
            fournisseurId: { type: 'string', format: 'uuid' },
            produitId: { type: 'string', format: 'uuid' },
            Fournisseur: { $ref: '#/components/schemas/Fournisseur' },
            Produit: { $ref: '#/components/schemas/Produit' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 50 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
