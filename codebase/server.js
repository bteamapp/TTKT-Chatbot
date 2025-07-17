// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./src/routes/api');
// Giả sử bạn đã tạo file này theo hướng dẫn trước
const { verifyApiKey } = require('./src/middleware/auth'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- CÁC MIDDLEWARE TOÀN CỤC KHÔNG LIÊN QUAN ĐẾN CORS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- ROUTE CÔNG KHAI, KHÔNG CẦN CORS ---
// Dòng 15-17 (ước tính)
// Health Check Endpoint cho Render - Đặt trước tất cả các middleware bảo mật
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// --- CÁC MIDDLEWARE BẢO MẬT ÁP DỤNG CHO CÁC ROUTE PHÍA SAU ---
// Dòng 20-23 (ước tính)
// Giờ CORS và các middleware khác sẽ không ảnh hưởng đến /healthz
const corsMiddleware = cors(config.corsOptions);
const limiter = rateLimit(config.rateLimit);

// Áp dụng middleware bảo mật cho các route chính
app.use('/', corsMiddleware, verifyApiKey, apiRoutes); // apiRoutes đã bao gồm cả /chat và /api/ask
app.use('/api/', limiter); // Chỉ áp dụng rate limit cho /api/

// --- CÁC TRÌNH XỬ LÝ LỖI (Giữ nguyên) ---
// Xử lý lỗi 404
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: "Endpoint không tồn tại." });
    }
    res.status(404).render('chat', { postUrl: null, error: "404 - Trang không tồn tại" });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Đã có lỗi xảy ra ở máy chủ. Vui lòng thử lại sau.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});