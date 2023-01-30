import {
  JsonSchemaType,
  JsonSchemaVersion,
  LambdaIntegration,
  RequestValidator,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Effect, PolicyDocument, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface APIGatewayConstructProps {
  producerLambda: NodejsFunction;
}

export class APIGatewayConstruct extends Construct {
  public readonly ordersApi: RestApi;
  constructor(scope: Construct, id: string, props: APIGatewayConstructProps) {
    super(scope, id);

    this.ordersApi = new RestApi(scope, "orders-api", {
      restApiName: "orders-api",
    });

    const requestValidator = new RequestValidator(
      scope,
      "orders-request-validator",
      {
        requestValidatorName: "orders-request-validator",
        restApi: this.ordersApi,
        validateRequestBody: true,
        validateRequestParameters: true,
      }
    );

    const orderRequestModel = this.ordersApi.addModel("OrderRequestModel", {
      modelName: "OrderRequestModel",
      contentType: "application/json",
      schema: {
        properties: {
          pizzaName: {
            type: JsonSchemaType.STRING,
          },
          quantity: {
            type: JsonSchemaType.NUMBER,
          },
        },
        schema: JsonSchemaVersion.DRAFT4,
        title: "OrderRequestModel",
        type: JsonSchemaType.OBJECT,
        required: ["pizzaName", "quantity"],
      },
    });

    const v1 = this.ordersApi.root.addResource("v1");
    v1.addMethod("POST", new LambdaIntegration(props.producerLambda), {
      requestValidator: requestValidator,
      requestModels: {
        "application/json": orderRequestModel,
      },
    });
  }
}
