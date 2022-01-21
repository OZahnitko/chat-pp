import type { HandlerEvent } from "./types/handler";

export const handler = async (event: HandlerEvent) => ({
  statusCode: 200,
  body: JSON.stringify(event),
  message: "What are you going to do about it?",
  message_2: "Call the POLIS?",
  message_3: "Mate, we are the POLIS!",
  action: "Queue running away!",
  action_2: "Drink with the boys!",
  action_3: "Get some WATER!",
});
