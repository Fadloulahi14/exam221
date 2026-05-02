require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { sequelize, User, Fournisseur, Produit, Approvisionnement } = require('../models');

const users = [
  { nom: 'Admin Principal', email: 'admin@supply.com', password: 'Admin1234!', role: 'admin' },
  { nom: 'Marie Dupont',    email: 'marie@supply.com', password: 'User1234!',  role: 'user'  },
  { nom: 'Karim Benali',   email: 'karim@supply.com', password: 'User1234!',  role: 'user'  },
];

const fournisseurs = [
  { nom: 'TechImport SARL',     telephone: '+33612345678', adresse: '12 rue de la Paix, Paris 75001' },
  { nom: 'ElectroDistrib SAS',  telephone: '+33698765432', adresse: '5 avenue Foch, Lyon 69006' },
  { nom: 'BureauPro & Co',      telephone: '+33611223344', adresse: '8 boulevard Victor Hugo, Marseille 13001' },
];

const produits = [
  { libelle: 'Ordinateur portable Dell XPS',  prixUnitaire: 1299.99, quantiteStock: 0 },
  { libelle: 'Écran 27" LG UltraWide',        prixUnitaire: 449.50,  quantiteStock: 0 },
  { libelle: 'Clavier mécanique Logitech',     prixUnitaire: 89.99,   quantiteStock: 0 },
  { libelle: 'Souris sans fil Microsoft',      prixUnitaire: 34.90,   quantiteStock: 0 },
  { libelle: 'Casque audio Sony WH-1000XM5',  prixUnitaire: 329.00,  quantiteStock: 0 },
  { libelle: 'Webcam Logitech C920',           prixUnitaire: 79.99,   quantiteStock: 0 },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion Neon établie');

    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés');

    await Approvisionnement.destroy({ where: {} });
    await Produit.destroy({ where: {} });
    await Fournisseur.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('🗑️  Tables vidées');

    const createdUsers = await User.bulkCreate(users, { individualHooks: true });
    console.log(`👤 ${createdUsers.length} utilisateurs créés`);

    const createdFournisseurs = await Fournisseur.bulkCreate(fournisseurs);
    console.log(`🏭 ${createdFournisseurs.length} fournisseurs créés`);

    const createdProduits = await Produit.bulkCreate(produits);
    console.log(`📦 ${createdProduits.length} produits créés`);

    const appros = [
      { quantite: 15, fournisseurId: createdFournisseurs[0].id, produitId: createdProduits[0].id },
      { quantite: 20, fournisseurId: createdFournisseurs[0].id, produitId: createdProduits[1].id },
      { quantite: 50, fournisseurId: createdFournisseurs[1].id, produitId: createdProduits[2].id },
      { quantite: 80, fournisseurId: createdFournisseurs[1].id, produitId: createdProduits[3].id },
      { quantite: 10, fournisseurId: createdFournisseurs[2].id, produitId: createdProduits[4].id },
      { quantite: 30, fournisseurId: createdFournisseurs[2].id, produitId: createdProduits[5].id },
    ];

    for (const appro of appros) {
      const t = await sequelize.transaction();
      try {
        await Approvisionnement.create({ ...appro, date: new Date() }, { transaction: t });
        const produit = await Produit.findByPk(appro.produitId, { transaction: t });
        await produit.increment('quantiteStock', { by: appro.quantite, transaction: t });
        await t.commit();
      } catch (err) {
        await t.rollback();
        throw err;
      }
    }
    console.log(`📋 ${appros.length} approvisionnements créés (stocks mis à jour)`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 SEED TERMINÉ — Données de connexion');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👤 Compte ADMIN :');
    console.log('   Email    : admin@supply.com');
    console.log('   Password : Admin1234!');
    console.log('   Role     : admin');
    console.log('\n👤 Compte USER :');
    console.log('   Email    : marie@supply.com');
    console.log('   Password : User1234!');
    console.log('   Role     : user');
    console.log('\n👤 Compte USER 2 :');
    console.log('   Email    : karim@supply.com');
    console.log('   Password : User1234!');
    console.log('   Role     : user');
    console.log('\n🏭 Fournisseurs :');
    createdFournisseurs.forEach(f => console.log(`   - ${f.nom} (id: ${f.id})`));
    console.log('\n📦 Produits (avec stock) :');
    const updatedProduits = await Produit.findAll();
    updatedProduits.forEach(p => console.log(`   - ${p.libelle} | stock: ${p.quantiteStock} | prix: ${p.prixUnitaire}€ (id: ${p.id})`));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 Swagger : http://localhost:3000/api-docs');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    process.exit(1);
  }
}

seed();
