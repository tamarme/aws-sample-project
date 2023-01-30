import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface ProducerLambdaConstructProps {
  lambdaName: string;
  producerLambdaRole: Role;
  orderQueueUrl: string;
}

export class ProducerLambdaConstruct extends Construct {
  public readonly producerLambda: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: ProducerLambdaConstructProps
  ) {
    super(scope, id);

    this.producerLambda = new NodejsFunction(this, "producer-lambda", {
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
