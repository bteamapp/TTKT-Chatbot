// download-chat.js
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-chat-btn');
    const messagesContainer = document.getElementById('chat-messages');

    if (downloadBtn && messagesContainer) {
        downloadBtn.addEventListener('click', () => {
            const messages = Array.from(messagesContainer.querySelectorAll('.message')).map(div => {
                const type = div.classList.contains('user') ? 'Bạn' : 'AI';
                const text = div.textContent.trim();
                return `${type}: ${text}`;
            });
            const chatText = messages.join('\n\n');
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'doan-chat.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});