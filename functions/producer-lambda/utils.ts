import { SQS } from "aws-sdk";
import { getEnv } from "../utils";
import { MessageBody } from "./models";

export async function sendMessageToQueue(message: MessageBody) {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: getEnv("ORDERS_QUEUE_URL"),
  };
  try {
    await new SQS().sendMessage(params).promise();
  } catch (error) {
    console.log(error);
  }
}
