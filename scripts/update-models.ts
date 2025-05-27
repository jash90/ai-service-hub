import fs from 'fs';
import path from 'path';
import axios from 'axios';
import OpenAI from 'openai';

function camelCase(str: string): string {
  return str
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}

function writeModelFile(filePath: string, name: string, models: string[]) {
  const entries = models
    .sort()
    .map((id) => `  ${camelCase(id)}: '${id}',`)
    .join('\n');

  const content = `export const ${name} = {\n${entries}\n} as const;\n\nexport type ${name} = (typeof ${name})[keyof typeof ${name}];\n`;
  fs.writeFileSync(path.resolve(filePath), content);
  console.log(`Updated ${filePath}`);
}

async function updateOpenAI(apiKey: string) {
  const client = new OpenAI({ apiKey });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);

  const chat = ids.filter((id) =>
    id.startsWith('gpt-') || id.startsWith('o1') || id.startsWith('o3') || id.startsWith('chatgpt')
  );
  const embedding = ids.filter((id) => id.includes('embedding'));
  const tts = ids.filter((id) => id.startsWith('tts-'));
  const vision = chat.filter((id) => id.includes('vision') || id.includes('gpt-4o') || id.startsWith('o1'));

  writeModelFile('src/openAi/ModelOpenAi.ts', 'ModelOpenAi', chat);
  writeModelFile('src/openAi/modelOpenAiEmbedding.ts', 'ModelOpenAiEmbedding', embedding);
  writeModelFile('src/openAi/modelTtsOpenAi.ts', 'ModelTtsOpenAi', tts);
  writeModelFile('src/openAi/ModelOpenAIVision.ts', 'ModelOpenAIVision', vision);
}

async function updateClaude(apiKey: string) {
  const res = await axios.get('https://api.anthropic.com/v1/models', {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });
  const ids: string[] = (res.data.data || []).map((m: any) => m.id || m.name);
  writeModelFile('src/claude/ModelClaude.ts', 'ModelClaude', ids);
}

async function updateDeepSeek(apiKey: string) {
  const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com', dangerouslyAllowBrowser: true });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);
  writeModelFile('src/deepSeek/modelDeepSeek.ts', 'ModelDeepSeek', ids);
}

async function updatePerplexity(apiKey: string) {
  const client = new OpenAI({ apiKey, baseURL: 'https://api.perplexity.ai', dangerouslyAllowBrowser: true });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);
  writeModelFile('src/perplexity/modelPerplexity.ts', 'ModelPerplexity', ids);
}

async function updateGrok(apiKey: string) {
  const client = new OpenAI({ apiKey, baseURL: 'https://api.x.ai/v1', dangerouslyAllowBrowser: true });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);
  writeModelFile('src/grok/modelGrok.ts', 'ModelGrok', ids);
}

async function updateGemini(apiKey: string) {
  const res = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
  const ids: string[] = (res.data.models || []).map((m: any) => (m.name as string).replace(/^models\//, ''));
  writeModelFile('src/gemini/modelGemini.ts', 'ModelGemini', ids);
}

async function main() {
  if (process.env.OPENAI_API_KEY) {
    await updateOpenAI(process.env.OPENAI_API_KEY);
  }
  if (process.env.CLAUDE_API_KEY) {
    await updateClaude(process.env.CLAUDE_API_KEY);
  }
  if (process.env.DEEPSEEK_API_KEY) {
    await updateDeepSeek(process.env.DEEPSEEK_API_KEY);
  }
  if (process.env.PERPLEXITY_API_KEY) {
    await updatePerplexity(process.env.PERPLEXITY_API_KEY);
  }
  if (process.env.GROK_API_KEY) {
    await updateGrok(process.env.GROK_API_KEY);
  }
  if (process.env.GEMINI_API_KEY) {
    await updateGemini(process.env.GEMINI_API_KEY);
  }
}

main().catch((err) => {
  console.error('Failed to update models', err);
  process.exit(1);
});
