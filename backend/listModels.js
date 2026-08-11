const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const pager = await ai.models.list();

  for (const model of pager.pageInternal) {
    if (model.supportedActions?.includes("generateContent")) {
      console.log(model.name);
    }
  }
}

main().catch(console.error);