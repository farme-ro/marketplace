/**
 * Post-Launch Types
 * 
 * Shared types for all POST-LIVE SUPERPROMPTS
 */

// POST-LIVE 1: Monitoring
export interface HealthMetrics {
  timestamp: Date;
  apiHealth: 'healthy' | 'degraded' | 'unhealthy';
  databaseHealth: 'healthy' | 'degraded' | 'unhealthy';
  errorRate: number;
  responseTime: number;
  activeUsers: number;
  activeOrders: number;
  failedRequests: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface ErrorStats {
  timestamp: Date;
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  criticalErrors: number;
  resolvedErrors: number;
}

export interface SystemStability {
  uptime: number;
  downtime: number;
  availability: number;
  lastIncident?: Date;
  incidents: Array<{
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    resolved: boolean;
  }>;
}

// POST-LIVE 2: Performance
export interface PerformanceMetrics {
  timestamp: Date;
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueryTime: number;
  imageOptimization: {
    totalImages: number;
    optimizedImages: number;
    totalSize: number;
    optimizedSize: number;
  };
  cacheHitRate: number;
  cdnUsage: number;
}

export interface SEOMetrics {
  timestamp: Date;
  indexedPages: number;
  crawlErrors: number;
  mobileFriendly: boolean;
  pageSpeedScore: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

// POST-LIVE 3: Analytics
export interface ConversionMetrics {
  timestamp: Date;
  totalVisitors: number;
  uniqueVisitors: number;
  conversionRate: number;
  orders: number;
  revenue: number;
  averageOrderValue: number;
  cartAbandonmentRate: number;
  registrationRate: number;
}

export interface UserBehaviorMetrics {
  timestamp: Date;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  topReferrers: Array<{
    source: string;
    visits: number;
  }>;
}

export interface FunnelMetrics {
  timestamp: Date;
  funnel: Array<{
    step: string;
    visitors: number;
    dropoff: number;
    conversionRate: number;
  }>;
}

// POST-LIVE 4: Security
export interface SecurityMetrics {
  timestamp: Date;
  failedLoginAttempts: number;
  blockedIPs: number;
  suspiciousActivity: number;
  rateLimitHits: number;
  sslEnabled: boolean;
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
}

// POST-LIVE 5: QA
export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  duration: number;
  message?: string;
  error?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  warnings: number;
  duration: number;
}

