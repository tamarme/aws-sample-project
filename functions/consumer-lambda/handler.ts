import { OrderItem } from "./models";
import { removeMessageFromSQSQueue, saveToDB } from "./utils";

export const handler = async (event: any) => {
  console.log(JSON.stringify(event));
  const record = JSON.parse(event.Records[0].body) as OrderItem;
  try {
    await saveToDB(record);
    await removeMessageFromSQSQueue();
  } catch (error) {
    console.log(error);
  }
};
