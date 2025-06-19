// Ajouter cette route en haut du fichier


const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const controller = require('../controllers/hotelController');
const Hotel = require('../models/Hotel');

router.get('/check', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API hotels fonctionnelle',
    timestamp: new Date()
  });
});
// Ajouter en haut
router.post('/test', (req, res) => {
  console.log('Corps de la requête test:', req.body);
  res.json({
    received: true,
    body: req.body
  });
});

router.post('/', 
  controller.handleUpload,
  controller.createHotel
);

router.get('/', controller.getAllHotels);

router.get('/:id', controller.getHotelById);

router.put('/:id', 
  controller.handleUpload,
  controller.updateHotel
);


router.delete('/:id', controller.deleteHotel);

// Ajouter la gestion d'erreurs
router.use((req, res, next) => {
  next(createError(404, "Endpoint non trouvé"));
});

router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().limit(10);
    console.log('Hôtels trouvés:', hotels.length);
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Erreur DB:', error);
    res.status(500).json({ message: error.message });
  }
});

// Exemple de route qui lève une 404 si pas trouvé
router.get('/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      // ici on utilise createError pour créer une erreur 404
      throw createError(404, 'Hôtel non trouvé');
    }
    res.json(hotel);
  } catch (err) {
    next(err);  // passe l’erreur au middleware d’erreurs
  }
});

module.exports = router;