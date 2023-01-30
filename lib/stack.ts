import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIGatewayConstruct } from "./constructs/api-gateway-construct";
import { DynamoDBConstruct } from "./constructs/dynamodb-construct";
import { IAMRoleConstruct } from "./constructs/iam-role-construct";
import { LambdaConstruct } from "./constructs/lambda-construct";
import { SQSConstruct } from "./constructs/sqs-construct";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class AwsSampleProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queues = new SQSConstruct(this, "orders-queue", {
      queueName: "orders-queue",
    });

    const tables = new DynamoDBConstruct(this, "dynamodb-table-construct", {
      tableName: "orders",
    });

    const roles = new IAMRoleConstruct(this, "iam-role-construct", {
      sqsQueueArn: queues.ordersQueue.queueArn,
      ordersTableArn: tables.ordersTable.tableArn,
    });

    const lambdas = new LambdaConstruct(this, "producer-lambda-construct", {
      lambdaName: "producer-lambda",
      producerLambdaRole: roles.producerLambdaRole,
      consumerLambdaRole: roles.consumerLambdaRole,
      orderQueueUrl: queues.ordersQueue.queueUrl,
      orderTableName: tables.ordersTable.tableName,
    });

    lambdas.consumerLambda.addEventSource(
      new SqsEventSource(queues.ordersQueue)
    );

    new APIGatewayConstruct(this, "orders-api-gateway-construct", {
      producerLambda: lambdas.producerLambda,
    });
  }
}
