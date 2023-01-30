import { aws_dynamodb } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface DynamoDBConstructProps {
  tableName: string;
}

export class DynamoDBConstruct extends Construct {
  public readonly ordersTable: Table;
  constructor(scope: Construct, id: string, props: DynamoDBConstructProps) {
    super(scope, id);

    this.ordersTable = new Table(scope, "orders-table", {
      tableName: props.tableName,
      partitionKey: {
        name: "orderId",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });
  }
}
