import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct, Node } from "constructs";

interface LambdaConstructProps {
  lambdaName: string;
  producerLambdaRole: Role;
  consumerLambdaRole: Role;
  orderQueueUrl: string;
  orderTableName: string;
}

export class LambdaConstruct extends Construct {
  public readonly producerLambda: NodejsFunction;
  public readonly consumerLambda: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    this.producerLambda = new NodejsFunction(this, "producer-lambda", {
      functionName: "producer-lambda",
      description: "sends messages to orders queue",
      handler: "handler",
      entry: "./functions/producer-lambda/handler.ts",
      role: props.producerLambdaRole,
      environment: {
        ORDERS_QUEUE_URL: props.orderQueueUrl,
      },
    });

    this.consumerLambda = new NodejsFunction(this, "consumer-lambda", {
      functionName: "consumer-lambda",
      description: "retrieves message from queue and saves in db",
      handler: "handler",
      entry: "./functions/consumer-lambda/handler.ts",
      role: props.consumerLambdaRole,
      environment: {
        ORDERS_TABLE_NAME: props.orderTableName,
      },
    });
  }
}
