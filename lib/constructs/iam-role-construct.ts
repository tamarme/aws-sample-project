import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface IAMRoleConstructProps {
  sqsQueueArn: string;
}

export class IAMRoleConstruct extends Construct {
  public readonly producerLambdaRole: Role;
  constructor(scope: Construct, id: string, props: IAMRoleConstructProps) {
    super(scope, id);

    this.producerLambdaRole = new Role(scope, "producer-lambda-role", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        sendingMessagesPolicy: new PolicyDocument({
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
  }
}
