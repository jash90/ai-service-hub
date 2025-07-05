import logger from './Logger';
import config from './Config';

// Performance metrics interface
export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  slowRequests: number;
  errorsByType: Record<string, number>;
  requestsByService: Record<string, number>;
  requestsByModel: Record<string, number>;
  responseTimesByService: Record<string, number[]>;
  lastResetTime: Date;
}

// Individual request metrics
export interface RequestMetrics {
  requestId: string;
  service: string;
  operation: string;
  model: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success?: boolean;
  error?: string;
  userId?: string;
}

// Performance monitoring class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private activeRequests: Map<string, RequestMetrics>;
  private slowRequestThreshold: number;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.activeRequests = new Map();
    this.slowRequestThreshold = config.get().performance.slowRequestThreshold;
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      slowRequests: 0,
      errorsByType: {},
      requestsByService: {},
      requestsByModel: {},
      responseTimesByService: {},
      lastResetTime: new Date(),
    };
  }

  // Start tracking a request
  public startRequest(
    service: string,
    operation: string,
    model: string,
    userId?: string
  ): string {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    const requestMetrics: RequestMetrics = {
      requestId,
      service,
      operation,
      model,
      startTime,
      userId,
    };

    this.activeRequests.set(requestId, requestMetrics);

    // Update request counts
    this.metrics.totalRequests++;
    this.metrics.requestsByService[service] = (this.metrics.requestsByService[service] || 0) + 1;
    this.metrics.requestsByModel[model] = (this.metrics.requestsByModel[model] || 0) + 1;

    logger.debug('Request started', {
      requestId,
      service,
      operation,
      model,
      userId,
    });

    return requestId;
  }

  // End tracking a request
  public endRequest(requestId: string, success: boolean, error?: Error): void {
    const requestMetrics = this.activeRequests.get(requestId);
    if (!requestMetrics) {
      logger.warn('Request not found for ending', { requestId });
      return;
    }

    const endTime = Date.now();
    const duration = endTime - requestMetrics.startTime;

    // Update request metrics
    requestMetrics.endTime = endTime;
    requestMetrics.duration = duration;
    requestMetrics.success = success;
    requestMetrics.error = error?.message;

    // Update global metrics
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
      
      // Track error types
      const errorType = error?.name || 'Unknown';
      this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
    }

    // Update response time metrics
    this.updateResponseTimeMetrics(duration, requestMetrics.service);

    // Check for slow requests
    if (duration > this.slowRequestThreshold) {
      this.metrics.slowRequests++;
      logger.warn('Slow request detected', {
        requestId,
        service: requestMetrics.service,
        operation: requestMetrics.operation,
        model: requestMetrics.model,
        duration,
        threshold: this.slowRequestThreshold,
      });
    }

    // Log API call
    logger.apiCall(
      requestMetrics.service,
      requestMetrics.operation,
      requestMetrics.model,
      duration,
      success,
      error
    );

    // Clean up
    this.activeRequests.delete(requestId);
  }

  // Update response time metrics
  private updateResponseTimeMetrics(duration: number, service: string): void {
    // Update min/max response times
    if (this.metrics.minResponseTime === 0 || duration < this.metrics.minResponseTime) {
      this.metrics.minResponseTime = duration;
    }
    if (duration > this.metrics.maxResponseTime) {
      this.metrics.maxResponseTime = duration;
    }

    // Update average response time
    const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
    this.metrics.averageResponseTime = (totalResponseTime + duration) / this.metrics.totalRequests;

    // Update service-specific response times
    if (!this.metrics.responseTimesByService[service]) {
      this.metrics.responseTimesByService[service] = [];
    }
    this.metrics.responseTimesByService[service].push(duration);

    // Keep only last 100 response times per service to prevent memory issues
    if (this.metrics.responseTimesByService[service].length > 100) {
      this.metrics.responseTimesByService[service].shift();
    }
  }

  // Get current metrics
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get metrics for a specific service
  public getServiceMetrics(service: string): any {
    const responseTimes = this.metrics.responseTimesByService[service] || [];
    const requests = this.metrics.requestsByService[service] || 0;
    
    return {
      totalRequests: requests,
      averageResponseTime: responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0,
      minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      responseTimes: responseTimes.slice(-10), // Last 10 response times
    };
  }

  // Get active requests count
  public getActiveRequestsCount(): number {
    return this.activeRequests.size;
  }

  // Get active requests details
  public getActiveRequests(): RequestMetrics[] {
    return Array.from(this.activeRequests.values());
  }

  // Get success rate
  public getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.successfulRequests / this.metrics.totalRequests) * 100;
  }

  // Get error rate
  public getErrorRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.failedRequests / this.metrics.totalRequests) * 100;
  }

  // Get slow request rate
  public getSlowRequestRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.slowRequests / this.metrics.totalRequests) * 100;
  }

  // Reset metrics
  public resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    logger.info('Performance metrics reset', { service: 'performance' });
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get performance summary
  public getSummary(): any {
    return {
      overview: {
        totalRequests: this.metrics.totalRequests,
        successfulRequests: this.metrics.successfulRequests,
        failedRequests: this.metrics.failedRequests,
        activeRequests: this.getActiveRequestsCount(),
        successRate: this.getSuccessRate(),
        errorRate: this.getErrorRate(),
        slowRequestRate: this.getSlowRequestRate(),
      },
      performance: {
        averageResponseTime: this.metrics.averageResponseTime,
        minResponseTime: this.metrics.minResponseTime,
        maxResponseTime: this.metrics.maxResponseTime,
        slowRequestThreshold: this.slowRequestThreshold,
      },
      services: Object.keys(this.metrics.requestsByService).map(service => ({
        service,
        metrics: this.getServiceMetrics(service),
      })),
      errors: this.metrics.errorsByType,
      models: this.metrics.requestsByModel,
      lastResetTime: this.metrics.lastResetTime,
    };
  }

  // Periodic logging of metrics
  public logMetrics(): void {
    const summary = this.getSummary();
    
    logger.info('Performance metrics summary', {
      service: 'performance',
      type: 'metrics_summary',
      ...summary.overview,
    });

    // Log per-service metrics
    Object.entries(this.metrics.requestsByService).forEach(([service, count]) => {
      const serviceMetrics = this.getServiceMetrics(service);
      logger.info('Service performance metrics', {
        service,
        type: 'service_metrics',
        ...serviceMetrics,
      });
    });
  }
}

// Export singleton instance
export default PerformanceMonitor.getInstance();