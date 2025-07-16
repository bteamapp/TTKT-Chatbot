// src/routes/api.js
const express = require('express');
const router = express.Router();
const { validateUrl } = require('../middleware/validator');
const { fetchAndExtractContent } = require('../services/crawler');
const { getAIResponse } = require('../services/gemini');

// Route để hiển thị giao diện chat
// Ví dụ: GET /chat?url=https://...
router.get('/chat', validateUrl, (req, res) => {
    // Truyền validatedUrl vào template EJS
    res.render('chat', { postUrl: req.validatedUrl });
});

// API Endpoint để xử lý câu hỏi của người dùng
// Ví dụ: POST /api/ask
router.post('/api/ask', validateUrl, async (req, res) => {
    const { question } = req.body;
    const postUrl = req.validatedUrl;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        // Crawl data mỗi lần có câu hỏi để đảm bảo stateless, đơn giản cho Render
        const articleContent = await fetchAndExtractContent(postUrl);
        
        // Lấy câu trả lời từ AI
        const aiResponse = await getAIResponse(articleContent, question);
        
        res.json({ answer: aiResponse });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;