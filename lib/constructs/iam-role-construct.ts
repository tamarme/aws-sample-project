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
  public readonly executorLambdaRole: Role;
  public readonly invokeLambdaFromSF: Role;
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

    this.executorLambdaRole = new Role(scope, "executor-lambda-role", {
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
              sid: "dynamodb",
              effect: Effect.ALLOW,
              actions: ["DynamoDB:PutItem"],
              resources: [props.ordersTableArn],
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
              sid: "startStepFunction",
              effect: Effect.ALLOW,
              actions: ["states:StartExecution"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });

    this.invokeLambdaFromSF = new Role(scope, "invoke-lambda-sf", {
      assumedBy: new ServicePrincipal("states.amazonaws.com"),
      inlinePolicies: {
        invokeLambda: new PolicyDocument({
          statements: [
            new PolicyStatement({
              sid: "invokeLambda",
              effect: Effect.ALLOW,
              actions: ["lambda:InvokeFunction"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });
  }
}
