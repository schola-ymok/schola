import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const client = new SESClient({ region: 'us-east-1' });

export const handler = async (event) => {
  const params = {
    Destination: {
      ToAddresses: ['akoamay@gmail.com'],
    },
    Message: {
      Body: {
        Text: { Data: 'Test' },
      },
      Subject: { Data: 'Test Email' },
    },
    Source: 'notifications@schola.jp',
  };

  const command = new SendEmailCommand(params);

  try {
    await client.send(command);
    return {
      statusCode: 200,
      body: `success`,
    };
  } catch (error) {
    return error;
  }
};
