// Test script to list available Gemini models for your API key
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env.local');
    console.log('Please create .env.local file with:');
    console.log('GEMINI_API_KEY=your_api_key_here');
    process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
console.log('\n🔍 Testing Gemini API...\n');

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('📋 Attempting to list available models...\n');

        // Try to list models using the SDK method if available
        // Note: The SDK might not have a direct listModels method, so we'll try different approaches

        // Approach 1: Try common models one by one
        const modelsToTest = [
            'gemini-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-1.0-pro',
            'models/gemini-pro',
            'models/gemini-1.5-flash'
        ];

        console.log('Testing individual models:\n');

        for (const modelName of modelsToTest) {
            try {
                console.log(`Testing: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                const response = await result.response;
                const text = response.text();
                console.log(`  ✅ ${modelName} - WORKS! Response: ${text.substring(0, 50)}...`);
            } catch (error) {
                console.log(`  ❌ ${modelName} - Error: ${error.message.substring(0, 100)}...`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nFull error:', error);
    }
}

// Also try direct API call to list models
async function listModelsDirectAPI() {
    console.log('\n📡 Trying direct API call to list models...\n');

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            console.log(`❌ API returned status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.log('Error details:', errorText);
            return;
        }

        const data = await response.json();
        console.log('✅ Available models:');
        console.log(JSON.stringify(data, null, 2));

        if (data.models) {
            console.log('\n📝 Summary of available models:');
            data.models.forEach(model => {
                console.log(`  - ${model.name}`);
                if (model.supportedGenerationMethods) {
                    console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
            });
        }
    } catch (error) {
        console.error('❌ Direct API call failed:', error.message);
    }
}

async function main() {
    await listModelsDirectAPI();
    await listModels();
}

main();
