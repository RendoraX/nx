// config/service.ts

import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../../../config/src";

const sender = new BrevoClient({
  apiKey: env.BREVO_API_KEY as string,
  timeoutInSeconds: 30,
  maxRetries: 2,
});

export default sender;