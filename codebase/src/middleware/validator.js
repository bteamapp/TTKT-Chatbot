// src/middleware/validator.js
const { URL } = require('url');
const config = require('../../config');

function validateUrl(req, res, next) {
    const postUrl = req.method === 'GET' ? req.query.url : req.body.url;

    if (!postUrl) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        const parsedUrl = new URL(postUrl);
        const domain = parsedUrl.hostname.replace('www.', '');

        if (!config.allowedDomains.includes(domain)) {
            return res.status(403).json({ error: 'This domain is not allowed to use the service.' });
        }
        
        // Lưu url đã được xác thực vào request để dùng ở route handler
        req.validatedUrl = postUrl; 
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }
}

module.exports = { validateUrl };