const { URL } = require('url');
const config = require('../../config');

function validateUrl(req, res, next) {
    const postUrl = req.method === 'GET' ? req.query.url : req.body.url;

    if (!postUrl) {
        // SỬA DÒNG 7: từ .send() thành .json()
        return res.status(400).json({ error: "Yêu cầu thiếu tham số 'url'." });
    }

    try {
        const parsedUrl = new URL(postUrl);
        const domain = parsedUrl.hostname.replace(/^www\./, '');

        if (!config.allowedDomains.includes(domain)) {
            // SỬA DÒNG 17: từ .send() thành .json()
            return res.status(403).json({ error: "Domain này không được phép sử dụng dịch vụ." });
        }
        
        req.validatedUrl = postUrl; 
        next();
    } catch (error) {
        // SỬA DÒNG 24: từ .send() thành .json()
        return res.status(400).json({ error: "Định dạng URL không hợp lệ." });
    }
}

module.exports = { validateUrl };