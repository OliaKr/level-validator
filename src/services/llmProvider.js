import OpenAI from "openai";

const supportedModels = new Set([
  "gpt-4-turbo",
  "gpt-4",
  "gpt-4o-mini",
  "mistral-7b",
]);

export function isSupported(model) {
  return supportedModels.has(model);
}

export function getClient(model) {
  if (model.startsWith("mistral")) {
    //Return Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  }
  // Default to OpenAI client
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
