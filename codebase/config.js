// config.js
module.exports = {
    // Các domain được phép sử dụng API
    allowedDomains: [
        'ttkntc.blogspot.com',
        'ttkt.is-a.dev',
        'quiz-ttkntc.blogspot.com',
        'localhost' // Thêm localhost để test
    ],
    // Cấu hình Rate Limit: 100 request mỗi 15 phút cho mỗi IP
    rateLimit: {
        windowMs: 15 * 60 * 1000, 
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    },
    // Cấu hình CORS
    corsOptions: {
        origin: function (origin, callback) {
            // Cho phép request từ domain trong whitelist hoặc không có origin (VD: Postman)
            if (!origin || module.exports.allowedDomains.some(domain => origin.includes(domain))) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200
    },
    // Selector để trích xuất nội dung chính của bài viết trên Blogger
    // Bạn cần Inspect Element trên blog để tìm selector chính xác nhất
    // Thường là '.post-body' hoặc 'article'
    contentSelector: '.post-body' 
};