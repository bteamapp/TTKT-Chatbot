// src/services/crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');
const { URL } = require('url');

async function fetchAndExtractContent(url) {
    try {
        // SSRF FIX: Kiểm tra domain trước khi request
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname.replace(/^www\./, '');
        if (!config.allowedDomains.includes(domain)) {
            throw new Error('Domain không được phép crawl nội dung.');
        }

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        // Sử dụng selector đã config để lấy nội dung
        const content = $(config.contentSelector).text();

        if (!content) {
            throw new Error('Could not extract content from the provided URL. Please notify for the students to try again! Hãy liên hệ hỗ trợ qua Messenger Trung Tâm Kiến Thức kèm ảnh chụp vấn đề này!');
        }

        // Dọn dẹp text, loại bỏ khoảng trắng thừa
        return content.replace(/\s\s+/g, ' ').trim();
    } catch (error) {
        console.error(`Error crawling ${url}:`, error);
        throw new Error('Failed to fetch or parse the article. Please check the URL or the content selector. Hãy liên hệ hỗ trợ qua Messenger Trung Tâm Kiến Thức kèm ảnh chụp vấn đề này!');
    }
}

module.exports = { fetchAndExtractContent };