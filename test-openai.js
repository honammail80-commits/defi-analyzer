/**
 * OpenAI Responses API 测试脚本
 * 用于验证 gpt-5-nano 模型和 responses.create() API
 */

import OpenAI from "openai";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    console.log("🚀 测试 OpenAI Responses API...\n");

    const modelName = process.env.OPENAI_MODEL || "gpt-5-nano";
    console.log(`📋 使用模型: ${modelName}`);
    console.log(`🔑 API Key 状态: ${process.env.OPENAI_API_KEY ? '✅ 已配置' : '❌ 未配置'}\n`);

    try {
        console.log("⏳ 发送请求...");
        const startTime = Date.now();

        const response = await openai.responses.create({
            model: modelName,
            input: "用中文写一首关于 DeFi 的俳句",
            store: true,
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log("\n✅ 请求成功！");
        console.log(`⏱️  耗时: ${duration} 秒`);
        console.log("\n📝 AI 响应:\n");
        console.log(response.output_text);
        console.log("\n" + "=".repeat(60));
        console.log("✨ OpenAI API 集成验证成功！");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("\n❌ 错误:", error.message);
        if (error.status) {
            console.error(`状态码: ${error.status}`);
        }
        if (error.code) {
            console.error(`错误代码: ${error.code}`);
        }
        console.error("\n💡 请检查:");
        console.error("1. OPENAI_API_KEY 是否正确配置");
        console.error("2. API Key 是否有效且有足够额度");
        console.error("3. 模型名称是否正确 (gpt-5-nano)");
        process.exit(1);
    }
}

// 运行测试
testOpenAI();
