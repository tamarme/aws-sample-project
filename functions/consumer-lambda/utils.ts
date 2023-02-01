import { SQS, StepFunctions } from "aws-sdk";
import { nanoid } from "nanoid";
import { getEnv } from "../utils";
import { MessageBody } from "./models";

export async function startStepFunctionExecution(messageBody: MessageBody) {
  const now = new Date();
  const params: StepFunctions.StartExecutionInput = {
    stateMachineArn: getEnv("ORDERS_STEP_FUNCTION"),
    input: JSON.stringify({ messageBody }),
    name: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${nanoid()}`,
  };
  await new StepFunctions().startExecution(params).promise();
}

export async function removeMessageFromSQSQueue() {
  await new SQS().deleteMessage().promise();
}
