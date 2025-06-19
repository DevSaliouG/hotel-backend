require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const hotelRoutes = require('./routes/hotelRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware CORS
app.use(cors({
  origin: 'http://localhost:4200', // Autorisez votre frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/hotels', hotelRoutes);
// Routes
//app.use('/api/hotels', require('./routes/hotelRoutes'));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gestion des fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connecté à MongoDB');
  
  // Vérifier si la collection existe
  mongoose.connection.db.listCollections({name: 'hotels'}).toArray()
    .then(collections => {
      if (collections.length) {
        logger.info('Collection "hotels" prête');
      } else {
        logger.warn('Collection "hotels" non trouvée. Création...');
        // Forcer la création de la collection
        Hotel.createCollection();
      }
    });
})
.catch(err => {
  logger.error(`Erreur de connexion MongoDB: ${err.message}`);
  process.exit(1);
});


// Gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

 