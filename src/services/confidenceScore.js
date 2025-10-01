// Confidence scoring calculation

export function calculateConfidenceScore(config) {
  let totalRules = 2;
  let passedRules = 0;

  const { difficulty, reward, time_limit } = config;

  if (difficulty === "easy") {
    if (reward >= 100 && reward <= 500) passedRules++;
    if (time_limit >= 30) passedRules++;
  } else if (difficulty === "medium") {
    if (reward >= 500 && reward <= 2000) passedRules++;
    if (time_limit >= 20 && time_limit <= 60) passedRules++;
  } else if (difficulty === "hard") {
    if (reward >= 2000 && reward <= 5000) passedRules++;
    if (time_limit >= 10 && time_limit <= 30) passedRules++;
  }

  const confidence = (passedRules / totalRules).toFixed(2);
  return Number(confidence);
}
