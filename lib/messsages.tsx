import { CapsuleSchema } from "./schema";
import { DeepPartial } from "ai";
import { ExecutionResult } from "./types";

export type MessageType = {
  type: "text";
  text: string;
};

export type MessageCode = {
  type: "code";
  text: string;
};

export type MessageImage = {
  type: "image";
  image: string;
};

export type Message = {
  role: "assistant" | "user";
  content: Array<MessageType | MessageCode | MessageImage>;
  object?: DeepPartial<CapsuleSchema>;
  result?: ExecutionResult;
};
