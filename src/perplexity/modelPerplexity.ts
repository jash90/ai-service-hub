export const ModelPerplexity = {
  sonarReasoningPro: 'sonar-reasoning-pro',
  sonarReasoning: 'sonar-reasoning',
  sonarPro: 'sonar-pro',
  sonar: 'sonar',
} as const;

export type ModelPerplexity = (typeof ModelPerplexity)[keyof typeof ModelPerplexity];
