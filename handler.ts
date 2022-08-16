const AWS = require("aws-sdk");
import { express, Request, Response } from "express";
import AliasId from "./services/aliasId";
const serverless = require("serverless-http");
import { dbClient } from "./services/database";
import { SmsClient } from "./services/sns-sms-config";

const app = express();
app.use(express.json());

app.get("/sms/:code", async function (req: Request, res: Response) {
  const { code } = req.params;
  try {
    const item = await dbClient.getItem(code);
    if (item) {
      res.status(200).json({ item });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find code' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve code" });
  }
});

app.post("/sms", async function (req: Request, res: Response) {
  const { phone } = req.body;
  if (typeof phone !== "string") {
    res.status(400).json({ error: '"phone" must be a string' });
  }
  const code = await AliasId.generate();
  try {
    await SmsClient.sendSms(phone, `Your code is ${code}`);
    await dbClient.putItem({ code, attribute:phone });
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
