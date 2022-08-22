import { captureLambdaHandler, Tracer } from '@aws-lambda-powertools/tracer';

export const tracerHandler = (serviceName: string) =>
  captureLambdaHandler(new Tracer({ serviceName }));
