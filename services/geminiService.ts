import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* streamGemini(prompt: string, useThinkingMode: boolean = false) {
  // Default system instruction in English
  const systemInstruction = 'You are a helpful assistant. Please respond in English.';

  let modelName: string;
  let config: any = {
    systemInstruction: systemInstruction,
  };

  if (useThinkingMode) {
    modelName = 'gemini-2.5-pro';
    config.thinkingConfig = { thinkingBudget: 32768 };
    // As per guidelines, DO NOT set maxOutputTokens when using thinkingBudget for gemini-2.5-pro.
  } else {
    modelName = 'gemini-flash-lite-latest';
    // No thinkingConfig needed for flash-lite for low-latency responses.
  }

  try {
    const response = await ai.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: config,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error streaming from Gemini:", error);
    yield "An error occurred while connecting to the AI assistant.";
  }
}