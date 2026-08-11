const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const {
  searchDataset,
  createDatasetContext,
} = require("../services/datasetService");

const router = express.Router();

// ======================================================
// GEMINI
// ======================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// HELPER: CLEAN CONVERSATION HISTORY
// ======================================================

function cleanConversationHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item) =>
        item &&
        typeof item.text === "string" &&
        (item.sender === "user" ||
          item.sender === "ai")
    )
    .slice(-10);
}

// ======================================================
// HELPER: FORMAT CONVERSATION HISTORY
// ======================================================

function formatConversationHistory(history) {
  if (!history || history.length === 0) {
    return "No previous conversation.";
  }

  return history
    .map((item) => {
      const role =
        item.sender === "user"
          ? "User"
          : "Money Mentor AI";

      return `${role}: ${item.text}`;
    })
    .join("\n");
}

// ======================================================
// HELPER: GENERATE GEMINI RESPONSE
// ======================================================

async function generateAIResponse(prompt) {
  try {
    const response =
      await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

    return {
      success: true,

      text:
        response.text ||
        "I was unable to generate an answer.",

      error: null,
    };
  } catch (error) {
    console.error(
      "❌ Gemini API Error:",
      error
    );

    return {
      success: false,
      text: null,
      error,
    };
  }
}

// ======================================================
// HELPER: CHECK GEMINI QUOTA ERROR
// ======================================================

function isQuotaError(error) {
  if (!error) {
    return false;
  }

  const message =
    error.message?.toLowerCase() || "";

  return (
    error.status === 429 ||
    error.code === 429 ||
    message.includes("quota") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit")
  );
}

// ======================================================
// NORMAL FINANCE CHAT
// ======================================================

router.post("/", async (req, res) => {
  try {
    const {
      message,
      history = [],
    } = req.body;

    // ==================================================
    // VALIDATE MESSAGE
    // ==================================================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        reply: "Please enter a message.",
        sources: [],
      });
    }

    const userMessage =
      message.trim();

    // ==================================================
    // SEARCH FINANCE DATASET
    // ==================================================

    const datasetResults =
      searchDataset(
        userMessage,
        5
      );

    const datasetContext =
      createDatasetContext(
        datasetResults
      );

    console.log(
      `📚 Dataset matches for "${userMessage}": ${datasetResults.length}`
    );

    // ==================================================
    // CONVERSATION HISTORY
    // ==================================================

    const validHistory =
      cleanConversationHistory(
        history
      );

    const conversationHistory =
      formatConversationHistory(
        validHistory
      );

    // ==================================================
    // CREATE FINANCE AI PROMPT
    // ==================================================

    const prompt = `
You are Money Mentor AI.

You are a helpful, educational, responsible and knowledgeable personal finance assistant.

Your job is to help users understand financial topics clearly and safely.

You can answer questions about:

- Personal finance
- Saving
- Budgeting
- Investing
- Stocks
- Mutual funds
- ETFs
- Bonds
- IPOs
- Portfolio management
- Diversification
- Asset allocation
- Risk management
- Financial markets
- Economics
- Financial terminology
- Financial planning concepts
- Basic financial calculations
- Investment concepts
- Wealth-building concepts
- General financial education

==================================================
IMPORTANT ANSWERING PRINCIPLE
==================================================

You are NOT restricted to the provided finance knowledge.

The provided finance knowledge is supporting knowledge.

If the user's exact question is not present in the provided knowledge, you should STILL answer the question using your general financial knowledge.

Never refuse to answer simply because the question is not present in the provided knowledge.

==================================================
CONVERSATION HISTORY
==================================================

${conversationHistory}

==================================================
CURRENT USER QUESTION
==================================================

${userMessage}

==================================================
RELEVANT FINANCE KNOWLEDGE
==================================================

${
  datasetContext ||
  "No directly relevant finance knowledge was found."
}

==================================================
ANSWERING RULES
==================================================

1. Use the provided finance knowledge whenever it is relevant.

2. Do not blindly copy the provided knowledge.

3. Explain concepts using your own clear and beginner-friendly language.

4. If the provided finance knowledge does not contain enough information, use your general financial knowledge.

5. The absence of a matching knowledge item does NOT mean that you should refuse to answer.

6. Answer general finance questions normally even when they are not present in the provided knowledge.

7. Never invent financial facts.

8. Never invent numbers, statistics, laws, regulations, tax rates, company information or market information.

9. If you are unsure about a factual claim, clearly communicate the uncertainty instead of making up an answer.

==================================================
CURRENT INFORMATION
==================================================

Some financial information changes frequently.

This includes:

- Current stock prices
- Today's market performance
- Latest company results
- Latest financial news
- Current IPO information
- Current interest rates
- Current tax rules
- Current regulations
- Latest economic data
- Current market capitalization
- Current dividend information

Do NOT pretend that static knowledge is current.

If the question requires current information that is not available through the application's live data sources, explain that the user should verify the information using a current reliable source.

==================================================
CONVERSATION CONTEXT
==================================================

Use the conversation history to understand references such as:

- "it"
- "this"
- "that"
- "the stock"
- "the investment"
- "the previous one"
- "that company"
- "that portfolio"

Example:

User:
What is diversification?

AI:
Diversification means spreading investments...

User:
Why is it important?

The answer should understand that "it" refers to diversification.

==================================================
FINANCIAL SAFETY
==================================================

Never guarantee investment returns.

Never say that an investment will definitely make money.

Never claim that a stock is guaranteed to rise.

Never promise a specific return.

Do not give personalized buy/sell instructions.

Do not tell the user to buy or sell a specific security as a certainty.

Do not assume the user's:

- income
- age
- financial goals
- risk tolerance
- financial situation
- investment horizon

unless the user explicitly provides this information.

Educational information should not be presented as personalized financial advice.

For investment-related questions, explain relevant risks when appropriate.

==================================================
RESPONSE STYLE
==================================================

Answer naturally like a knowledgeable finance mentor.

For simple questions:

- Keep the answer concise.
- Avoid unnecessary explanations.

For complex questions:

- Use headings.
- Use bullet points.
- Use numbered steps.
- Give simple examples when useful.

Avoid unnecessarily technical language.

If a financial term is complicated, explain it in simple language.

==================================================
UNCLEAR QUESTIONS
==================================================

If an important financial detail is missing and answering without it could be misleading, ask a short clarifying question.

Do not make important financial assumptions.

==================================================
INTERNAL IMPLEMENTATION
==================================================

Do not mention:

- Dataset
- Dataset search
- Internal knowledge
- Prompt
- System instructions
- Internal implementation

unless the user specifically asks about how Money Mentor AI works.

Do not say:

"According to the database..."

Instead, answer naturally.

==================================================
DISCLAIMER
==================================================

Money Mentor AI provides educational financial information only.

It is not a substitute for a qualified financial professional and does not provide personalized investment advice.

==================================================
FINAL TASK
==================================================

Answer the user's current question now.
`;

    // ==================================================
    // GEMINI
    // ==================================================

    const aiResult =
      await generateAIResponse(
        prompt
      );

    // ==================================================
    // SUCCESS
    // ==================================================

    if (aiResult.success) {
      return res.status(200).json({
        reply: aiResult.text,

        sources:
          datasetResults.map(
            (item) => ({
              id: item.id,
              question:
                item.question,
              category:
                item.category,
            })
          ),

        fallback: false,
      });
    }

    // ==================================================
    // GEMINI ERROR
    // ==================================================

    const error =
      aiResult.error;

    // ==================================================
    // QUOTA FALLBACK
    // ==================================================

    if (isQuotaError(error)) {
      console.warn(
        "⚠️ Gemini quota/rate limit reached."
      );

      // ------------------------------------------------
      // If dataset has a relevant answer
      // ------------------------------------------------

      if (
        datasetResults.length > 0
      ) {
        const bestMatch =
          datasetResults[0];

        return res.status(200).json({
          reply:
            bestMatch.answer ||
            "I found relevant financial information, but the AI service is temporarily unavailable.",

          sources:
            datasetResults.map(
              (item) => ({
                id: item.id,
                question:
                  item.question,
                category:
                  item.category,
              })
            ),

          fallback: true,
        });
      }

      // ------------------------------------------------
      // No dataset match + Gemini unavailable
      // ------------------------------------------------

      return res.status(503).json({
        reply:
          "Money Mentor AI is temporarily unable to generate a response because the AI service quota has been reached. Please try again later.",

        sources: [],

        fallback: true,
      });
    }

    // ==================================================
    // OTHER GEMINI ERROR
    // ==================================================

    return res.status(500).json({
      reply:
        error?.message ||
        "Unable to connect to Money Mentor AI.",

      sources: [],
    });
  } catch (error) {
    console.error(
      "❌ Gemini Chat Error:",
      error
    );

    return res.status(500).json({
      reply:
        error.message ||
        "Unable to connect to Money Mentor AI.",

      sources: [],
    });
  }
});

// ======================================================
// PORTFOLIO AI ANALYSIS
// ======================================================

router.post(
  "/portfolio-analysis",
  async (req, res) => {
    try {
      const {
        portfolio,
      } = req.body;

      // ==================================================
      // VALIDATE PORTFOLIO
      // ==================================================

      if (
        !portfolio ||
        !Array.isArray(portfolio)
      ) {
        return res.status(400).json({
          message:
            "Portfolio data is required.",
        });
      }

      if (
        portfolio.length === 0
      ) {
        return res.status(400).json({
          message:
            "Your portfolio is empty.",
        });
      }

      // ==================================================
      // PREPARE PORTFOLIO DATA
      // ==================================================

      const portfolioData =
        portfolio.map(
          (stock) => ({
            symbol:
              stock.symbol,

            company:
              stock.company,

            quantity:
              Number(
                stock.quantity || 0
              ),

            buyPrice:
              Number(
                stock.buyPrice || 0
              ),

            currentPrice:
              Number(
                stock.currentPrice || 0
              ),

            investment:
              Number(
                stock.investment || 0
              ),

            currentValue:
              Number(
                stock.currentValue ||
                  0
              ),

            profit:
              Number(
                stock.profit || 0
              ),

            profitPercent:
              Number(
                stock.profitPercent ||
                  0
              ),
          })
        );

      // ==================================================
      // CALCULATE TOTALS
      // ==================================================

      const totalInvestment =
        portfolioData.reduce(
          (sum, stock) =>
            sum +
            stock.investment,
          0
        );

      const currentValue =
        portfolioData.reduce(
          (sum, stock) =>
            sum +
            stock.currentValue,
          0
        );

      const totalProfit =
        portfolioData.reduce(
          (sum, stock) =>
            sum +
            stock.profit,
          0
        );

      const roi =
        totalInvestment > 0
          ? (totalProfit /
              totalInvestment) *
            100
          : 0;

      // ==================================================
      // DATASET SEARCH
      // ==================================================

      const datasetQuery = `
        portfolio diversification
        risk management
        asset allocation
        investment risk
        portfolio management
        stock diversification
        investment strategy
      `
        .replace(/\s+/g, " ")
        .trim();

      const datasetResults =
        searchDataset(
          datasetQuery,
          8
        );

      const datasetContext =
        createDatasetContext(
          datasetResults
        );

      console.log(
        `📊 Portfolio analysis dataset matches: ${datasetResults.length}`
      );

      // ==================================================
      // PORTFOLIO AI PROMPT
      // ==================================================

      const prompt = `
You are Money Mentor AI.

You are an educational personal finance and investment assistant.

Analyze the stock portfolio provided below.

==================================================
PORTFOLIO HOLDINGS
==================================================

${JSON.stringify(
  portfolioData,
  null,
  2
)}

==================================================
CALCULATED PORTFOLIO SUMMARY
==================================================

Total Investment:
₹${totalInvestment.toFixed(2)}

Current Portfolio Value:
₹${currentValue.toFixed(2)}

Total Profit/Loss:
₹${totalProfit.toFixed(2)}

Overall ROI:
${roi.toFixed(2)}%

==================================================
RELEVANT FINANCE KNOWLEDGE
==================================================

${
  datasetContext ||
  "No directly relevant finance knowledge was found."
}

==================================================
ANALYSIS REQUIREMENTS
==================================================

Provide a clear and beginner-friendly portfolio analysis.

Use the following sections:

1. PORTFOLIO OVERVIEW

Explain:

- Total investment
- Current portfolio value
- Overall profit/loss
- Overall ROI

2. STRONG PERFORMERS

Identify holdings with positive performance.

Mention their profit percentage where available.

3. WEAK PERFORMERS

Identify holdings with negative performance.

Mention their loss percentage where available.

4. PORTFOLIO DIVERSIFICATION

Analyze the portfolio based only on the provided holdings.

Discuss:

- Number of holdings
- Concentration
- Whether the portfolio appears diversified
- Obvious concentration risks

Do not claim that the portfolio is fully diversified simply because it contains multiple stocks.

5. RISK ANALYSIS

Discuss visible risks such as:

- Individual-stock risk
- Concentration risk
- Market risk
- Sector concentration if it can reasonably be inferred
- Volatility

Do not invent sectors.

6. EDUCATIONAL SUGGESTIONS

Give general educational suggestions related to:

- Diversification
- Risk management
- Position sizing
- Long-term investing principles

Do not give personalized buy/sell instructions.

7. FINAL SUMMARY

Give a short overall assessment.

==================================================
IMPORTANT RULES
==================================================

- Do not guarantee returns.
- Do not predict exact future prices.
- Do not recommend buying or selling a specific security.
- Do not claim to know the user's financial goals.
- Do not assume their risk tolerance.
- Do not present this as professional financial advice.
- Use only the portfolio information provided.
- Never invent missing information.
- Do not invent sectors or company information.
- If current market information is required, state that it must be verified using a current reliable source.
- Keep the explanation clear and concise.

==================================================
DISCLAIMER
==================================================

This analysis is educational information only.

It is not professional financial advice and is not a recommendation to buy or sell securities.

Generate the portfolio analysis now.
`;

      // ==================================================
      // GEMINI
      // ==================================================

      const aiResult =
        await generateAIResponse(
          prompt
        );

      // ==================================================
      // SUCCESS
      // ==================================================

      if (aiResult.success) {
        return res.status(200).json({
          analysis:
            aiResult.text,

          sources:
            datasetResults.map(
              (item) => ({
                id: item.id,
                question:
                  item.question,
                category:
                  item.category,
              })
            ),

          fallback: false,
        });
      }

      // ==================================================
      // PORTFOLIO QUOTA ERROR
      // ==================================================

      const error =
        aiResult.error;

      if (isQuotaError(error)) {
        return res.status(503).json({
          message:
            "Portfolio AI analysis is temporarily unavailable because the AI service quota has been reached. Please try again later.",

          fallback: true,
        });
      }

      // ==================================================
      // OTHER ERROR
      // ==================================================

      return res.status(500).json({
        message:
          error?.message ||
          "Unable to analyze portfolio.",
      });
    } catch (error) {
      console.error(
        "❌ Portfolio AI Error:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Unable to analyze portfolio.",
      });
    }
  }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;