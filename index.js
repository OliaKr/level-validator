import express from "express";
import Ajv from "ajv";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DEFAULT_MODEL = process.env.OPENAI_MODEL;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = {
  type: "object",
  properties: {
    level: { type: "number" },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    reward: { type: "number" },
    time_limit: { type: "number" },
    model: { type: "string" },
  },
  required: ["level", "difficulty", "reward", "time_limit"],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

// Confidence scoring calculation

function calculateConfidenceScore(config) {
  let totalRules = 2;
  let passedRules = 0;

  const { difficulty, reward, time_limit } = config;

  if (difficulty === "easy") {
    if (reward >= 100 && reward <= 500) passedRules++;
    if (time_limit >= 30) passedRules++;
  } else if (difficulty === "medium") {
    if (reward >= 500 && reward <= 2000) passedRules++;
    if (time_limit >= 20 && time_limit <= 60) passedRules++;
  } else if (difficulty === "hard") {
    if (reward >= 2000 && reward <= 5000) passedRules++;
    if (time_limit >= 10 && time_limit <= 30) passedRules++;
  }

  const confidence = (passedRules / totalRules).toFixed(2);
  return Number(confidence);
}

app.post("/validate", async (req, res) => {
  const config = req.body;

  const modelFromRequest = config.model;
  const selectedModel = modelFromRequest || DEFAULT_MODEL;

  const supportedModels = new Set(["gpt-4-turbo", "gpt-4", "gpt-4o-mini"]);

  //Schema validation

  if (!supportedModels.has(selectedModel)) {
    return res.status(400).json({
      error: `Unsupported model '${selectedModel}'. Supported models: ${Array.from(
        supportedModels
      ).join(", ")}`,
    });
  }

  const isValidSchema = validate(config);
  if (!isValidSchema) {
    return res.status(400).json({
      schema_validation: "failed",
      errors: validate.errors,
    });
  }

  const confidenceScore = calculateConfidenceScore(config);

  const prompt = `
  You are an experienced game designer reviewing the balance of a level of configuration in a mobile game.

  Evaluate whether the configuration makes sense in terms of game balance and player experience. 
  
  - Easy: reward must be between 100 and 500 inclusive, and time_limit must be at least 30 seconds. A value of exactly 30 seconds is allowed.
  - Medium: reward must be between 500 and 2000 inclusive, and time_limit must be between 20 and 60 seconds inclusive. 
  - Hard: reward must be between 2000 and 5000 inclusive, and time_limit must be between 10 and 30 seconds inclusive. 


  Be concise. Use no more than 3 sentences in your analysis. Return only a JSON response in this format:
    {
        "analysis": "Short explanation",
        "suggested_actions": ["Action 1", "Action 2"]
    }
   
  Example:

  Input:
    {
        "level": 7,
        "difficulty": "hard",
        "reward": 1800,
        "time_limit": 8
    }
  Output:
    {
        "analysis": "The reward of 1800 is too low for a hard level, while the time limit of 8 seconds is below the expected range,
        'which could negatively impact player experience'.",
        "suggested_actions": [
            "Increase reward to at least 2000 for hard difficulty",
            "Consider increasing the time limit for at least 10-30 seconds"
        ]
    }
    
    Input:
    {
        "level": 2,
        "difficulty": "easy",
        "reward": 300,
        "time_limit": 45
    }
    
    Output:
    {
        "analysis": "The reward of 300 is appropriate for an easy level, and the time limit of 45 seconds is sufficient for players to complete it comfortably.",
        "suggested_actions": ["No action needed"]
    }
    
    

  Do not ignore the rules above. Only use them to guide your evaluation.
  Respond as a JSON object only.

  Now evaluate the following configuration:
  ${JSON.stringify(config, null, 2)}

  Output
  `;

  // LLM review
  try {
    const response = await client.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content:
            "You are a rule-based game configuration reviewer. Return a valid JSON only. Never use subjective judgment. Follow numeric rules as hard constraints ",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;

    let llmResult;
    try {
      llmResult = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse LLM response:", content);
      return res.status(500).json({
        error: "LLM response was not valid JSON",
        raw: content,
      });
    }

    return res.status(200).json({
      model_used: selectedModel,
      confidence_score: confidenceScore,
      schema_validation: {
        valid: true,
        errors: [],
      },
      llm_feedback: {
        analysis: llmResult.analysis,
        suggested_actions: llmResult.suggested_actions,
      },
    });
  } catch (err) {
    console.error("LLM review failed:", err);
    return res.status(500).json({ error: "LLM review failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Level Validator is running on port ${PORT}`);
});
