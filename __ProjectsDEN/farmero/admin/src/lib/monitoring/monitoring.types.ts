/**
 * Post-Launch Monitoring Types
 */

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

