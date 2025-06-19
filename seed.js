// seed.js
const mongoose = require('mongoose');
const Hotel    = require('./models/Hotel');  // ton modèle

async function main() {
  // 1) connexion à MongoDB
  await mongoose.connect('mongodb://localhost:27017/gestion-hotels', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ MongoDB connecté');

  // 2) tes données “brutes”
  const hotelsData = [
    {
      name: 'Hôtel Terrou-Bi',
      email: 'contact@terroubi.sn',
      pricePerNight: 25000,
      address: 'Boulevard Martin Luther King Dakar, 11500',
      phoneNumber: '+221770000001',
      currency: 'XOF',
      image: 'D:\\Stage-Bakeli\\Gestion-hotels\\images\\Hotel Terrou-Bi.jpg',
      isOnline: true
    },
    {
      name: 'Résidence Soleil',
      email: 'info@residencesoleil.sn',
      pricePerNight: 60000,
      address: 'Av. des Nations, Dakar',
      phoneNumber: '+221770000002',
      currency: 'XOF',
      image: '',
      isOnline: false
    }
    // ajoute autant d’objets que tu veux
  ];

  // 3) insertion en masse
  const result = await Hotel.insertMany(hotelsData);
  console.log(`✅ Inséré ${result.length} hôtels`);

  // 4) fermeture de la connexion
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
