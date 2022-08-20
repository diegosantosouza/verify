import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export class SmsClient {
  public static async sendSms(phone: string, message: string): Promise<void> {
    const sns = new SNSClient({ region: process.env.AWS_REGION });
    const data = {
      Message: message,
      PhoneNumber: phone,
    };
    try {
      await sns.send(new PublishCommand(data));
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }
}
