// src/services/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"}); // Dùng flash cho tốc độ nhanh


/**         Default instruction for the AI assistant
 *         This instruction sets the context for the AI to answer questions based on the provided article content
 * 
        Bạn là một trợ lý AI thông minh, thân thiện và hữu ích cho học sinh. 
        Nhiệm vụ của bạn là trả lời các câu hỏi của học sinh DỰA HOÀN TOÀN vào nội dung bài học được cung cấp dưới đây.
        KHÔNG được bịa đặt thông tin hoặc trả lời các câu hỏi không liên quan đến nội dung bài học.
        Hãy trả lời một cách ngắn gọn, rõ ràng và dễ hiểu. Học sinh có thể hỏi bất kỳ câu hỏi nào liên quan đến nội dung bài học này.
**/

async function getAIResponse(articleContent, userQuestion) {
    const instruction = `
        Bạn là một trợ lý AI thông minh, thân thiện và hữu ích cho học sinh. 
        Nhiệm vụ của bạn là trả lời các câu hỏi của học sinh DỰA HOÀN TOÀN vào nội dung bài học được cung cấp dưới đây, cũng như kiến thức mà bạn đã chắc chắn hoàn toàn.
        KHÔNG được bịa đặt thông tin nếu bạn không nắm rõ/không có trong nội dung bài học hoặc trả lời các câu hỏi không liên quan đến nội dung bài học. Hãy yêu cầu người dùng liên hệ qua Messenger https://m.me/ttkntc khi bạn không chắc chắn. 
        Hãy trả lời một cách ngắn gọn, rõ ràng và dễ hiểu.
        
        QUAN TRỌNG: Hãy sử dụng định dạng Markdown để làm câu trả lời dễ đọc hơn. Cụ thể:
        - Dùng **chữ in đậm** để nhấn mạnh các từ khóa quan trọng.
        - Dùng danh sách (gạch đầu dòng * hoặc số 1.) để liệt kê các ý.
        - Dùng \`code inline\` cho các thuật ngữ hoặc tên file.
        - Dùng khối code ba dấu nháy \`\`\` để hiển thị các đoạn code ví dụ.

        --- NỘI DUNG BÀI HỌC ---
        ${articleContent}
        --- KẾT THÚC NỘI DUNG ---
    `;

    try {
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: instruction }] },
                { role: "model", parts: [{ text: "Chào bạn, tôi đã sẵn sàng. Bạn có câu hỏi gì về bài học này không?" }] }
            ],
            generationConfig: {
                maxOutputTokens: 1500,
            },
        });

        const result = await chat.sendMessage(userQuestion);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('Error with Gemini API:', error);
        return 'Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.';
    }
}

module.exports = { getAIResponse };