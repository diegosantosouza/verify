import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { retrieveSchema } from '../sms.validator';
import { dbClient } from './database';

const retrieve = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { code } = event.pathParameters as { code: string };
  try {
    console.log(code);
    const item = await dbClient.getItem(code);
    if (item) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          item,
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
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpHeaderNormalizer());
