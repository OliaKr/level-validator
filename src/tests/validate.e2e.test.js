import request from "supertest";
import app from "../app.js";

describe("POST /validate – valid easy level", () => {
  it("should return 200 and valid schema", async () => {
    const response = await request(app)
      .post("/validate")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        level: 2,
        difficulty: "easy",
        reward: 300,
        time_limit: 45,
        model: "gpt-4o-mini",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.schema_validation.valid).toBe(true);
  });
});
