import { Duration } from "@/lib/duration";
import { LLMModel, LLMModelConfig } from "@/lib/models";
import rateLimit from "@/lib/ratelimit";
import { Templates } from "@/lib/templates";
import { CoreMessage } from "ai";

const ratelimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 100;
const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
  ? (process.env.RATE_LIMIT_WINDOW as Duration)
  : "1d";

export async function POST(req: Request) {
  const {
    messages,
    userID,
    template,
    model,
    config,
  }: {
    messages: CoreMessage[];
    userID: string;
    template: Templates;
    model: LLMModel;
    config: LLMModelConfig;
  } = await req.json();

  const limit = !config.apiKey
    ? await rateLimit(userID, ratelimitMaxRequests, ratelimitWindow)
    : false;

  if (limit) {
    return new Response("You have reached your request limit for the day", {
      status: 429,
      headers: {
        "X-Ratelimit-Limit": limit.amount.toString(),
        "X-Ratelimit-Remaining": limit.remaining.toString(),
        "X-Ratelimit-Reset": limit.reset.toString(),
      },
    });
  }

  const {
    model: modelNameString,
    apiKey: modelApiKey,
    ...modelParams
  } = config;
}
