const logger = require('../utils/logger');


module.exports = (err, req, res, next) => {
  // Log de l'erreur
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Envoyer la réponse
  res.status(err.status || 500);
  
  if (process.env.NODE_ENV === 'development') {
    res.json({
      error: {
        status: err.status || 500,
        message: err.message,
        stack: err.stack
      }
    });
  } else {
    res.json({
      error: {
        status: err.status || 500,
        message: err.message
      }
    });
  }
};