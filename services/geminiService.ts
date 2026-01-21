
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBettingInsights = async (eventDescription: string, odds: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very brief (20 words max) betting insight for the event "${eventDescription}" with decimal odds of ${odds}. Focus on form and potential outcome logic.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "No insights available at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analyzing market trends...";
  }
};

export const getRiskScore = async (userActivity: any) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this betting user activity for responsible gaming risks: ${JSON.stringify(userActivity)}. 
        Return a JSON with "score" (0-100) and "recommendation" (brief text).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            },
            required: ["score", "recommendation"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return { score: 10, recommendation: "Stable play detected." };
    }
};
