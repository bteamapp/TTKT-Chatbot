// config.js
module.exports = {

    // Cấu hình Rate Limit: 100 request mỗi 15 phút cho mỗi IP
    rateLimit: {
        windowMs: 15 * 60 * 1000, 
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    },
    // Cấu hình CORS
    corsOptions: {
        // Cung cấp một danh sách các origin được phép hoặc một hàm kiểm tra
        origin: [
            'ttkntc.blogspot.com',
            'ttkt.is-a.dev',
            'quiz-ttkntc.blogspot.com',
            'localhost' // Thêm localhost để test
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
        allowedHeaders: "Content-Type,Authorization", // Các header được phép
        credentials: true, // Nếu bạn cần gửi cookie hoặc authorization headers
        optionsSuccessStatus: 200 // Dành cho các trình duyệt cũ
    },
    // Selector để trích xuất nội dung chính của bài viết trên Blogger
    // Bạn cần Inspect Element trên blog để tìm selector chính xác nhất
    // Thường là '.post-body' hoặc 'article'
    contentSelector: '.post-body' 
};