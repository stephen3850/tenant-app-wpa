import { Client } from "@upstash/qstash";
import { Receiver } from "@upstash/qstash";

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export const qstashReceiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function verifyQStashSignature(req: Request) {
  const signature = req.headers.get("upstash-signature");
  if (!signature) return false;

  const body = await req.clone().text();

  try {
    return await qstashReceiver.verify({
      signature,
      body,
    });
  } catch (err) {
    return false;
  }
}
