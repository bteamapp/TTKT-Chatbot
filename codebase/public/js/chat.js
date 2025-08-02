// public/js/chat.js
// VDJGO! - Tuấn 02 08 25
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    // HÀM `addMessage` đã được chuyển vào `render-markdown.js` và đổi tên thành `addMarkdownMessage`.
    // Chúng ta sẽ không định nghĩa nó ở đây nữa mà sử dụng `window.addMarkdownMessage` đã có sẵn.

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = input.value.trim();
        if (!question) return;

        // THAY ĐỔI: Sử dụng hàm render markdown cho tin nhắn của người dùng
        window.addMarkdownMessage(question, 'user');
        input.value = '';

        // THAY ĐỔI: Sử dụng hàm render markdown cho trạng thái "đang tải"
        const loadingMessage = window.addMarkdownMessage('Đang tạo...', 'bot loading');

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: POST_URL, // Biến này được lấy từ EJS
                    question: question,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }

            const data = await response.json();
            
            // Xóa loading
            loadingMessage.remove();
            
            // THAY ĐỔI: Sử dụng hàm render markdown cho câu trả lời của bot
            window.addMarkdownMessage(data.answer, 'bot');

        } catch (error) {
            loadingMessage.remove();
            
            // THAY ĐỔI: Sử dụng hàm render markdown cho thông báo lỗi
            window.addMarkdownMessage(`Lỗi: ${error.message}`, 'bot');
            console.error('Fetch error:', error);
        }
    });

    // Hàm addMessage gốc đã bị xóa và thay thế bằng lời gọi `window.addMarkdownMessage`
});