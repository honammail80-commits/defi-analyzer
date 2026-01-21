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

    // Initialize Gemini model
    // Using gemini-1.5-flash: faster, more cost-effective, suitable for analysis
    // Alternative: gemini-1.5-pro for more complex analysis (slower but more capable)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
