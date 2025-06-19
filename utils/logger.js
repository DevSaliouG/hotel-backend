// server/utils/logger.js
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    // console
    new transports.Console(),

    // rotation journalière
    new DailyRotateFile({
      dirname: 'logs',               // dossier des logs
      filename: 'app-%DATE%.log',    // nom de fichier
      datePattern: 'YYYY-MM-DD',     // rotation quotidienne
      zippedArchive: true,           // compresse les anciens
      maxSize: '20m',                // max 20 méga par fichier
      maxFiles: '14d'                // conserve 14 jours
    })
  ],
});

module.exports = logger;
