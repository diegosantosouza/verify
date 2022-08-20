import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { createSchema } from '../sms.validator';
import AliasId from './aliasId';
import { dbClient } from './database';
import { SmsClient } from './sns-sms-config';

type Phone = { phone: string };

const send: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { phone } = event.body as unknown as Phone;
  const code = await AliasId.generate();
  try {
    await Promise.all([
      await SmsClient.sendSms(phone, `Your code is ${code}`),
      await dbClient.putItem({ code, attribute: phone }),
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'success',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not create code',
      }),
    };
  }
};

export const sender = middy(send)
  .use(jsonBodyParser())
  .use(
    validator({
      inputSchema: createSchema,
    })
  )
  .use(httpErrorHandler())
  .use(httpEventNormalizer());
