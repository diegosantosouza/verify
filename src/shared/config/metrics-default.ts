import { logMetrics, Metrics } from '@aws-lambda-powertools/metrics';

const defaultDimensions = { environment: process.env.STAGE as string };
export const metricsHandler = (namespace: string, serviceName: string) =>
  logMetrics(new Metrics({ namespace, serviceName, defaultDimensions }));
