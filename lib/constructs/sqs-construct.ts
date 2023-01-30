import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface SQSConstructProps {
  queueName: string;
}

export class SQSConstruct extends Construct {
  public readonly ordersQueue: Queue;
  constructor(scope: Construct, id: string, props: SQSConstructProps) {
    super(scope, id);

    this.ordersQueue = new Queue(scope, "orders", {
      queueName: props.queueName,
    });
  }
}
