const test = require('node:test');
const assert = require('node:assert/strict');
const GlobalInstance = require('../src/global/GlobalInstance').default;
const { ModelOpenAi } = require('../src/openAi/ModelOpenAi');
const { ModelClaude } = require('../src/claude/ModelClaude');
const { ModelDeepSeek } = require('../src/deepSeek/ModelDeepSeek');
const { ModelPerplexity } = require('../src/perplexity/ModelPerplexity');
const { ModelGrok } = require('../src/grok/modelGrok');
const { ModelGemini } = require('../src/gemini/ModelGemini');
require('dotenv').config();

const instance = new GlobalInstance({
  openAiKey: process.env.OPENAI_KEY || '',
  claudeKey: process.env.CLAUDE_KEY || '',
  grokKey: process.env.GROK_KEY || '',
  geminiKey: process.env.GEMINI_KEY || '',
  deepSeekKey: process.env.DEEPSEEK_KEY || '',
  perplexityKey: process.env.PERPLEXITY_KEY || '',
  ollamaUrl: process.env.OLLAMA_URL || '',
  lmstudioUrl: process.env.LMSTUDIO_URL || '',
});

async function checkModels(models, provider) {
  for (const model of Object.values(models)) {
    console.log(`Checking ${provider} model ${model}`);
    const response = await instance.chat({ prompt: 'ping', model });
    assert.ok(response, `${provider} model ${model} returned no response`);
  }
}

test('OpenAI models respond', { timeout: 300000 }, async t => {
  if (!process.env.OPENAI_KEY) return t.skip('OPENAI_KEY not provided');
  await checkModels(ModelOpenAi, 'OpenAI');
});

test('Claude models respond', { timeout: 300000 }, async t => {
  if (!process.env.CLAUDE_KEY) return t.skip('CLAUDE_KEY not provided');
  await checkModels(ModelClaude, 'Claude');
});

test('DeepSeek models respond', { timeout: 300000 }, async t => {
  if (!process.env.DEEPSEEK_KEY) return t.skip('DEEPSEEK_KEY not provided');
  await checkModels(ModelDeepSeek, 'DeepSeek');
});

test('Perplexity models respond', { timeout: 300000 }, async t => {
  if (!process.env.PERPLEXITY_KEY) return t.skip('PERPLEXITY_KEY not provided');
  await checkModels(ModelPerplexity, 'Perplexity');
});

test('Grok models respond', { timeout: 300000 }, async t => {
  if (!process.env.GROK_KEY) return t.skip('GROK_KEY not provided');
  await checkModels(ModelGrok, 'Grok');
});

test('Gemini models respond', { timeout: 300000 }, async t => {
  if (!process.env.GEMINI_KEY) return t.skip('GEMINI_KEY not provided');
  await checkModels(ModelGemini, 'Gemini');
});
