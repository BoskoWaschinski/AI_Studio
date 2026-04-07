import { GoogleGenAI } from "@google/genai";

export async function generateImage(
  prompt: string,
  aspectRatio: string,
  resolution: string,
  useGoogleSearch: boolean,
  useImageSearch: boolean,
  referenceImages: { data: string, mimeType: string }[],
  customApiKey: string
): Promise<string | null> {
  try {
    const apiKeyToUse = customApiKey.trim() || process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
    let finalPrompt = prompt;

    if (useGoogleSearch) {
      // Use gemini-3-flash-preview for search grounding as requested
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want to generate an image with the following prompt: "${prompt}". Please use Google Search to find up-to-date and accurate information related to this prompt, and provide an enhanced, detailed image generation prompt based on the search results. Only return the enhanced prompt text, nothing else.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      if (searchResponse.text) {
        finalPrompt = searchResponse.text.trim();
        console.log("Enhanced prompt:", finalPrompt);
      }
    }

    const parts: any[] = [];

    for (const img of referenceImages) {
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    }

    parts.push({ text: finalPrompt });

    const tools: any[] = [];
    if (useImageSearch) {
      tools.push({
        googleSearch: {
          searchTypes: {
            imageSearch: {}
          }
        }
      });
    }

    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution
      }
    };

    if (tools.length > 0) {
      config.tools = tools;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: parts
      },
      config: config
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
