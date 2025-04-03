export const ModelPerplexity = {
  sonarDeepResearch: 'sonar-deep-research',
  sonarReasoningPro: 'sonar-reasoning-pro',
  sonarReasoning: 'sonar-reasoning',
  sonarPro: 'sonar-pro',
  sonar: 'sonar',
  r11776: 'r1-1776',
} as const;

export type ModelPerplexity = (typeof ModelPerplexity)[keyof typeof ModelPerplexity];
