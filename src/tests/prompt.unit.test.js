import { generateLevelPrompt } from "../prompts/levelPrompt.js";

describe("generateLevelPrompt", () => {
  test("returns a string containing config data", () => {
    const config = {
      level: 2,
      difficulty: "easy",
      reward: 300,
      time_limit: 45,
    };
    const prompt = generateLevelPrompt(config);

    expect(typeof prompt).toBe("string");
    expect(prompt).toContain("easy");
    expect(prompt).toContain("reward");
  });
});
