// src/services/crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');

async function fetchAndExtractContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        // Sử dụng selector đã config để lấy nội dung
        const content = $(config.contentSelector).text();

        if (!content) {
            throw new Error('Could not extract content from the provided URL.');
        }

        // Dọn dẹp text, loại bỏ khoảng trắng thừa
        return content.replace(/\s\s+/g, ' ').trim();
    } catch (error) {
        console.error(`Error crawling ${url}:`, error);
        throw new Error('Failed to fetch or parse the article.');
    }
}

module.exports = { fetchAndExtractContent };