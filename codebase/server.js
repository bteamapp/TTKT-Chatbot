// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors(config.corsOptions)); // CORS phải được đặt trước các routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thiết lập view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter); // Chỉ áp dụng rate limit cho các API endpoint

// Health Check Endpoint
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

// Routes
app.use('/', apiRoutes);

// Xử lý lỗi 404 (Cũng nên cải thiện)
app.use((req, res, next) => {
    // Nếu yêu cầu đến API, trả về JSON. Nếu không, render trang lỗi.
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: "Endpoint không tồn tại." });
    }
    res.status(404).render('chat', { postUrl: null, error: "404 - Trang không tồn tại" });
});

// Xử lý lỗi chung (SỬA DÒNG NÀY)
// Dòng 35-38 (ước tính)
app.use((err, req, res, next) => {
    console.error(err.stack);
    // LUÔN trả về JSON nếu có lỗi để frontend có thể xử lý
    res.status(500).json({ error: 'Đã có lỗi xảy ra ở máy chủ. Vui lòng thử lại sau.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});