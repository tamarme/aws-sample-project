import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface ProducerLambdaConstructProps {
  producerLambdaRole: Role;
  orderQueueUrl: string;
}

export class ProducerLambdaConstruct extends Construct {
  public readonly lambda: NodejsFunction;
  public readonly executorLambda: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: ProducerLambdaConstructProps
  ) {
    super(scope, id);

    this.lambda = new NodejsFunction(this, "producer-lambda", {
      functionName: "producer-lambda",
      description: "sends messages to orders queue",
      handler: "handler",
      entry: "./functions/producer-lambda/handler.ts",
      role: props.producerLambdaRole,
      environment: {
        ORDERS_QUEUE_URL: props.orderQueueUrl,
      },
    });
  }
}
