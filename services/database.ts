import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { CreateVerification } from "../interfaces/create-verification";
class DynamoDbClient {
  private database = new DynamoDBClient({ region: process.env.AWS_REGION });
  private dayInMilliseconds = 86400000;

  public async putItem (params: CreateVerification): Promise<any> {
    const data = {
      TableName: process.env.VERIFY_TABLE,
      Item: {
        code: { S: params.code},
        attribute: { S: params.attribute},
        expires_at: { N: `${Date.now() + this.dayInMilliseconds }`},
      },
    }
    return await this.database.send(new PutItemCommand(data));
  }

  public async getItem (code: string): Promise<any> {
    const data = {
      TableName: process.env.VERIFY_TABLE,
      Key: {
        code: { S: code },
      },
    }
    return await this.database.send(new GetItemCommand(data));
  }
}

export const dbClient = new DynamoDbClient();
