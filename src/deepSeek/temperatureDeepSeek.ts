export const TemperatureDeepSeek = {
  CodingMath: 0.0,
  DataCleaning: 1.0,
  GeneralConversation: 1.3,
  Translation: 1.3,
  CreativeWriting: 1.5,
} as const;

export type TemperatureDeepSeek = (typeof TemperatureDeepSeek)[keyof typeof TemperatureDeepSeek];
