import { MessageBody } from "./models";
import { removeMessageFromSQSQueue, startStepFunctionExecution } from "./utils";

export const handler = async (event: any) => {
  console.log(JSON.stringify(event));
  const record = JSON.parse(event.Records[0].body) as MessageBody;
  try {
    await startStepFunctionExecution(record);
    await removeMessageFromSQSQueue();
  } catch (error) {
    console.log(error);
  }
};
