import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TrendAnalysisData, FuturePersona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hotKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "热门关键词：包括风格名称、流行色彩名称、或热门面料名称" },
          volume: { type: Type.NUMBER, description: "热度预测值 0-100" },
          category: { type: Type.STRING, description: "分类，严格使用以下几类之一：'风格', '色彩', '面料', '单品'" },
        },
        required: ["word", "volume", "category"],
      },
      description: "小红书趋势关键词混合列表，必须覆盖风格、色彩、面料三类。",
    },
    consumerHabits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          attribute: { type: Type.STRING, description: "消费习惯维度，如 '价格敏感度', '品牌忠诚', '社交驱动', '悦己消费'" },
          value: { type: Type.NUMBER, description: "维度评分 0-100" },
          description: { type: Type.STRING, description: "简短说明" },
        },
        required: ["attribute", "value", "description"],
      },
      description: "6个关键的消费行为画像维度",
    },
    preferences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "决策因素，如 '面料质感', '色彩搭配', '设计独特性', '性价比'" },
          percentage: { type: Type.NUMBER, description: "占比百分比" },
        },
        required: ["name", "percentage"],
      },
      description: "购买决策驱动因素分布",
    },
    futurePersonas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "未来消费人群名称 (富有创造力的命名)" },
          tagline: { type: Type.STRING, description: "一句精准的人群Slogan" },
          description: { type: Type.STRING, description: "详细的人群特征描述" },
          keyItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4个必备时尚单品或面料细节" },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: "代表这群人的3个Hex颜色代码" },
        },
        required: ["name", "tagline", "description", "keyItems", "colorPalette"],
      },
      description: "基于趋势预测的3类未来典型消费人群",
    },
    executiveSummary: {
      type: Type.STRING,
      description: "深度洞察总结，分析风格背后的社会心理、消费逻辑及趋势预判。",
    },
  },
  required: ["hotKeywords", "consumerHabits", "preferences", "futurePersonas", "executiveSummary"],
};

export const fetchTrendAnalysis = async (query: string): Promise<TrendAnalysisData> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    请作为一位资深的小红书（Xiaohongshu）时尚趋势分析师和消费心理学家，针对预测请求："${query}" 进行深度分析。
    
    请注意：如果查询包含未来的年份（如2026），请进行**趋势预测（Forecasting）**，而非仅仅描述现状。
    
    请输出简体中文（Simplified Chinese），并严格包含以下内容：

    1. 热门穿搭热词 (Hot Keywords): 提取8个最关键的词。**必须混合包含**：
       - 核心风格 (Styles)
       - **流行色彩 (Trending Colors)**：请预测具体的流行色名称。
       - **流行面料 (Trending Fabrics)**：请预测材质趋势（如：科技感面料、重工蕾丝、老钱风羊绒等）。
       - 热门单品 (Key Items)
    
    2. 消费习惯画像 (Consumer Habits): 分析关注该趋势人群的6个核心消费行为维度。
    
    3. 消费喜好 (Purchase Preferences): 分析影响他们下单的关键驱动因素。
    
    4. 未来人群画像 (Future Personas): 预测3个在该时间段（如2026春夏）将崛起的细分消费人群。
    
    5. 深度总结 (Executive Summary): 结合社会心理学，分析该趋势背后的深层逻辑、色彩心理学和面料触感趋势。

    数据要求：
    - 必须真实反映中国社交媒体语境。
    - 语言风格：专业、敏锐、带有时尚媒体（如Vogue Business China）的调性。
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "你是由Google训练的时尚与消费趋势专家，精通中国社交媒体生态，擅长洞察小红书用户心理与未来时尚趋势。",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TrendAnalysisData;
    }
    throw new Error("No data returned from Gemini.");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generatePersonaImage = async (persona: FuturePersona): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `
    Create a high-end, ultra-detailed fashion editorial photograph for a style persona named "${persona.name}".
    
    **Visual Context**:
    - Tagline/Theme: ${persona.tagline}
    - Detailed Description: ${persona.description}
    - Key Fashion Items to Feature: ${persona.keyItems.join(", ")}
    - Color Palette: ${persona.colorPalette.join(", ")}
    
    **Photography Style & Quality**:
    - **Resolution**: 8k, Ultra-HD, masterpiece quality, photorealistic.
    - **Lighting**: Professional studio lighting, cinematic chiaroscuro, or natural golden hour light (matching the vibe).
    - **Textures**: Highly detailed fabric textures (silk, denim, leather, wool), realistic skin texture, sharp focus.
    - **Composition**: Vogue/Harper's Bazaar magazine cover style, strong focal point, depth of field.
    - **Vibe**: Sophisticated, trendy, expressive, high-fashion.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};