import { MessageBody } from "./models";
import { sendMessageToQueue } from "./utils";

export const handler = async (event: any) => {
  console.log(event);
  const message = JSON.parse(event.body as string) as MessageBody;

  try {
    await sendMessageToQueue(message);
    return {
      statusCode: 200,
      body: "Message is successfully sent to queue.",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
