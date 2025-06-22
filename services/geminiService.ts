
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";

const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // Use the specified model

let ai: GoogleGenAI | null = null;

const initializeAiClient = (apiKey: string): GoogleGenAI => {
  if (!ai) {
    if (!apiKey) {
      throw new Error("API key is not provided for Gemini client initialization.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const startChatWithCharacter = async (systemInstruction: string, apiKey: string): Promise<Chat> => {
  const client = initializeAiClient(apiKey);
  // Type for CreateChatRequest: { model: string, config?: ChatConfig, history?: Content[] }
  // Type for ChatConfig: { systemInstruction?: string | Part | Content, ... other GenerationConfig props }
  const chatInstance: Chat = client.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: systemInstruction,
    },
    // history: [] // Start with an empty history for each new character chat
  });
  return chatInstance;
};

export const sendMessageToCharacter = async (chat: Chat, messageText: string): Promise<string> => {
  try {
    // Correct way to send a message in a chat session:
    // chat.sendMessage can take a string directly, or an object of type SendMessageRequest.
    // SendMessageRequest is { message: string | Part | Array<string | Part>; ...other configs... }
    // So, we pass an object with a 'message' property containing the string.
    const response: GenerateContentResponse = await chat.sendMessage({ message: messageText });
    
    // Directly access the .text property as per guidelines
    const textResponse = response.text;

    if (typeof textResponse === 'string') {
      return textResponse;
    } else {
      // Fallback or error if text is not directly available as expected
      console.warn("Gemini response.text was not a string:", response);
      // Try to find text in candidates if direct .text fails (should not be needed with correct usage)
      const candidateText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof candidateText === 'string') return candidateText;
      return "No se pudo obtener una respuesta en formato de texto.";
    }

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        // More specific error messages could be extracted if the Gemini SDK provides typed errors
        if (error.message.includes("API key not valid")) {
             throw new Error("Clave API inválida. Por favor, verifica tu API_KEY.");
        }
         throw new Error(`Error de API: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al comunicarse con el modelo de IA.");
  }
};
