const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./src/utils/logger'); // Logger'ı dahil et
const routes = require('./config/routes');
const proxyRoutes = require('./src/routes/proxy');
const userRoutes = require('./src/routes/userRoutes'); // User rotasını dahil et
const GeneralRateLimiter = require('./src/middlewares/GeneralRateLimiter');
const strictRateLimiter = require('./src/middlewares/strictRateLimiter');
const ipRateLimiter = require('./src/middlewares/ipRateLimiter');
const errorHandler = require('./src/middlewares/errorHandler');
const corsOptions = require('./src/middlewares/cors');
const connectDB = require('./src/database/db'); // Veritabanı bağlantısı için db.js dosyasını bağla
const authenticateJWT = require('./src/middlewares/jwtAuth');
const responseTransformer = require('./src/middlewares/responseTransformer');
const { checkGreylistAndBlacklist } = require('./src/services/ipTrackingService');
const complaintRoutes = require('./src/routes/complaintRoutes');
const requestMiddleware = require('./src/middlewares/requestMiddleware');
const prometheusMiddleware = require('./src/middlewares/analytics');

dotenv.config(); // .env dosyasını yükle
const app = express();
app.use(prometheusMiddleware);
app.use(requestMiddleware); // IP izleme için middleware

// Genel Middleware'ler
app.use(cors(corsOptions)); // CORS ayarları (domainler arası istekler için)
app.use(helmet()); // Güvenlik amacıyla headers ekler (XSS, clickjacking vb. koruması)
app.use(express.json()); // JSON formatında gelen verilerin işlenmesi
app.use(responseTransformer); // Yanıtları dönüştüren middleware

// Logger Middleware
app.use((req, res, next) => {
  const { method, url } = req;
  const start = Date.now(); // İstek başlangıç zamanını kaydet

  res.on('finish', () => {
    const duration = Date.now() - start; // Yanıt süresini hesapla
    const logMessage = `[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms`;

    // Hatalı durumlar için error seviyesinde, diğer durumlar için info seviyesinde loglama yapılır
    if (res.statusCode >= 400) {
      logger.error(logMessage); // Hatalı durumlar için
    } else {
      logger.info(logMessage); // Başarılı istekler için
    }
  });

  next(); // Bir sonraki middleware'e geçiş yap
});

connectDB(); // Veritabanı bağlantısı

// Genel rate limiting middleware (Tüm API'ler için)
app.use(GeneralRateLimiter);

// Greylist kontrolü (periyodik olarak çalışacak)
// Her saat başı greylist ve blacklist kontrol edilir
setInterval(checkGreylistAndBlacklist, 60 * 60 * 1000); // Saat başı çalışacak

// Rate limiting yalnızca login ve register işlemleri için uygulanır
app.use('/api/login', ipRateLimiter); // Login isteği için rate limiting
app.use('/api/register', strictRateLimiter); // Register isteği için daha sıkı rate limiting

// Mikroservislere yönlendirme ve proxy işlemleri
app.use('/api', proxyRoutes); // Proxy rotaları
app.use('/api', userRoutes); // Kullanıcı işlemleri için rotalar

// Şikayet sistemi için rota (ip adreslerine dair şikayetler)
app.use('/api', complaintRoutes); 

// JWT doğrulama gerektiren rotalar
// Korunan rotalar için JWT doğrulama middleware'i kullanılır
app.use('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Hata işleme middleware'i
app.use(errorHandler); // Hata yönetimi için genel middleware

// API sağlık durumu kontrolü (Health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API Gateway is running!' }); // API'nin çalışıp çalışmadığını kontrol etmek için
});

// Mikroservis rotalarını döndürme
// Sunucudaki mevcut mikroservislerin listesi döndürülür
app.get('/services', (req, res) => {
  res.status(200).json({ routes });
});

// Versiyon kontrolü
// API sürümü ve durumu hakkında bilgi verilir
app.get('/api/version', (req, res) => {
  res.status(200).json({ version: '1.0.0', message: 'API is running' });
});

// Sunucu başlatma
const PORT = process.env.PORT || 3001; // Port numarasını .env'den al ya da varsayılan 3001 kullan
app.listen(PORT, () => {
  const logMessage = `Server running on port ${PORT}`;
  console.log(logMessage); // Konsola log yazılır
  logger.info(logMessage); // Sunucu başlatıldığında bilgi mesajı loglanır
});
