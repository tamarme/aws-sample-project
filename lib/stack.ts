import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIGatewayConstruct } from "./constructs/api-gateway-construct";
import { DynamoDBConstruct } from "./constructs/dynamodb-construct";
import { IAMRoleConstruct } from "./constructs/iam-role-construct";
import { SQSConstruct } from "./constructs/sqs-construct";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StepFunctionConstructor } from "./constructs/step-function-constructor";
import { ConsumerLambdaConstruct } from "./constructs/consumer-lambda-construct";
import { ProducerLambdaConstruct } from "./constructs/producer-lambda-construct";
import { ExecutorLambdaConstruct } from "./constructs/executor-lambda-construct";

export class AwsSampleProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queues = new SQSConstruct(this, "orders-queue");

    const tables = new DynamoDBConstruct(this, "dynamodb-table-construct", {
      ordersTableName: "orders",
    });

    const roles = new IAMRoleConstruct(this, "iam-role-construct", {
      sqsQueueArn: queues.ordersQueue.queueArn,
      ordersTableArn: tables.ordersTable.tableArn,
    });

    const executorLambda = new ExecutorLambdaConstruct(
      this,
      "executor-lambda-construct",
      {
        executorLambdaRole: roles.executorLambdaRole,
        orderTableName: tables.ordersTable.tableName,
      }
    );

    const producerLambda = new ProducerLambdaConstruct(
      this,
      "producer-lambda-construct",
      {
        producerLambdaRole: roles.producerLambdaRole,
        orderQueueUrl: queues.ordersQueue.queueUrl,
      }
    );

    const sf = new StepFunctionConstructor(this, "step-function-constructor", {
      invokeLambdaRole: roles.invokeLambdaFromSF,
      executorLambda: executorLambda.lambda,
    });

    const consumerLambda = new ConsumerLambdaConstruct(
      this,
      "consumer-lambda-construct",
      {
        consumerLambdaRole: roles.consumerLambdaRole,
        ordersSFArn: sf.ordersSFArn,
      }
    );

    consumerLambda.lambda.addEventSource(
      new SqsEventSource(queues.ordersQueue)
    );

    new APIGatewayConstruct(this, "orders-api-gateway-construct", {
      producerLambda: producerLambda.lambda,
    });
  }
}
