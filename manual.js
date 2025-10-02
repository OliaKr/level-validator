import axios from "axios";

const testCases = [
  {
    name: "Balanced Easy-Level setup",
    config: {
      level: 4,
      difficulty: "easy",
      reward: 300,
      time_limit: 45,
      model: "gpt-4o-mini",
    },
  },
  {
    name: "Unbalanced Medium-Level with Low Reward",
    config: {
      level: 14,
      difficulty: "medium",
      reward: 300,
      time_limit: 30,
      model: "gpt-4",
    },
  },
  {
    name: "Unbalanced Hard-Level setup",
    config: {
      level: 20,
      difficulty: "hard",
      reward: 1000,
      time_limit: 60,
      model: "gpt-4-turbo",
    },
  },
];

async function runTests() {
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name} ===`);

    try {
      const response = await axios.post(
        "http://localhost:3000/validate",
        testCase.config,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:");
      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error:");
      if (error.response) {
        console.dir(error.response.data, { depth: null });
      } else {
        console.error(error.message);
      }
    }
  }
}

runTests();
