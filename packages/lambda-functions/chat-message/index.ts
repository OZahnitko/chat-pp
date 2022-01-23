import type { HandlerEvent } from "./types/handler";

export const handler = async (event: HandlerEvent) => ({
  statusCode: 200,
  body: JSON.stringify(event),
  question: "What are you going to do about it?",
});
