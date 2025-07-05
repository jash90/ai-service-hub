import dotenv from 'dotenv';
import path from 'path';
import logger from './Logger';

// Load environment variables
dotenv.config();

// Configuration interface
export interface ServiceConfig {
  openai?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  deepseek?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  gemini?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  claude?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  grok?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  perplexity?: {
    apiKey?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  ollama?: {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  lmstudio?: {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  qdrant?: {
    url?: string;
    apiKey?: string;
    timeout?: number;
    retryAttempts?: number;
  };
}

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  logLevel: 'error' | 'warn' | 'info' | 'http' | 'debug';
  port: number;
  services: ServiceConfig;
  performance: {
    enableMetrics: boolean;
    slowRequestThreshold: number;
    cacheEnabled: boolean;
    cacheTtl: number;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  monitoring: {
    enabled: boolean;
    metricsPort: number;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  env: (process.env.NODE_ENV as AppConfig['env']) || 'development',
  logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) || 'info',
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.OPENAI_RETRY_ATTEMPTS || '3', 10),
    },
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      timeout: parseInt(process.env.DEEPSEEK_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.DEEPSEEK_RETRY_ATTEMPTS || '3', 10),
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL,
      timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.GEMINI_RETRY_ATTEMPTS || '3', 10),
    },
    claude: {
      apiKey: process.env.CLAUDE_API_KEY,
      baseUrl: process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com',
      timeout: parseInt(process.env.CLAUDE_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.CLAUDE_RETRY_ATTEMPTS || '3', 10),
    },
    grok: {
      apiKey: process.env.GROK_API_KEY,
      baseUrl: process.env.GROK_BASE_URL || 'https://api.x.ai/v1',
      timeout: parseInt(process.env.GROK_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.GROK_RETRY_ATTEMPTS || '3', 10),
    },
    perplexity: {
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseUrl: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
      timeout: parseInt(process.env.PERPLEXITY_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.PERPLEXITY_RETRY_ATTEMPTS || '3', 10),
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      timeout: parseInt(process.env.OLLAMA_TIMEOUT || '60000', 10),
      retryAttempts: parseInt(process.env.OLLAMA_RETRY_ATTEMPTS || '3', 10),
    },
    lmstudio: {
      baseUrl: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234',
      timeout: parseInt(process.env.LMSTUDIO_TIMEOUT || '60000', 10),
      retryAttempts: parseInt(process.env.LMSTUDIO_RETRY_ATTEMPTS || '3', 10),
    },
    qdrant: {
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY,
      timeout: parseInt(process.env.QDRANT_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.QDRANT_RETRY_ATTEMPTS || '3', 10),
    },
  },
  performance: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    slowRequestThreshold: parseInt(process.env.SLOW_REQUEST_THRESHOLD || '5000', 10),
    cacheEnabled: process.env.CACHE_ENABLED === 'true',
    cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
  },
};

// Configuration validation
class ConfigValidator {
  static validate(config: AppConfig): void {
    const errors: string[] = [];

    // Validate port
    if (config.port < 1 || config.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }

    // Validate environment
    if (!['development', 'production', 'test'].includes(config.env)) {
      errors.push('Environment must be development, production, or test');
    }

    // Validate log level
    if (!['error', 'warn', 'info', 'http', 'debug'].includes(config.logLevel)) {
      errors.push('Log level must be error, warn, info, http, or debug');
    }

    // Validate performance settings
    if (config.performance.slowRequestThreshold < 0) {
      errors.push('Slow request threshold must be positive');
    }

    if (config.performance.cacheTtl < 0) {
      errors.push('Cache TTL must be positive');
    }

    // Validate rate limiting
    if (config.rateLimit.enabled) {
      if (config.rateLimit.windowMs < 1000) {
        errors.push('Rate limit window must be at least 1000ms');
      }
      if (config.rateLimit.maxRequests < 1) {
        errors.push('Rate limit max requests must be at least 1');
      }
    }

    // Validate monitoring
    if (config.monitoring.enabled && (config.monitoring.metricsPort < 1 || config.monitoring.metricsPort > 65535)) {
      errors.push('Metrics port must be between 1 and 65535');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
}

// Configuration manager
export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = defaultConfig;
    this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    try {
      // Load from environment file if exists
      const envPath = path.join(process.cwd(), '.env');
      dotenv.config({ path: envPath });

      // Validate configuration
      ConfigValidator.validate(this.config);

      logger.info('Configuration loaded successfully', {
        service: 'config',
        env: this.config.env,
        logLevel: this.config.logLevel,
      });
    } catch (error) {
      logger.error('Failed to load configuration', { service: 'config' }, error as Error);
      throw error;
    }
  }

  public get(): AppConfig {
    return this.config;
  }

  public getServiceConfig(service: keyof ServiceConfig): any {
    return this.config.services[service];
  }

  public isProduction(): boolean {
    return this.config.env === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.env === 'development';
  }

  public isTest(): boolean {
    return this.config.env === 'test';
  }

  public getAvailableServices(): string[] {
    const services: string[] = [];
    
    Object.entries(this.config.services).forEach(([service, config]) => {
      if (service === 'ollama' || service === 'lmstudio' || service === 'qdrant') {
        // These services only need baseUrl/url
        if (config?.baseUrl || config?.url) {
          services.push(service);
        }
      } else {
        // API key-based services
        if (config?.apiKey) {
          services.push(service);
        }
      }
    });

    return services;
  }
}

// Export default instance
export default ConfigManager.getInstance();