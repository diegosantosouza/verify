import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { metricsHandler } from './shared/config/metrics-default';
import { tracerHandler } from './shared/config/tracer-default';
import { dbClient } from './sms/services/database';
import { retrieveSchema } from './sms/sms.validator';

type Code = { code: string };

const retrieve = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { code } = event.pathParameters as Code;
  try {
    const { Item } = await dbClient.getItem(code);
    if (Item) {
      await dbClient.deleteItem(code);
      return {
        statusCode: 200,
        body: JSON.stringify({
          Item,
        }),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Could not find code',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not retrieve code',
      }),
    };
  }
};

export const get = middy(retrieve)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema: retrieveSchema,
    })
  )
  .use(metricsHandler('verify', 'code'))
  .use(tracerHandler('verify code'))
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer());
