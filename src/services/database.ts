import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

import type { CreateVerification } from '../interfaces/create-verification';

class DynamoDbClient {
  private database = new DynamoDBClient({ region: process.env.AWS_REGION });

  private dayInMilliseconds = 86400000;

  private expireInSeconds = (Date.now() + this.dayInMilliseconds) / 1000;

  public async putItem(params: CreateVerification): Promise<any> {
    const data = {
      TableName: process.env.VERIFY_TABLE,
      Item: {
        code: { S: params.code },
        attribute: { S: params.attribute },
        expires_at: { N: `${this.expireInSeconds}` },
      },
    };
    return this.database.send(new PutItemCommand(data));
  }

  public async getItem(code: string): Promise<any> {
    const data = {
      TableName: process.env.VERIFY_TABLE,
      Key: {
        code: { S: code },
      },
    };
    return this.database.send(new GetItemCommand(data));
  }
}

export const dbClient = new DynamoDbClient();
