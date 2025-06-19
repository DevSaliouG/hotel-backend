const Hotel = require('../models/Hotel');
const createError = require('http-errors');
const logger = require('../utils/logger');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const multer = require('multer');



// Middleware pour gérer l'upload
exports.handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(createError(400, `Erreur d'upload: ${err.message}`));
      } else if (err) {
        return next(err);
      }
    }
    next();
  });
};

// Créer un hôtel avec image
exports.createHotel = async (req, res, next) => {
  try {
    // Vérifier si des données sont reçues
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn('Tentative de création sans données');
      throw createError(400, "Aucune donnée fournie");
    }

    // Log des données reçues
    logger.info('Données reçues:', req.body);
    if (req.file) {
      logger.info('Fichier reçu:', req.file);
    }

    const hotelData = {
      name: req.body.name,
      email: req.body.email,
      pricePerNight: parseFloat(req.body.pricePerNight),
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      currency: req.body.currency || 'XOF',
      isOnline: req.body.isOnline === 'true'
    };

    if (req.file) {
      hotelData.image = `/uploads/${req.file.filename}`;
    }

    // Validation manuelle
    if (!hotelData.name) throw createError(400, "Le nom est requis");
    if (!hotelData.email) throw createError(400, "L'email est requis");
    if (!hotelData.pricePerNight) throw createError(400, "Le prix est requis");
    if (!hotelData.address) throw createError(400, "L'adresse est requise");
    if (!hotelData.phoneNumber) throw createError(400, "Le téléphone est requis");

    const newHotel = new Hotel(hotelData);
    const savedHotel = await newHotel.save();
    
    logger.info(`Hôtel créé: ${savedHotel._id}`, savedHotel);
    res.status(201).json(savedHotel);
  } catch (err) {
    logger.error('Erreur création hôtel:', err.message);
    if (req.file) {
      fs.unlink(req.file.path, () => {
        logger.warn(`Fichier supprimé: ${req.file.path}`);
      });
    }
    next(err);
  }
};

// Mettre à jour un hôtel avec gestion d'image
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) throw createError(404, "Hôtel non trouvé");

    const updateData = req.body;
    let oldImage = null;

    if (req.file) {
      oldImage = hotel.image;
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Supprimer l'ancienne image si mise à jour réussie
    if (oldImage) {
      const imagePath = path.join(__dirname, `../${oldImage}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    logger.info(`Hôtel mis à jour: ${updatedHotel._id}`);
    res.json(updatedHotel);
  } catch (err) {
    // Supprimer la nouvelle image si mise à jour échoue
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

// Supprimer un hôtel avec son image
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) throw createError(404, "Hôtel non trouvé");

    // Supprimer l'image associée
    if (hotel.image) {
      const imagePath = path.join(__dirname, `../${hotel.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    logger.info(`Hôtel supprimé: ${hotel._id}`);
    res.json({ message: 'Hôtel supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

// Récupérer tous les hôtels
// Assurez-vous que cette fonction existe bien
// Corrigez la fonction getAllHotels
exports.getAllHotels = async (req, res, next) => {
  try {
    // Enlevez la pagination pour le moment
    const hotels = await Hotel.find();
    
    logger.info(`${hotels.length} hôtels récupérés`);
    res.status(200).json(hotels);
  } catch (err) {
    logger.error(`Erreur récupération hôtels: ${err.message}`);
    next(createError(500, "Erreur lors de la récupération des hôtels"));
  }
};

// Récupérer un hôtel par ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un hôtel
exports.updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedHotel) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un hôtel
exports.deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.status(200).json({ message: 'Hôtel supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};