import { 
  GlobalInstance, 
  ModelRegistry, 
  AIServiceError,
  OpenAiInstance,
  DeepSeekInstance,
  GeminiInstance 
} from '../src';
import logger from '../src/utils/Logger';
import performanceMonitor from '../src/utils/PerformanceMonitor';
import config from '../src/utils/Config';

// Mock API responses for testing
const mockOpenAIResponse = {
  choices: [{ message: { content: 'Hello! How can I help you today?' } }]
};

const mockEmbeddingResponse = {
  data: [{ embedding: new Array(1536).fill(0.1) }]
};

// Integration tests
describe('AI Service Hub Integration Tests', () => {
  let globalInstance: GlobalInstance;
  let modelRegistry: ModelRegistry;

  beforeAll(() => {
    // Reset performance monitor for clean tests
    performanceMonitor.resetMetrics();
  });

  beforeEach(() => {
    // Initialize with test configuration
    globalInstance = new GlobalInstance({
      openAiKey: process.env.OPENAI_API_KEY || 'test-key',
      deepSeekKey: process.env.DEEPSEEK_API_KEY || 'test-key',
      geminiKey: process.env.GEMINI_API_KEY || 'test-key',
    });

    modelRegistry = ModelRegistry.getInstance();
  });

  describe('Configuration Management', () => {
    it('should load configuration correctly', () => {
      const appConfig = config.get();
      
      expect(appConfig).toBeDefined();
      expect(appConfig.env).toBe('test');
      expect(appConfig.logLevel).toBe('error');
      expect(appConfig.services).toBeDefined();
    });

    it('should detect available services', () => {
      const availableServices = config.getAvailableServices();
      
      expect(Array.isArray(availableServices)).toBe(true);
      // Should include services with API keys or URLs configured
    });

    it('should provide service-specific configuration', () => {
      const openaiConfig = config.getServiceConfig('openai');
      
      expect(openaiConfig).toBeDefined();
      expect(openaiConfig.timeout).toBeDefined();
      expect(openaiConfig.retryAttempts).toBeDefined();
    });
  });

  describe('Performance Monitoring', () => {
    it('should track request metrics', () => {
      const initialMetrics = performanceMonitor.getMetrics();
      const initialCount = initialMetrics.totalRequests;

      const requestId = performanceMonitor.startRequest('test-service', 'test-operation', 'test-model');
      
      expect(requestId).toBeDefined();
      expect(performanceMonitor.getActiveRequestsCount()).toBe(1);

      performanceMonitor.endRequest(requestId, true);
      
      const finalMetrics = performanceMonitor.getMetrics();
      expect(finalMetrics.totalRequests).toBe(initialCount + 1);
      expect(finalMetrics.successfulRequests).toBe(initialMetrics.successfulRequests + 1);
      expect(performanceMonitor.getActiveRequestsCount()).toBe(0);
    });

    it('should track error metrics', () => {
      const initialMetrics = performanceMonitor.getMetrics();
      const initialErrorCount = initialMetrics.failedRequests;

      const requestId = performanceMonitor.startRequest('test-service', 'test-operation', 'test-model');
      const testError = new Error('Test error');
      
      performanceMonitor.endRequest(requestId, false, testError);
      
      const finalMetrics = performanceMonitor.getMetrics();
      expect(finalMetrics.failedRequests).toBe(initialErrorCount + 1);
      expect(finalMetrics.errorsByType['Error']).toBeGreaterThan(0);
    });

    it('should calculate success and error rates', () => {
      performanceMonitor.resetMetrics();
      
      // Simulate some requests
      const req1 = performanceMonitor.startRequest('test', 'chat', 'model1');
      performanceMonitor.endRequest(req1, true);
      
      const req2 = performanceMonitor.startRequest('test', 'chat', 'model1');
      performanceMonitor.endRequest(req2, false, new Error('Test'));
      
      const successRate = performanceMonitor.getSuccessRate();
      const errorRate = performanceMonitor.getErrorRate();
      
      expect(successRate).toBe(50);
      expect(errorRate).toBe(50);
    });

    it('should provide performance summary', () => {
      const summary = performanceMonitor.getSummary();
      
      expect(summary).toBeDefined();
      expect(summary.overview).toBeDefined();
      expect(summary.performance).toBeDefined();
      expect(summary.services).toBeDefined();
      expect(Array.isArray(summary.services)).toBe(true);
    });
  });

  describe('Model Registry', () => {
    it('should correctly map models to services', () => {
      expect(modelRegistry.getServiceForModel('gpt-4o-mini')).toBe('openai');
      expect(modelRegistry.getServiceForModel('deepseek-chat')).toBe('deepseek');
      expect(modelRegistry.getServiceForModel('gemini-1.5-pro')).toBe('gemini');
      expect(modelRegistry.getServiceForModel('unknown-model')).toBe(null);
    });

    it('should validate models correctly', () => {
      expect(modelRegistry.isValidModel('gpt-4o-mini')).toBe(true);
      expect(modelRegistry.isValidModel('unknown-model')).toBe(false);
    });

    it('should return models for services', () => {
      const openaiModels = modelRegistry.getModelsForService('openai');
      const unknownModels = modelRegistry.getModelsForService('unknown-service');
      
      expect(Array.isArray(openaiModels)).toBe(true);
      expect(openaiModels.length).toBeGreaterThan(0);
      expect(openaiModels).toContain('gpt-4o-mini');
      expect(unknownModels).toEqual([]);
    });

    it('should provide comprehensive service and model lists', () => {
      const allServices = modelRegistry.getAllServices();
      const allModels = modelRegistry.getAllModels();
      
      expect(Array.isArray(allServices)).toBe(true);
      expect(Array.isArray(allModels)).toBe(true);
      expect(allServices.length).toBeGreaterThan(0);
      expect(allModels.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should create proper AIServiceError instances', () => {
      const originalError = new Error('Original error message');
      const aiError = new AIServiceError(
        'Service failed',
        'test-service',
        'test-operation',
        originalError
      );

      expect(aiError).toBeInstanceOf(AIServiceError);
      expect(aiError).toBeInstanceOf(Error);
      expect(aiError.message).toBe('Service failed');
      expect(aiError.service).toBe('test-service');
      expect(aiError.operation).toBe('test-operation');
      expect(aiError.originalError).toBe(originalError);
      expect(aiError.name).toBe('AIServiceError');
    });

    it('should handle unknown models gracefully', () => {
      expect(() => {
        globalInstance.chat({
          prompt: 'Hello',
          model: 'unknown-model' as any,
        });
      }).toThrow(AIServiceError);
    });

    it('should handle unconfigured services gracefully', () => {
      expect(() => {
        globalInstance.chat({
          prompt: 'Hello',
          model: 'grok-beta' as any, // Assuming Grok is not configured
        });
      }).toThrow(AIServiceError);
    });
  });

  describe('Service Integration', () => {
    // These tests will only run if actual API keys are provided
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasDeepSeekKey = !!process.env.DEEPSEEK_API_KEY;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    describe.each([
      ['OpenAI', hasOpenAIKey, 'gpt-4o-mini'],
      ['DeepSeek', hasDeepSeekKey, 'deepseek-chat'],
      ['Gemini', hasGeminiKey, 'gemini-1.5-pro'],
    ])('%s Integration', (serviceName, hasKey, model) => {
      const testCondition = hasKey ? it : it.skip;

      testCondition('should handle chat requests', async () => {
        const response = await globalInstance.chat({
          prompt: 'Say "Hello World" and nothing else.',
          model: model as any,
        });

        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
        expect(response!.length).toBeGreaterThan(0);

        // Check performance metrics were updated
        const metrics = performanceMonitor.getMetrics();
        expect(metrics.totalRequests).toBeGreaterThan(0);
      }, 15000);

      testCondition('should handle chat requests with system prompt', async () => {
        const response = await globalInstance.chat({
          prompt: 'What is 2+2?',
          systemPrompt: 'You are a helpful math assistant. Answer briefly.',
          model: model as any,
        });

        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
        expect(response!.toLowerCase()).toContain('4');
      }, 15000);

      // Only test embedding for services that support it
      if (serviceName === 'OpenAI') {
        testCondition('should handle embedding requests', async () => {
          const embedding = await globalInstance.embedding({
            prompt: 'This is a test sentence for embedding.',
            model: 'text-embedding-3-large' as any,
          });

          expect(embedding).toBeDefined();
          expect(Array.isArray(embedding)).toBe(true);
          expect(embedding.length).toBeGreaterThan(0);
          expect(typeof embedding[0]).toBe('number');
        }, 15000);
      }
    });

    it('should track performance across multiple requests', async () => {
      if (!hasOpenAIKey) {
        return; // Skip if no API key
      }

      performanceMonitor.resetMetrics();

      // Make multiple requests
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(
          globalInstance.chat({
            prompt: `Test message ${i + 1}`,
            model: 'gpt-4o-mini' as any,
          })
        );
      }

      await Promise.all(promises);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalRequests).toBe(3);
      expect(metrics.successfulRequests).toBe(3);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);

      const summary = performanceMonitor.getSummary();
      expect(summary.overview.totalRequests).toBe(3);
    }, 30000);
  });

  describe('Logging Integration', () => {
    it('should log service initialization', () => {
      const logSpy = jest.spyOn(logger, 'serviceInit');
      
      new OpenAiInstance('test-key');
      
      expect(logSpy).toHaveBeenCalledWith('openai', true);
      
      logSpy.mockRestore();
    });

    it('should log performance metrics', () => {
      const logSpy = jest.spyOn(logger, 'info');
      
      performanceMonitor.logMetrics();
      
      expect(logSpy).toHaveBeenCalled();
      
      logSpy.mockRestore();
    });
  });

  afterAll(() => {
    // Clean up any resources
    performanceMonitor.resetMetrics();
  });
});