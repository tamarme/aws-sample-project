import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface ExecutorLambdaConstructProps {
  executorLambdaRole: Role;
  orderTableName: string;
}

export class ExecutorLambdaConstruct extends Construct {
  public readonly lambda: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: ExecutorLambdaConstructProps
  ) {
    super(scope, id);

    this.lambda = new NodejsFunction(this, "executor-lambda", {
      functionName: "executor-lambda",
      description: "retrieves message from queue and saves in db",
      handler: "handler",
      entry: "./functions/executor-lambda/handler.ts",
      role: props.executorLambdaRole,
      environment: {
        ORDERS_TABLE_NAME: props.orderTableName,
      },
    });
  }
}
