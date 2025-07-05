import { GlobalInstance, ModelRegistry, AIServiceError } from '../src';

// Simple test framework
class TestRunner {
  private tests: Array<() => void> = [];
  private passedTests = 0;
  private failedTests = 0;

  describe(name: string, fn: () => void) {
    console.log(`\n📋 ${name}`);
    fn();
  }

  it(name: string, fn: () => void) {
    this.tests.push(() => {
      try {
        fn();
        console.log(`  ✅ ${name}`);
        this.passedTests++;
      } catch (error) {
        console.log(`  ❌ ${name}`);
        console.log(`     Error: ${error instanceof Error ? error.message : String(error)}`);
        this.failedTests++;
      }
    });
  }

  async run() {
    console.log('🧪 Running AI Service Hub Tests\n');
    
    for (const test of this.tests) {
      test();
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📈 Total: ${this.passedTests + this.failedTests}`);

    if (this.failedTests > 0) {
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    }
  }
}

// Simple assertion functions
function assert(condition: boolean, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertOk(value: any, message = 'Expected truthy value') {
  if (!value) {
    throw new Error(message);
  }
}

function assertThrows(fn: () => void, errorType?: any, message?: string) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (error) {
    if (errorType && !(error instanceof errorType)) {
      const errorName = error instanceof Error ? error.constructor.name : 'Unknown';
      throw new Error(message || `Expected ${errorType.name}, got ${errorName}`);
    }
  }
}

// Test suite
const test = new TestRunner();

test.describe('ModelRegistry', () => {
  const modelRegistry = ModelRegistry.getInstance();

  test.it('should return correct service for OpenAI models', () => {
    const service = modelRegistry.getServiceForModel('gpt-4o-mini');
    assertEqual(service, 'openai');
  });

  test.it('should return correct service for DeepSeek models', () => {
    const service = modelRegistry.getServiceForModel('deepseek-chat');
    assertEqual(service, 'deepseek');
  });

  test.it('should return null for unknown models', () => {
    const service = modelRegistry.getServiceForModel('unknown-model');
    assertEqual(service, null);
  });

  test.it('should validate known models', () => {
    const isValid = modelRegistry.isValidModel('gpt-4o-mini');
    assertEqual(isValid, true);
  });

  test.it('should not validate unknown models', () => {
    const isValid = modelRegistry.isValidModel('unknown-model');
    assertEqual(isValid, false);
  });

  test.it('should return models for a service', () => {
    const models = modelRegistry.getModelsForService('openai');
    assertOk(models.length > 0);
    assertOk(models.includes('gpt-4o-mini'));
  });
});

test.describe('GlobalInstance', () => {
  const globalInstance = new GlobalInstance({
    openAiKey: 'test-openai-key',
    deepSeekKey: 'test-deepseek-key',
    geminiKey: 'test-gemini-key',
  });

  test.it('should throw AIServiceError for unsupported models', () => {
    assertThrows(() => {
      globalInstance.chat({
        prompt: 'Hello',
        model: 'unknown-model' as any,
      });
    }, AIServiceError);
  });

  test.it('should throw AIServiceError for unconfigured services', () => {
    assertThrows(() => {
      globalInstance.chat({
        prompt: 'Hello',
        model: 'grok-beta' as any, // Grok is not configured in our test instance
      });
    }, AIServiceError);
  });
});

test.describe('AIServiceError', () => {
  test.it('should create proper AIServiceError instances', () => {
    const originalError = new Error('Original error');
    const aiError = new AIServiceError(
      'Test error',
      'openai',
      'chat',
      originalError
    );

    assertEqual(aiError.message, 'Test error');
    assertEqual(aiError.service, 'openai');
    assertEqual(aiError.operation, 'chat');
    assertEqual(aiError.originalError, originalError);
    assertEqual(aiError.name, 'AIServiceError');
  });
});

// Run the tests
test.run().catch(console.error);
