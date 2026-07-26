const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load .env.local manually for the script
const envContent = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
if (match) {
  process.env.GEMINI_API_KEY = match[1];
}

async function testGemini() {
  console.log("Initializing Gemini with API Key from .env.local...");
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === "") {
    console.error("❌ Error: GEMINI_API_KEY is empty. Did you paste your key in .env.local?");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const mockLegalIssue = "I bought a refrigerator online but it was delivered broken. The seller is ignoring my refund requests.";
  
  const prompt = `You are an expert in Indian Law. Analyze the following user legal issue and output ONLY a valid JSON object strictly adhering to this interface:
{
  "laws": ["string"],
  "forum": "string",
  "docs": ["string"],
  "steps": ["string"],
  "outcomes": ["string"],
  "question": "string"
}

Issue:
"${mockLegalIssue}"`;

  try {
    console.log(`\nSending Mock Issue to Gemini:\n"${mockLegalIssue}"\n`);
    console.log("Waiting for response...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      console.log("\n✅ Success! Gemini returned:");
      console.log(JSON.parse(response.text));
    } else {
      console.log("⚠️ Response was empty.");
    }
  } catch (error) {
    console.error("\n❌ Error communicating with Gemini:");
    console.error(error.message);
  }
}

testGemini();
