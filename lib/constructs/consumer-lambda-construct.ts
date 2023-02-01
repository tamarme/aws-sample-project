import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface ConsumerLambdaConstructProps {
  consumerLambdaRole: Role;
  ordersSFArn: string;
}

export class ConsumerLambdaConstruct extends Construct {
  public readonly lambda: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: ConsumerLambdaConstructProps
  ) {
    super(scope, id);

    this.lambda = new NodejsFunction(this, "consumer-lambda", {
      functionName: "consumer-lambda",
      description: "retrieves message from queue and saves in db",
      handler: "handler",
      entry: "./functions/consumer-lambda/handler.ts",
      role: props.consumerLambdaRole,
      environment: {
        ORDERS_STEP_FUNCTION: props.ordersSFArn,
      },
    });
  }
}
