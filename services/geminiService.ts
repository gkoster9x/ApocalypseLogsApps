import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";

// Initialize API client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'imagen-4.0-generate-001';
const CHAT_MODEL = 'gemini-2.5-flash';

// Schema for structured output from analysis
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: { type: Type.INTEGER, description: "Estimated danger level from 0 to 100 based on the entry." },
    summary: { type: Type.STRING, description: "A brief 1-sentence summary of the situation." },
    survivalTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 actionable survival tips relevant to the entry context."
    },
    resourcesDetected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of potential resources mentioned or implied (e.g., water, shelter)."
    }
  },
  required: ["riskLevel", "summary", "survivalTips", "resourcesDetected"]
};

export const analyzeJournalEntry = async (content: string, location: string) => {
  try {
    const prompt = `
      Bạn là một trợ lý AI sinh tồn trong thế giới hậu tận thế.
      Hãy phân tích đoạn nhật ký sau đây của người sống sót.
      Địa điểm: ${location}
      Nội dung: "${content}"
      
      Hãy đưa ra đánh giá rủi ro, tóm tắt ngắn gọn, lời khuyên sinh tồn và các tài nguyên có thể có.
      Trả lời bằng tiếng Việt.
    `;

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, // Keep analysis grounded
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateJournalImage = async (content: string) => {
  try {
    const prompt = `
      A dark, gritty, cinematic post-apocalyptic concept art style.
      Visualize this scene described in a survivor's journal: "${content}".
      Muted colors, high contrast, atmospheric lighting, detailed textures, rusted metal, overgrown vegetation.
      No text overlays.
    `;

    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9' // Cinematic feel
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("No image generated");
    
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const getChatResponse = async (history: {role: string, parts: string}[], newMessage: string) => {
    try {
        const chat = ai.chats.create({
            model: CHAT_MODEL,
            config: {
                systemInstruction: "Bạn là 'Watcher', một AI cũ kỹ còn sót lại sau tận thế. Giọng điệu của bạn khô khan, máy móc nhưng hữu ích. Bạn tập trung vào logic sinh tồn, tiết kiệm tài nguyên và cảnh báo nguy hiểm. Luôn trả lời bằng tiếng Việt."
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.parts }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (error) {
        console.error("Chat failed", error);
        return "Kết nối bị gián đoạn... Nhiễu tín hiệu...";
    }
}