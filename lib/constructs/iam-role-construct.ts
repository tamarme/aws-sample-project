import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface IAMRoleConstructProps {
  sqsQueueArn: string;
  ordersTableArn: string;
}

export class IAMRoleConstruct extends Construct {
  public readonly producerLambdaRole: Role;
  public readonly consumerLambdaRole: Role;
  constructor(scope: Construct, id: string, props: IAMRoleConstructProps) {
    super(scope, id);

    this.producerLambdaRole = new Role(scope, "producer-lambda-role", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      inlinePolicies: {
        producerLambdaPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              sid: "sendingMessageQueue",
              effect: Effect.ALLOW,
              actions: ["SQS:SendMessage"],
              resources: [props.sqsQueueArn],
            }),
          ],
        }),
      },
    });

    this.consumerLambdaRole = new Role(scope, "consumer-lambda-role", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      inlinePolicies: {
        consumerLambdaPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              sid: "retrieveMessageFromQueue",
              effect: Effect.ALLOW,
              actions: ["SQS:ReceiveMessage"],
              resources: [props.sqsQueueArn],
            }),
            new PolicyStatement({
              sid: "dynamodb",
              effect: Effect.ALLOW,
              actions: ["DynamoDB:PutItem"],
              resources: [props.ordersTableArn],
            }),
          ],
        }),
      },
    });
  }
}
