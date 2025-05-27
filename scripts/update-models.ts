import fs from 'fs';
import path from 'path';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function camelCase(str: string): string {
  return str.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
}

function writeModelFile(filePath: string, name: string, models: string[]) {
  const entries = models
    .sort()
    .map(id => `  ${camelCase(id)}: '${id}',`)
    .join('\n');

  const content = `export const ${name} = {\n${entries}\n} as const;\n\nexport type ${name} = (typeof ${name})[keyof typeof ${name}];\n`;
  fs.writeFileSync(path.resolve(filePath), content);
  console.log(`Updated ${filePath}`);
}

 function updateDefaultModel(
   filePath: string,
   typeName: string,
   constantName: string,
   search?: RegExp,
   rawReplacement?: string
 ) {
   const abs = path.resolve(filePath);
   if (!fs.existsSync(abs)) {
     console.warn(`File not found: ${filePath}`);
     return;
   }
   let content = fs.readFileSync(abs, 'utf8');
   const originalContent = content;
   const regex =
     search || new RegExp(`model: ${typeName} = [^,\n)]+`, 'g');
   const replacement =
     rawReplacement || `model: ${typeName} = ${typeName}.${constantName}`;
   content = content.replace(regex, replacement);
   if (content === originalContent) {
     console.warn(`No replacements made in ${filePath} for pattern: ${regex}`);
     return;
  }
   fs.writeFileSync(abs, content);
   console.log(`Updated defaults in ${filePath}`);
 }

async function updateOpenAI(apiKey: string) {
  const client = new OpenAI({ apiKey });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);

  const chat = ids.filter(
    id =>
      id.startsWith('gpt-') ||
      id.startsWith('o1') ||
      id.startsWith('o3') ||
      id.startsWith('chatgpt')
  );
  const embedding = ids.filter(id => id.includes('embedding'));
  const tts = ids.filter(id => id.startsWith('tts-'));
  const vision = chat.filter(
    id => id.includes('vision') || id.includes('gpt-4o') || id.startsWith('o1')
  );

  writeModelFile('src/openAi/ModelOpenAi.ts', 'ModelOpenAi', chat);
  writeModelFile('src/openAi/modelOpenAiEmbedding.ts', 'ModelOpenAiEmbedding', embedding);
  writeModelFile('src/openAi/modelTtsOpenAi.ts', 'ModelTtsOpenAi', tts);
  writeModelFile('src/openAi/ModelOpenAIVision.ts', 'ModelOpenAIVision', vision);

  if (chat.length) {
    updateDefaultModel(
      'src/openAi/OpenAiInstance.ts',
      'ModelOpenAi',
      camelCase(chat[0])
    );
  }
  if (embedding.length) {
    updateDefaultModel(
      'src/openAi/OpenAiInstance.ts',
      'ModelOpenAiEmbedding',
      camelCase(embedding[0])
    );
  }
  if (tts.length) {
    updateDefaultModel(
      'src/openAi/OpenAiInstance.ts',
      'ModelTtsOpenAi',
      camelCase(tts[0])
    );
  }
  if (vision.length) {
    updateDefaultModel(
      'src/openAi/OpenAiInstance.ts',
      'ModelOpenAIVision',
      camelCase(vision[0])
    );
  }
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
  if (ids.length) {
    updateDefaultModel(
      'src/claude/ClaudeInstance.ts',
      'ModelClaude',
      camelCase(ids[0])
    );
  }
}

async function updateDeepSeek(apiKey: string) {
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true,
  });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);
  writeModelFile('src/deepSeek/modelDeepSeek.ts', 'ModelDeepSeek', ids);
  if (ids.length) {
    updateDefaultModel(
      'src/deepSeek/DeepSeekInstance.ts',
      'ModelDeepSeek',
      camelCase(ids[0])
    );
  }
}

async function updateGrok(apiKey: string) {
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
    dangerouslyAllowBrowser: true,
  });
  const list = await client.models.list();
  const ids = list.data.map((m: any) => m.id as string);
  writeModelFile('src/grok/modelGrok.ts', 'ModelGrok', ids);
  if (ids.length) {
    updateDefaultModel(
      'src/grok/GrokInstance.ts',
      'ModelGrok',
      camelCase(ids[0])
    );
    const vision = ids.find(id => id.includes('vision'));
    if (vision) {
      updateDefaultModel(
        'src/grok/GrokInstance.ts',
        'string',
        `ModelGrok.${camelCase(vision)}`,
        /model: string = [^,\n]+/g
      );
    }
  }
}

async function updateGemini(apiKey: string) {
  const res = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
  const ids: string[] = (res.data.models || []).map((m: any) =>
    (m.name as string).replace(/^models\//, '')
  );
  writeModelFile('src/gemini/modelGemini.ts', 'ModelGemini', ids);
  if (ids.length) {
    updateDefaultModel(
      'src/gemini/GeminiInstance.ts',
      'ModelGemini',
      camelCase(ids[0])
    );
  }
}

async function main() {
  console.log('Updating models...');
  if (process.env.OPENAI_KEY) {
    await updateOpenAI(process.env.OPENAI_KEY);
    console.log('OpenAI models updated');
  }
  if (process.env.CLAUDE_KEY) {
    await updateClaude(process.env.CLAUDE_KEY);
    console.log('Claude models updated');
  }
  if (process.env.DEEPSEEK_KEY) {
    await updateDeepSeek(process.env.DEEPSEEK_KEY);
    console.log('DeepSeek models updated');
  }
  if (process.env.GROK_KEY) {
    await updateGrok(process.env.GROK_KEY);
    console.log('Grok models updated');
  }
  if (process.env.GEMINI_KEY) {
    await updateGemini(process.env.GEMINI_KEY);
    console.log('Gemini models updated');
  }
}

main().catch(err => {
  console.error('Failed to update models', err);
  process.exit(1);
});
