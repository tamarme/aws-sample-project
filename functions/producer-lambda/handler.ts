import { MessageBody } from "./models";
import { sendMessageToQueue } from "./utils";

export const handler = async (event: any) => {
  const message = JSON.parse(event.body as string) as MessageBody;
  sendMessageToQueue(message);
  console.log(message);
  return {
    statusCode: 200,
    body: JSON.stringify(message),
  };
};
