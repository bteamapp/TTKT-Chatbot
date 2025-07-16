// public/js/chat.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = input.value.trim();
        if (!question) return;

        // Hiển thị câu hỏi của người dùng
        addMessage(question, 'user');
        input.value = '';

        // Hiển thị trạng thái "đang tải"
        const loadingMessage = addMessage('...', 'bot loading');

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
            
            // Xóa loading và hiển thị câu trả lời
            loadingMessage.remove();
            addMessage(data.answer, 'bot');

        } catch (error) {
            loadingMessage.remove();
            addMessage(`Lỗi: ${error.message}`, 'bot');
            console.error('Fetch error:', error);
        }
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const p = document.createElement('p');
        p.textContent = text;
        
        messageDiv.appendChild(p);
        messagesContainer.appendChild(messageDiv);
        
        // Cuộn xuống tin nhắn mới nhất
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageDiv;
    }
});