import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class SQSConstruct extends Construct {
  public readonly ordersQueue: Queue;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.ordersQueue = new Queue(scope, "orders", {
      queueName: "orders-queue",
    });
  }
}
