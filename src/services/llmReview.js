export async function getLlmReview(config, client, selectedModel, prompt) {
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
    throw new Error("LLM response was not valid JSON");
  }

  return llmResult;
}
