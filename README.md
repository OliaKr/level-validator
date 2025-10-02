# Level Validator

Level Validator is a lightweight Node.js microservice for validating JSON-based game level configurations
using AJV schema and LLM-powered logical review.

---

## Overview

Level Validator combines:

- **Schema validation (AJV)** – ensures structural correctness of level configs
- **LLM-based review (OpenAI)** – provides logical and design feedback
- **Configurable model selection** – supports `gpt-4-turbo`, `gpt-4`, `gpt-4o-mini`
- **Confidence scoring** – shows how well the level configuration fits
  expected balance rules
- **Responsive dashboard** - optional web UI for running validations interactively.

The project follows a clean modular structure with routes, services, prompts, schemas, tests and can serve as a
**starter template for LLM-enabled validation services**.

**Tech stack**: Node.js, AJV, OpenAI API, Docker, Jest, Supertest.

## Few-Shot Prompting

This project uses **few-shot prompting** to guide LLM with structured examples.
By providing examples of well-formed inputs and expected outputs, the model

- Understands domain-specific rules (reward vs. difficulty/time limit)
- Returns only structured JSON responses
- Remains deterministic and aligned with schema

## Setup Instructions

By default, both the API and the dashboard run on **http://localhost:3000**.

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

4. **Start the service (optional)**

```bash
node app.js

```

### Option 2 : Run with Docker

1. **Build the Docker image**

```bash
docker build -t level-validator .

```

2. **Run the container with your `.env` file**

```bash
docker run -p 3000:3000 --env-file .env level-validator

```

## Access the Dashboard

Once the service is runnong(locally or via Docker), open

```bash
http://localhost:3000

```

![alt text](https://github.com/OliaKr/level-validator/blob/main/src/assests/dashboard-main-view.JPG)

## Testing

Includes unit tests and end-to-end tests using Jest + Supertest

Run all tests:

```bash
npm test

```

## Example Inputs & Outputs

1. **Balanced Easy-Level setup** (Using gpt-4o-mini)
   A properly configured easy-level input, used to confirm that the model recognizes well-balanced cases.

   Input

   ```json
   {
     "level": 4,
     "difficulty": "easy",
     "reward": 300,
     "time_limit": 45,
     "model": "gpt-4o-mini"
   }
   ```

   Output

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

2. **Unbalanced Hard-Level setup** (Using gpt-4-turbo)
   A hard-level configuration with low reward and high time limit for this difficulty.

   Input

   ```json
   {
     "level": 20,
     "difficulty": "hard",
     "reward": 1000,
     "time_limit": 60,
     "model": "gpt-4-turbo"
   }
   ```

   Output

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

3. **Unbalanced Reward Configuration** (Using gpt-4)
   A medium-level configuration with low reward and acceptable time-limit.

   Input

   ```json
   {
     "level": 14,
     "difficulty": "medium",
     "reward": 300,
     "time_limit": 30,
     "model": "gpt-4"
   }
   ```

   Output

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

   ![alt text](https://github.com/OliaKr/level-validator/blob/main/src/assests/dashboard-results.JPG)
   ![alt text](https://github.com/OliaKr/level-validator/blob/main/src/assests/validation-results-mobile.JPG)
