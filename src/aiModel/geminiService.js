import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI('AIzaSyBdKflFa1TN3PwJJss6Mxe31GvdfNRqdQ4');
        // Use gemini-1.5-flash model instead of gemini-pro
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateResponse(message, history = []) {
        try {
            const chat = this.model.startChat({
                history: history.map(msg => ({
                    role: msg.role,
                    parts: msg.content
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                }
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return {
                success: true,
                data: response.text()
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate response'
            };
        }
    }
}

const geminiService = new GeminiService();
export default geminiService;
