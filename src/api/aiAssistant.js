const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIResponse = async (query) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an AI assistant that only answers questions related to sports. If the question is not related to sports, respond with: "This assistant only handles sports-related queries." If the user asks about nearby sports clubs or clubs in a specific location, respond with information about sports clubs in the requested area. Now answer this: ${query}`,
                },
              ],
            },
          ],
        }),
        
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, something went wrong while generating the response.';
  }
};
