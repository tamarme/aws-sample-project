import {
  aws_stepfunctions,
  aws_stepfunctions_tasks,
  Duration,
} from "aws-cdk-lib";
import { Role } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface StepFunctionConstructorProps {
  invokeLambdaRole: Role;
  executorLambda: NodejsFunction;
}

export class StepFunctionConstructor extends Construct {
  public readonly ordersSFArn: string;
  constructor(
    scope: Construct,
    id: string,
    props: StepFunctionConstructorProps
  ) {
    super(scope, id);

    const retry = {
      errors: [
        "DynamoDB.InternalServerError",
        "DynamoDB.InternalServerErrorException",
      ],
      interval: Duration.minutes(3),
      maxAttempts: 3,
      backoffRate: 2,
    };

    const success = new aws_stepfunctions.Pass(this, "Everything is cool", {
      parameters: {
        "orderId.$": "$.orderId",
      },
    });

    const error = new aws_stepfunctions.Pass(this, "Something went wrong", {
      parameters: {
        error: "error",
      },
    });

    const putMessage = new aws_stepfunctions_tasks.LambdaInvoke(
      this,
      "executor-lambda",
      {
        lambdaFunction: props.executorLambda,
        inputPath: "$.messageBody",
        payloadResponseOnly: true,
        resultPath: "$.orderId",
      }
    )
      .addRetry(retry)
      .addCatch(error)
      .next(success);

    const stateMachine = new aws_stepfunctions.StateMachine(
      this,
      "orders-state-machine",
      {
        definition: aws_stepfunctions.Chain.start(putMessage),
        stateMachineName: "orders-state-machine",
        role: props.invokeLambdaRole,
      }
    );

    this.ordersSFArn = stateMachine.stateMachineArn;
  }
}
