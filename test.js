import axios from "axios";

const testConfig = {
  level: 4,
  difficulty: "easy",
  reward: 300,
  time_limit: 45,
  // You can use another model: "gpt-4-turbo", "gpt-3.5-turbo" or leave empty to use the default model
  model: "gpt-4o-mini",
};

async function testValidator() {
  try {
    const response = await axios.post(
      "http://localhost:3000/validate",
      testConfig,
      {
        headers: {
          "Content-Type": "application/json",
        },
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

testValidator();
