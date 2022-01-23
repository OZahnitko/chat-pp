import type { HandlerEvent } from "./types/handler";

export const handler = async (event: HandlerEvent) => ({
  statusCode: 200,
  body: JSON.stringify(event),
  message: "Yeet!",
});
