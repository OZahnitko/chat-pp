import type { HandlerEvent } from "./types/handler";

export const handler = async (event: HandlerEvent) => ({
  statusCode: 200,
  body: JSON.stringify(event),
  request: "Gimme the loot!",
  request2: "Gimme the loot!",
  reason: "I'm a bastard!",
  message: "FUDGE THE POLIS!!",
});
