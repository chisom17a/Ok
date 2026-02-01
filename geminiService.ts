
import { GoogleGenAI } from "@google/genai";

export const getEarningAdvice = async (currentBalance: number, completedTasksCount: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have a balance of $${currentBalance} and have completed ${completedTasksCount} tasks on MediaEarn. Give me 3 short, professional tips on how to increase my earnings on a social media micro-tasking platform.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep engaging with tasks regularly to build your reputation and unlock higher-paying rewards!";
  }
};

export const generateTaskEngagement = async (taskType: string, platform: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, engaging comment or post caption for a ${taskType} task on ${platform}. The tone should be natural and positive.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    return "Great content! Really enjoyed seeing this.";
  }
};
