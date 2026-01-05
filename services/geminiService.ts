import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRecruitmentCopy = async (
  ipName: string,
  artistNames: string[],
  boxCount: number,
  specialRules: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return "API Key Missing: Unable to generate copy. Please write manually.";
  }

  const prompt = `
    你是一个深谙中国饭圈文化的资深"车头"（拼团组织者）。
    请为我写一段充满激情、用语地道、吸引粉丝上车的【综艺/影视收藏卡】招募文案。

    基本信息：
    - IP名称：${ipName}
    - 拼箱数量：${boxCount}箱
    - 涉及艺人：${artistNames.join(', ')}
    - 特殊规则：${specialRules}

    要求：
    1. 语气亲切，使用饭圈常用语（如：老师、上车、蹲、吃谷、好价、强推）。
    2. 重点突出热门艺人和特殊福利。
    3. 格式清晰，使用Emoji点缀，适合发在小红书或微信群。
    4. 长度控制在200字以内。
    5. 不要包含任何虚假承诺。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });
    return response.text || "生成失败，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成文案时遇到网络问题，请稍后重试。";
  }
};