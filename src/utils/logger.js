const winston = require('winston');
const path = require('path');

// Log dosyasının tam yolunu belirliyoruz
const logDirectory = path.join(__dirname, 'logs'); // logs klasörü, script'in bulunduğu dizinde olacak

// Logger'ı yapılandırıyoruz
const logger = winston.createLogger({
  level: 'info',  // Varsayılan log seviyesi 'info' (info, warn, error)
  format: winston.format.combine(
    winston.format.colorize(),  // Renkli çıktı
    winston.format.simple()     // Basit formatta log
  ),
  transports: [
    new winston.transports.Console(), // Konsola yazdırma
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'error.log'),  // error.log dosyasına yazma
      level: 'error'  // Sadece 'error' seviyesindeki loglar dosyaya kaydedilecek
    }),
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'combined.log'),  // combined.log dosyasına yazma
      level: 'info'  // Info ve daha üst seviyedeki loglar bu dosyaya kaydedilecek
    })
  ],
});

module.exports = logger;
