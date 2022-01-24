resource "aws_apigatewayv2_api" "chat_pp" {
  name                       = "chat_pp"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_integration" "chat_on_connect" {
  depends_on = [aws_lambda_function.chat_on_connect]

  api_id               = aws_apigatewayv2_api.chat_pp.id
  integration_type     = "AWS_PROXY"
  connection_type      = "INTERNET"
  description          = "API Integration for the OnConnection route."
  integration_method   = "POST"
  integration_uri      = aws_lambda_function.chat_on_connect.invoke_arn
  passthrough_behavior = "WHEN_NO_MATCH"
}

resource "aws_apigatewayv2_route" "chat_on_connect" {
  api_id    = aws_apigatewayv2_api.chat_pp.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.chat_on_connect.id}"
}

resource "aws_apigatewayv2_stage" "chat_pp_dev" {
  depends_on = [aws_apigatewayv2_deployment.chat_pp]

  deployment_id = aws_apigatewayv2_deployment.chat_pp.id
  api_id        = aws_apigatewayv2_api.chat_pp.id
  name          = "dev"
}

resource "aws_apigatewayv2_deployment" "chat_pp" {
  depends_on = [aws_apigatewayv2_route.chat_on_connect]

  api_id      = aws_apigatewayv2_api.chat_pp.id
  description = "chat_pp_initial"

  triggers = {
    redeployment = sha1(jsonencode([
      aws_apigatewayv2_integration.chat_on_connect,
      aws_apigatewayv2_route.chat_on_connect
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}
