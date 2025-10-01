import express from "express";
import OpenAI from "openai";
import Ajv from "ajv";
import schema from "./src/schemas/levelSchema.js";
import { getLlmReview } from "./src/services/llmReview.js";
import { generateLevelPrompt } from "./src/prompts/levelPrompt.js";
import { calculateConfidenceScore } from "./src/services/confidenceScore.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DEFAULT_MODEL = process.env.OPENAI_MODEL;

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ajv = new Ajv();
const validate = ajv.compile(schema);

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
  const prompt = generateLevelPrompt(config);

  try {
    const llmResult = await getLlmReview(config, client, selectedModel, prompt);

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
