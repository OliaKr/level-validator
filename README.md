## 🎮 Level Validtor

This microservice was built as a professional challenge for an Israeli mobile gaming company.
It validates JSON-based game level configurations using schema validation and LLM-based logical review.

Tech stack: Node.js, AJV, OpenAI API, structured JSON output.

## Few-Shot Prompting

This project uses **few-shot prompting** to guide LLM with structured examples.
By providing examples of well-formed inputs and expected outputs, the model

- Understands domain-specific rules(reward vs. difficulty/time limit)
- Returns only structured JSON responces
- Remains determenistic and aligned with schema

## To install and Run 🚀

1. Clone the repository

```bash
git clone https://github.com/OliaKr/level-validator.git
cd level-validator

```

2. Install the dependencies

```bash
npm install

```

3. Create an .env file and Configue the LLM API Key

```bash
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=3000

```

4. Run the service

```bash
node index.js

```

5. To test the service you can use Postman or run the following command in the terminal

```bash
node test.js

```
