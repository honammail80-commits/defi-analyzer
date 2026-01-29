/**
 * 测试 DeepSeek API
 * 验证 API Key 和连接是否正常
 */

import OpenAI from "openai";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com"
});

async function testDeepSeek() {
    console.log("🚀 测试 DeepSeek API...\n");

    const modelName = process.env.OPENAI_MODEL || "deepseek-chat";
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.deepseek.com";

    console.log(`📋 使用模型: ${modelName}`);
    console.log(`🔑 API Key 状态: ${process.env.OPENAI_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`🌐 API 端点: ${baseURL}\n`);

    try {
        console.log("⏳ 发送请求到 DeepSeek...");
        const startTime = Date.now();

        // DeepSeek 使用标准的 OpenAI chat completions 格式
        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [{
                role: "user",
                content: "用中文写一句话介绍 DeFi（去中心化金融），不超过30字"
            }],
            temperature: 0.7,
            max_tokens: 100
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log("\n✅ 请求成功！DeepSeek API 正常工作！");
        console.log(`⏱️  耗时: ${duration} 秒`);
        console.log("\n📝 AI 响应:\n");
        console.log(response.choices[0].message.content);
        console.log("\n" + "=".repeat(60));
        console.log("✨ DeepSeek API 验证成功！");
        console.log("🎯 无地区限制，完美支持中文");
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
        console.error("1. OPENAI_API_KEY 是否正确配置（DeepSeek API Key）");
        console.error("2. API Key 是否有效且有足够额度");
        console.error("3. 模型名称是否正确 (deepseek-chat)");
        console.error("4. baseURL 是否正确 (https://api.deepseek.com)");
        process.exit(1);
    }
}

// 运行测试
testDeepSeek();
