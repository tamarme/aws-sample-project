import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIGatewayConstruct } from "./constructs/api-gateway-construct";
import { IAMRoleConstruct } from "./constructs/iam-role-construct";
import { ProducerLambdaConstruct } from "./constructs/producer-lambda-construct";
import { SQSConstruct } from "./constructs/sqs-construct";

export class AwsSampleProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queues = new SQSConstruct(this, "orders-queue", {
      queueName: "orders-queue",
    });

    const roles = new IAMRoleConstruct(this, "iam-role-construct", {
      sqsQueueArn: queues.ordersQueue.queueArn,
    });

    const lambdaConstructs = new ProducerLambdaConstruct(
      this,
      "producer-lambda-construct",
      {
        lambdaName: "producer-lambda",
        producerLambdaRole: roles.producerLambdaRole,
        orderQueueUrl: queues.ordersQueue.queueUrl,
      }
    );

    new APIGatewayConstruct(this, "orders-api-gateway-construct", {
      producerLambda: lambdaConstructs.producerLambda,
    });
  }
}
