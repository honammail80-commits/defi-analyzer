import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Set max duration for long-running analysis
// Vercel Hobby: 10s, Pro: 60s, Enterprise: 300s
export const maxDuration = 60; // 60 seconds (requires Pro plan)
export const runtime = 'nodejs'; // Use Node.js runtime for better compatibility

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Read file contents
    const fileContents: string[] = [];
    for (const file of files) {
      try {
        const text = await file.text();
        fileContents.push(`File: ${file.name}\n\n${text}\n\n---\n\n`);
      } catch (error) {
        // For binary files like PDF, we'll skip them for now
        // In production, you'd want to use a PDF parser
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    const combinedContent = fileContents.join("\n");

    // Check API key first
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Please set it in your environment variables." },
        { status: 500 }
      );
    }

    // Initialize Gemini model
    // Use the latest stable model: gemini-2.5-flash (faster) or gemini-2.5-pro (more capable)
    // Old model names like "gemini-pro" and "gemini-1.5-flash" are deprecated
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    console.log(`[Gemini] Attempting to use model: ${modelName}`);
    console.log(`[Gemini] API Key present: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`[Gemini] Content length: ${combinedContent.length} characters`);

    const model = genAI.getGenerativeModel({
      model: modelName,
      // Add generation config for better control
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const prompt = `你是一位资深的DeFi专家和分析师。请分析以下DeFi项目的文档和代码，提供详细的分析报告。

项目内容：
${combinedContent}

请按照以下格式提供分析结果（必须是有效的JSON格式）：

{
  "risks": ["风险点1", "风险点2", "风险点3"],
  "highlights": ["亮点1", "亮点2", "亮点3"],
  "expertFocus": {
    "tokenomics": "代币经济学分析（评分和建议）",
    "security": "安全性分析（评分和建议）",
    "innovation": "创新性分析（评分和建议）",
    "team": "团队分析（评分和建议）",
    "marketFit": "市场契合度分析（评分和建议）"
  },
  "riskScore": 数字（0-100，越高风险越大）,
  "highlightScore": 数字（0-100，越高亮点越多）,
  "overallScore": 数字（0-100，综合评分）
}

请重点关注：
1. 智能合约安全漏洞和风险
2. 代币经济模型是否可持续
3. 团队背景和技术实力
4. 项目创新性和差异化
5. 市场定位和竞争力
6. 监管合规风险
7. 流动性风险
8. 代码质量和审计情况

请用中文回复，确保返回的是有效的JSON格式。`;

    let result, response, text;
    try {
      console.log(`[Gemini] Starting content generation with model: ${modelName}`);
      console.log(`[Gemini] Prompt length: ${prompt.length} characters`);

      // Try generateContent with proper error handling
      result = await model.generateContent(prompt);
      console.log(`[Gemini] Content generation completed`);

      response = await result.response;
      console.log(`[Gemini] Response received`);

      text = response.text();
      console.log(`[Gemini] Response text length: ${text.length} characters`);

    } catch (modelError: any) {
      console.error(`[Gemini] Error details:`, {
        message: modelError.message,
        status: modelError.status,
        statusText: modelError.statusText,
        errorDetails: modelError.errorDetails,
        stack: modelError.stack
      });

      // If model not found, provide detailed error
      if (modelError.message?.includes("404") || modelError.message?.includes("not found")) {
        return NextResponse.json(
          {
            error: "Model not available. Please check the following:",
            details: [
              `1. Tried model: ${modelName}`,
              "2. Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-flash-latest, gemini-pro-latest",
              "3. Old models (gemini-pro, gemini-1.5-flash) are deprecated",
              "4. You can set GEMINI_MODEL environment variable to use a different model",
              "5. Check available models at https://ai.google.dev/models/gemini"
            ],
            originalError: modelError.message,
            suggestion: "Try: export GEMINI_MODEL=gemini-2.5-flash or gemini-flash-latest"
          },
          { status: 500 }
        );
      }
      // Other errors
      throw modelError;
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    // Parse JSON
    let analysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error("Failed to parse JSON:", parseError);
      analysis = {
        risks: ["无法解析分析结果"],
        highlights: ["请检查API响应"],
        expertFocus: {
          tokenomics: "待分析",
          security: "待分析",
          innovation: "待分析",
          team: "待分析",
          marketFit: "待分析",
        },
        riskScore: 50,
        highlightScore: 50,
        overallScore: 50,
      };
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze project", details: String(error) },
      { status: 500 }
    );
  }
}
