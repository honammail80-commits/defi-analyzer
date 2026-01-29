// Quick test to verify gemini-2.5-flash works
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
}

console.log(`✅ Testing model: ${modelName}\n`);

const genAI = new GoogleGenerativeAI(apiKey);

async function quickTest() {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log('📤 Sending test query...');
        const result = await model.generateContent('Say "Hello, DeFi Analyzer is working!" in Chinese');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Model response:');
        console.log(text);
        console.log('\n🎉 Your Gemini API is working correctly with', modelName);

    } catch (error) {
        console.error('❌ FAILED:', error.message);
        console.log('\n💡 Try setting GEMINI_MODEL to a different model:');
        console.log('   export GEMINI_MODEL=gemini-flash-latest');
        console.log('   export GEMINI_MODEL=gemini-2.5-pro');
        process.exit(1);
    }
}

quickTest();
