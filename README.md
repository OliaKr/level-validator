# Level Validator

This microservice was built as a professional challenge for an Israeli mobile gaming company.
It validates JSON-based game level configurations using schema validation and LLM-based logical review.

Supports flexible model switching between OpenAI models. You can specify the model (`gpt-4-turbo`, `gpt-4`, `gpt-4o-mini`) directly in the request body. If no model is provided, it will automatically fall back to the default model defined in the .env file .

Each response also includes a confidence score between 0 and 1, indicating how well the configuration matches the expected rules.

**Tech stack**: Node.js, AJV, OpenAI API, structured JSON output.

## Few-Shot Prompting

This project uses **few-shot prompting** to guide LLM with structured examples.
By providing examples of well-formed inputs and expected outputs, the model

- Understands domain-specific rules (reward vs. difficulty/time limit)
- Returns only structured JSON responses
- Remains deterministic and aligned with schema

## Setup Instructions

### Option 1 : Run locally (manual setup)

1. **Clone the repository**

```bash
git clone https://github.com/OliaKr/level-validator.git
cd level-validator

```

2. **Install the dependencies**

```bash
npm install

```

3. **Create an `.env` file and configure your LLM API Key**

```bash
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=3000

```

4. **Run the test script (optional)**

```bash
node index.js

```

### Option 2 : Run using Docker

1. **Build the Docker image**

```bash
docker build -t level-validator .

```

2. **Run the container with your `.env` file**

```bash
docker run -p 3000:3000 --env-file .env level-validator

```

3. **Test the running service**

Run the test script to test multiple configurations at once:

```bash
node test.js

```

Or use Postman:

```bash
POST http://localhost:3000/validate

```

## Test Examples & Outputs

To ensure both schema and logic are validated correctly, here are some examples of representative schenarios:

1. **Balanced Easy-Level setup** (Using gpt-4o-mini)
   A properly configured easy-level input, used to confirm that the model recognizes well-balanced cases.

   ```json
   {
     "level": 4,
     "difficulty": "easy",
     "reward": 300,
     "time_limit": 45,
     "model": "gpt-4o-mini"
   }
   ```

   ```json
   {
     "model_used": "gpt-4o-mini",
     "confidence_score": 1,
     "schema_validation": {
       "valid": true,
       "errors": []
     },
     "llm_feedback": {
       "analysis": "The reward of 300 is appropriate for an easy level, and the time limit of 45 seconds is sufficient for players to complete it comfortably.",
       "suggested_actions": ["No action needed"]
     }
   }
   ```

2. **UnBalanced Easy-Level setup** (Using gpt-4-turbo)
   A hard-level configuration with low reward and high time limit for this difficulty.

   ```json
   {
     "level": 20,
     "difficulty": "hard",
     "reward": 1000,
     "time_limit": 60,
     "model": "gpt-4-turbo"
   }
   ```

   ```json
   {
     "model_used": "gpt-4-turbo",
     "confidence_score": 0,
     "schema_validation": {
       "valid": true,
       "errors": []
     },
     "llm_feedback": {
       "analysis": "The reward of 1000 is too low for a hard level, and the time limit of 60 seconds exceeds the maximum allowed for this difficulty, which could affect game balance.",
       "suggested_actions": [
         "Increase reward to at least 2000 for hard difficulty",
         "Reduce the time limit to be within 10-30 seconds"
       ]
     }
   }
   ```

3. ## Unbalanced Reward Configuration

   A medium-level configuration with low reward and acceptable time-limit. (Using gpt-4)

   ```json
   {
     "level": 14,
     "difficulty": "medium",
     "reward": 300,
     "time_limit": 30,
     "model": "gpt-4"
   }
   ```

   ```json
   {
     "model_used": "gpt-4",
     "confidence_score": 0.5,
     "schema_validation": {
       "valid": true,
       "errors": []
     },
     "llm_feedback": {
       "analysis": "The reward of 300 is too low for a medium level, and the time limit of 30 seconds is within the expected range.",
       "suggested_actions": [
         "Increase the reward to at least 500 for a medium difficulty"
       ]
     }
   }
   ```
