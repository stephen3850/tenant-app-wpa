import { Client } from "@upstash/qstash";
import { Receiver } from "@upstash/qstash";

// Lazy instantiate clients to avoid build-time errors if env vars are missing
let qstashClient: Client | null = null;
let qstashReceiverClient: Receiver | null = null;

export const getQStashClient = () => {
  if (!qstashClient) {
    qstashClient = new Client({
      token: process.env.QSTASH_TOKEN || "placeholder",
    });
  }
  return qstashClient;
};

export const getQStashReceiver = () => {
  if (!qstashReceiverClient) {
    qstashReceiverClient = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "placeholder",
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "placeholder",
    });
  }
  return qstashReceiverClient;
};


export async function verifyQStashSignature(req: Request) {
  const signature = req.headers.get("upstash-signature");
  if (!signature) return false;

  const body = await req.clone().text();

  try {
    return await getQStashReceiver().verify({
      signature,
      body,
    });
  } catch (err) {
    return false;
  }
}
