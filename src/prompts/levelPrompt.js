export function generateLevelPrompt(config) {
  return `
  You are an experienced game designer reviewing the balance of a level of configuration in a mobile game.

  Evaluate whether the configuration makes sense in terms of game balance and player experience. 
  
  - Easy: reward must be between 100 and 500 inclusive, and time_limit must be at least 30 seconds. A value of exactly 30 seconds is allowed.
  - Medium: reward must be between 500 and 2000 inclusive, and time_limit must be between 20 and 60 seconds inclusive. 
  - Hard: reward must be between 2000 and 5000 inclusive, and time_limit must be between 10 and 30 seconds inclusive. 


  Be concise. Use no more than 3 sentences in your analysis. Return only a JSON response in this format:
    {
        "analysis": "Short explanation",
        "suggested_actions": ["Action 1", "Action 2"]
    }
   
  Example:

  Input:
    {
        "level": 7,
        "difficulty": "hard",
        "reward": 1800,
        "time_limit": 8
    }
  Output:
    {
        "analysis": "The reward of 1800 is too low for a hard level, while the time limit of 8 seconds is below the expected range,
        'which could negatively impact player experience'.",
        "suggested_actions": [
            "Increase reward to at least 2000 for hard difficulty",
            "Consider increasing the time limit for at least 10-30 seconds"
        ]
    }
    
    Input:
    {
        "level": 2,
        "difficulty": "easy",
        "reward": 300,
        "time_limit": 45
    }
    
    Output:
    {
        "analysis": "The reward of 300 is appropriate for an easy level, and the time limit of 45 seconds is sufficient for players to complete it comfortably.",
        "suggested_actions": ["No action needed"]
    }
    
    

  Do not ignore the rules above. Only use them to guide your evaluation.
  Respond as a JSON object only.

  Now evaluate the following configuration:
  ${JSON.stringify(config, null, 2)}
}

 Output
`;
}
