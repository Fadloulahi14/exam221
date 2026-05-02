require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion PostgreSQL (Neon) établie avec succès.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Modèles Sequelize synchronisés.');
    } else {
      await sequelize.sync();
    }

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
      console.log(`Documentation Swagger : http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur :', error.message);
    process.exit(1);
  }
}

startServer();
