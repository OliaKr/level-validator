import { calculateConfidenceScore } from "../services/confidenceScore.js";

describe("calculateConfidenceScore", () => {
  test("returns high score for valid easy level", () => {
    const score = calculateConfidenceScore({
      difficulty: "easy",
      reward: 300,
      time_limit: 45,
    });
    expect(score).toBeGreaterThan(0.7);
  });

  test("returns low score for invalid hard level", () => {
    const score = calculateConfidenceScore({
      difficulty: "hard",
      reward: 1000,
      time_limit: 60,
    });
    expect(score).toBeLessThan(0.5);
  });
});
