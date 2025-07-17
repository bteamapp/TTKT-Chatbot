// config.js
module.exports = {
    // Các domain được phép sử dụng API
    allowedDomains: [
        'ttkntc.blogspot.com',
        'ttkt.is-a.dev',
        'quiz-ttkntc.blogspot.com',
        'www.ttkt.is-a.dev',
        'undefined', // For debug
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
            // Lấy referer từ request headers nếu origin undefined
            const referer = this && this.req ? this.req.headers.referer : undefined;
            console.log('CORS check: Origin ->', origin, '| Referer ->', referer);

            // Kiểm tra whitelist cho cả origin và referer
            const isAllowed = module.exports.allowedDomains.some(domain =>
                (origin && origin.includes(domain)) ||
                (referer && referer.includes(domain))
            );

            if (!origin && !referer) {
                // Không có origin và referer, có thể là request nội bộ hoặc tool test
                callback(new Error('Not allowed by CORS'));
            } else if (isAllowed) {
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