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

    // ===================================================================
    // THAY ĐỔI QUAN TRỌNG Ở ĐÂY
    // Mở toang cửa CORS, để cho trình duyệt không chặn request.
    // Việc bảo mật sẽ do middleware `validateUrl` của chúng ta đảm nhiệm.
    // ===================================================================
    corsOptions: {
        origin: '*', // Cho phép tất cả các origin
        optionsSuccessStatus: 200
    },

    // Selector để trích xuất nội dung chính của bài viết trên Blogger
    // Bạn cần Inspect Element trên blog để tìm selector chính xác nhất
    // Thường là '.post-body' hoặc 'article'
    contentSelector: '.post-body' 
};