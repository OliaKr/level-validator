import axios from "axios";

const testConfig = {
  level: 10,
  difficulty: "medium",
  reward: 3500,
  time_limit: 15,
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
