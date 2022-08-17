import type { Request, Response } from 'express';
import express, { json } from 'express';
import helmet from 'helmet';

import AliasId from './services/aliasId';
import { dbClient } from './services/database';
import { SmsClient } from './services/sns-sms-config';

const app = express();
app.use(json());
app.use(helmet());

app.get('/sms/:code', async (req: Request, res: Response) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).send('Missing code');
  }
  if (typeof code !== 'string') {
    res.status(400).json({ error: '"code" must be a string' });
  }
  try {
    const item = await dbClient.getItem(code);
    if (item) {
      res.status(200).json({ item });
    } else {
      res.status(404).json({ error: 'Could not find code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve code' });
  }
  return null;
});

app.post('/sms', async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (typeof phone !== 'string') {
    res.status(400).json({ error: '"phone" must be a string' });
  }
  const code = await AliasId.generate();
  try {
    await SmsClient.sendSms(phone, `Your code is ${code}`);
    await dbClient.putItem({ code, attribute: phone });
    res.status(200).json({ msg: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Could not create code' });
  }
});

app.use((_, res, _2) => {
  res.status(404).json({ error: 'NOT FOUND' });
});

export { app };
