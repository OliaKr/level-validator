const schema = {
  type: "object",
  properties: {
    level: { type: "number" },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    reward: { type: "number" },
    time_limit: { type: "number" },
    model: { type: "string" },
  },
  required: ["level", "difficulty", "reward", "time_limit", "model"],
  additionalProperties: false,
};

export default schema;
