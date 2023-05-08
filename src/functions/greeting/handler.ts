import { formatJSONResponse } from "@libs/api-gateway";

const greeting = async (event) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};
export const main = greeting;
