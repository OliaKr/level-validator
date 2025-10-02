import express from "express";
import Ajv from "ajv";
import schema from "../schemas/levelSchema.js";
import { getLlmReview } from "../services/llmReview.js";
import { generateLevelPrompt } from "../prompts/levelPrompt.js"; // 👈 ייבוא
import { calculateConfidenceScore } from "../services/confidenceScore.js";
import { getClient, isSupported } from "../services/llmProvider.js";

const router = express.Router();
const ajv = new Ajv();
const validate = ajv.compile(schema);

router.post("/", async (req, res, next) => {
  try {
    const config = req.body;
    const selectedModel = config.model || process.env.DEFAULT_MODEL;

    if (!isSupported(selectedModel)) {
      return res.status(400).json({
        error: `Unsupported model '${selectedModel}'`,
      });
    }

    if (!validate(config)) {
      return res.status(400).json({
        schema_validation: "failed",
        errors: validate.errors,
      });
    }
    //Create the prompt
    const prompt = generateLevelPrompt(config);

    // Configure the LLM client
    const client = getClient(selectedModel);

    // Get LLM review
    const llmResult = await getLlmReview(config, client, selectedModel, prompt);

    const confidence = calculateConfidenceScore(config);

    res.status(200).json({
      model_used: selectedModel,
      confidence_score: confidence,
      schema_validation: { valid: true, errors: [] },
      llm_feedback: {
        analysis: llmResult.analysis,
        suggested_actions: llmResult.suggested_actions,
      },
    });
  } catch (err) {
    console.error("LLM review failed:", err);
    next(err);
  }
});

export default router;
