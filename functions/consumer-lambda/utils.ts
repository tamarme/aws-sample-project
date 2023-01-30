import { OrderItem } from "./models";
import { DynamoDB, SQS } from "aws-sdk";
import { nanoid } from "nanoid";
import { getEnv } from "../utils";

export async function saveToDB(record: OrderItem) {
  const dynamodb = new DynamoDB.DocumentClient();
  const item = {
    TableName: getEnv("ORDERS_TABLE_NAME"),
    Item: {
      orderId: nanoid(),
      ...record,
    },
  };
  await dynamodb.put(item).promise();
}

export async function removeMessageFromSQSQueue() {
  await new SQS().deleteMessage().promise();
}
