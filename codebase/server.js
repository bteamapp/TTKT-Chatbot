// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./src/routes/api');
const { verifyApiKey } = require('./src/middleware/auth'); // Giả sử bạn dùng giải pháp API key

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================================================
// BƯỚC 1: ĐỊNH NGHĨA HEALTH CHECK ENDPOINT LÊN TRÊN CÙNG
// Endpoint này sẽ không đi qua bất kỳ middleware bảo mật nào bên dưới.
// ===================================================================
app.get('/healthz', (req, res) => {
    // Không cần logic phức tạp, chỉ cần trả về status 200 là đủ
    res.status(200).send('OK');
});

// ===================================================================
// BƯỚC 2: ÁP DỤNG CÁC MIDDLEWARE BẢO MẬT CHO CÁC ROUTE CÒN LẠI
// ===================================================================

// Middleware cơ bản (an toàn để áp dụng cho tất cả)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Áp dụng các middleware bảo mật
// Chúng sẽ KHÔNG ảnh hưởng đến '/healthz' đã được định nghĩa ở trên.
app.use(cors(config.corsOptions)); // CORS
app.use(verifyApiKey); // Middleware xác thực API key (nếu bạn dùng)
const limiter = rateLimit(config.rateLimit); // Rate Limiting
app.use('/api/', limiter); // Chỉ áp dụng rate limit cho các API endpoint cần thiết

// Routes chính
app.use('/', apiRoutes);

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