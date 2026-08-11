const fs = require("fs");
const path = require("path");

// ======================================================
// FINANCE DATASET PATH
// ======================================================

// datasetService.js is expected to be somewhere inside
// the backend project.
//
// We search the most likely locations so the service
// doesn't break because of folder structure.

const possiblePaths = [
  // backend/data/financeDataset.json
  path.join(
    __dirname,
    "../../data/financeDataset.json"
  ),

  // backend/app/data/financeDataset.json
  path.join(
    __dirname,
    "../data/financeDataset.json"
  ),

  // project-root/data/financeDataset.json
  path.join(
    __dirname,
    "../../../data/financeDataset.json"
  ),
];

let datasetPath = null;
let financeDataset = [];

// ======================================================
// LOAD DATASET
// ======================================================

for (const possiblePath of possiblePaths) {
  try {
    if (fs.existsSync(possiblePath)) {
      datasetPath = possiblePath;
      break;
    }
  } catch (error) {
    // Continue checking other paths
  }
}

if (datasetPath) {
  try {
    const data = fs.readFileSync(
      datasetPath,
      "utf-8"
    );

    financeDataset = JSON.parse(data);

    if (!Array.isArray(financeDataset)) {
      throw new Error(
        "Finance dataset must be a JSON array."
      );
    }

    console.log(
      `✅ Finance dataset loaded: ${financeDataset.length} records`
    );

    console.log(
      `📁 Dataset path: ${datasetPath}`
    );
  } catch (error) {
    console.error(
      "❌ Failed to parse finance dataset:",
      error.message
    );
  }
} else {
  console.error(
    "❌ Finance dataset file not found."
  );

  console.error(
    "Checked these locations:"
  );

  possiblePaths.forEach((filePath) => {
    console.error(`   - ${filePath}`);
  });
}

// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// SEARCH DATASET
// ======================================================

function searchDataset(query, limit = 5) {
  const normalizedQuery =
    normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  if (financeDataset.length === 0) {
    console.warn(
      "⚠️ Finance dataset is empty."
    );

    return [];
  }

  const queryWords =
    normalizedQuery.split(" ");

  const results = financeDataset.map(
    (item) => {
      const question =
        normalizeText(item.question);

      const answer =
        normalizeText(item.answer);

      const category =
        normalizeText(item.category);

      const keywords =
        Array.isArray(item.keywords)
          ? item.keywords
              .map(normalizeText)
              .join(" ")
          : "";

      let score = 0;

      // ================================================
      // WORD MATCHING
      // ================================================

      for (const word of queryWords) {
        // Ignore extremely short words
        if (word.length < 2) {
          continue;
        }

        // Question match
        if (question.includes(word)) {
          score += 5;
        }

        // Keyword match
        if (keywords.includes(word)) {
          score += 4;
        }

        // Category match
        if (category.includes(word)) {
          score += 3;
        }

        // Answer match
        if (answer.includes(word)) {
          score += 1;
        }
      }

      // ================================================
      // EXACT PHRASE MATCH
      // ================================================

      if (
        question.includes(
          normalizedQuery
        )
      ) {
        score += 15;
      }

      // ================================================
      // RETURN RESULT
      // ================================================

      return {
        ...item,
        score,
      };
    }
  );

  // ================================================
  // SORT + LIMIT
  // ================================================

  return results
    .filter(
      (item) => item.score > 0
    )
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, limit);
}

// ======================================================
// CREATE GEMINI DATASET CONTEXT
// ======================================================

function createDatasetContext(results) {
  if (
    !results ||
    results.length === 0
  ) {
    return "";
  }

  return results
    .map(
      (item, index) =>
        `Knowledge ${index + 1}:
Question: ${item.question}
Answer: ${item.answer}
Category: ${item.category}`
    )
    .join("\n\n");
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  searchDataset,
  createDatasetContext,
};