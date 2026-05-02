# Supply API — Gestion des Approvisionnements

API RESTful production-ready pour gérer les approvisionnements d'une boutique.

## Prérequis

- Node.js v18+
- Compte [Neon](https://neon.tech) (PostgreSQL cloud)
- Compte [ImgBB](https://api.imgbb.com/) (hébergement d'images)

## Installation

```bash
cd supply-api
npm install
cp .env.example .env
# Remplir les variables dans .env
```

## Configuration `.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connexion Neon : `postgresql://user:pass@host.neon.tech/db?sslmode=require` |
| `JWT_SECRET` | Chaîne aléatoire longue (min 32 chars) |
| `JWT_EXPIRES_IN` | Durée du token (ex: `7d`) |
| `IMGBB_API_KEY` | Clé API ImgBB depuis [api.imgbb.com](https://api.imgbb.com/) |

**Neon** : Dashboard → Project → Connection string → sélectionner "Node.js"
**ImgBB** : S'inscrire → API → Get API key

## Lancement

```bash
# Développement (hot reload)
npm run dev

# Production
npm start

# Tester la connexion DB
npm run db:test
```

## Documentation Swagger

Accessible sur : `http://localhost:3000/api-docs`

## Workflow d'authentification

1. **Register** : `POST /api/auth/register`
2. **Login** : `POST /api/auth/login` → récupérer le `token`
3. Utiliser le token dans l'en-tête : `Authorization: Bearer <token>`
4. Sur Swagger : cliquer "Authorize" → coller le token

## Exemples cURL

### Authentification

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Jean Dupont","email":"jean@example.com","password":"motdepasse123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean@example.com","password":"motdepasse123"}'

# Profil
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Fournisseurs

```bash
# Créer
curl -X POST http://localhost:3000/api/fournisseurs \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Fournisseur SARL","telephone":"+33612345678","adresse":"10 rue de la Paix, Paris"}'

# Lister (paginé)
curl "http://localhost:3000/api/fournisseurs?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"

# Récupérer par ID
curl http://localhost:3000/api/fournisseurs/<UUID> \
  -H "Authorization: Bearer <TOKEN>"

# Mettre à jour
curl -X PUT http://localhost:3000/api/fournisseurs/<UUID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"telephone":"+33699999999"}'

# Supprimer
curl -X DELETE http://localhost:3000/api/fournisseurs/<UUID> \
  -H "Authorization: Bearer <TOKEN>"
```

### Produits

```bash
# Créer avec image
curl -X POST http://localhost:3000/api/produits \
  -H "Authorization: Bearer <TOKEN>" \
  -F "libelle=Ordinateur portable" \
  -F "prixUnitaire=999.99" \
  -F "quantiteStock=0" \
  -F "image=@./photo.jpg"

# Créer sans image
curl -X POST http://localhost:3000/api/produits \
  -H "Authorization: Bearer <TOKEN>" \
  -F "libelle=Clé USB" \
  -F "prixUnitaire=12.50"

# Lister
curl "http://localhost:3000/api/produits?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"

# Récupérer par ID
curl http://localhost:3000/api/produits/<UUID> \
  -H "Authorization: Bearer <TOKEN>"

# Mettre à jour (avec nouvelle image)
curl -X PUT http://localhost:3000/api/produits/<UUID> \
  -H "Authorization: Bearer <TOKEN>" \
  -F "prixUnitaire=899.99" \
  -F "image=@./nouvelle_photo.jpg"

# Incrémenter le stock
curl -X PATCH http://localhost:3000/api/produits/<UUID>/increment \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"quantite":5}'

# Décrémenter le stock
curl -X PATCH http://localhost:3000/api/produits/<UUID>/decrement \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"quantite":3}'
```

### Approvisionnements

```bash
# Créer (incrémente le stock automatiquement)
curl -X POST http://localhost:3000/api/approvisionnements \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"quantite":10,"fournisseurId":"<UUID>","produitId":"<UUID>"}'

# Lister avec fournisseur + produit
curl "http://localhost:3000/api/approvisionnements?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"

# Récupérer par ID
curl http://localhost:3000/api/approvisionnements/<UUID> \
  -H "Authorization: Bearer <TOKEN>"

# Mettre à jour (ajuste le stock si quantité change)
curl -X PUT http://localhost:3000/api/approvisionnements/<UUID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"quantite":15}'

# Supprimer (décrémente le stock)
curl -X DELETE http://localhost:3000/api/approvisionnements/<UUID> \
  -H "Authorization: Bearer <TOKEN>"
```

## Structure du projet

```
supply-api/
├── src/
│   ├── config/
│   │   ├── database.js       # Sequelize → Neon (SSL)
│   │   └── swagger.js        # Config Swagger
│   ├── services/
│   │   └── imgbb.service.js  # Upload images vers ImgBB
│   ├── models/               # Modèles Sequelize
│   ├── controllers/          # Logique métier
│   ├── routes/               # Routes + docs Swagger JSDoc
│   ├── middlewares/          # Auth, upload, erreurs, validation
│   ├── validators/           # Règles express-validator
│   ├── utils/                # ApiError, ApiResponse, asyncHandler
│   └── app.js
├── server.js
└── .env
```

## Notes ImgBB

- **Pas de suppression automatique** : Le `delete_url` retourné est une URL HTML (pas une API REST). Lors d'un remplacement d'image, l'ancienne URL est simplement écrasée en base.
- **Taille max** : 32 MB par image
- **Visibilité** : Toutes les images uploadées sont publiques (pas d'authentification ImgBB côté upload)

## Transactions Sequelize & gestion du stock

- Toute opération touchant simultanément `Approvisionnement` + `Produit` utilise `sequelize.transaction()`
- Le stock ne peut jamais être négatif : une validation HTTP 400 est retournée avant toute décrémentation impossible
- `onDelete: 'RESTRICT'` sur les clés étrangères protège l'intégrité référentielle
