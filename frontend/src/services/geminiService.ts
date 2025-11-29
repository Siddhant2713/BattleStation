import { GoogleGenAI, Type } from "@google/genai";
import { PCPart, SimulationResult, GameData } from "../types";

// Note: In a real app, strict error handling for missing API keys is needed.
// Based on instructions, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeBuildPerformance = async (
  parts: PCPart[],
  game: GameData
): Promise<SimulationResult> => {
  if (!apiKey) {
    // Fallback for demo if no key provided in env
    return mockSimulation(parts, game);
  }

  const partsList = parts.map(p => `${p.type}: ${p.name} (${p.specs})`).join(', ');

  const prompt = `
    You are a PC hardware expert. Analyze this PC build for playing "${game.title}".
    Build Parts: ${partsList}.
    
    Provide a realistic FPS estimation for 1440p High Settings.
    Identify any bottlenecks.
    Give a short "verdict" (e.g. "Excellent", "Playable", "Struggling").
    Provide one specific upgrade recommendation if necessary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fps: { type: Type.NUMBER, description: "Estimated average FPS" },
            verdict: { type: Type.STRING, description: "Short performance summary" },
            bottleneck: { type: Type.STRING, description: "Component causing bottleneck, or 'None'" },
            recommendation: { type: Type.STRING, description: "Upgrade advice" }
          },
          required: ["fps", "verdict", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SimulationResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockSimulation(parts, game);
  }
};

// Fallback logic if API fails or key is missing
const mockSimulation = (parts: PCPart[], game: GameData): SimulationResult => {
  const totalScore = parts.reduce((acc, p) => acc + (p.performanceScore || 0), 0);
  // Rough calculation
  const baseFPS = 60;
  const scaling = totalScore / 200; 
  const fps = Math.round(baseFPS * scaling * (game.id === 'val' ? 3 : 1)); 

  return {
    fps,
    verdict: fps > 100 ? "Godlike" : fps > 60 ? "Smooth" : "Playable",
    bottleneck: "None calculated (Offline Mode)",
    recommendation: "Connect API Key for real insights."
  };
};
