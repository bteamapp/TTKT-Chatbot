// render-markdown.js
window.addMarkdownMessage = function(text, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const p = document.createElement('p');
    // Luôn render markdown cho cả user và bot
    p.innerHTML = marked.parse(text);

    messageDiv.appendChild(p);
    messagesContainer.appendChild(messageDiv);

    // Cuộn xuống tin nhắn mới nhất
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageDiv;
};