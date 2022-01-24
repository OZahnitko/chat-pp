resource "aws_lambda_function" "chat_on_connect" {
  depends_on = [aws_iam_role.chat_on_connect]

  function_name = "chat-on-connect"
  role          = aws_iam_role.chat_on_connect.arn
  handler       = "index.handler"
  filename      = "../packages/lambda-functions/chat-on-connect/function.zip"
  runtime       = "nodejs14.x"
  layers        = []
  tags          = {}
  publish       = true
}

resource "aws_lambda_alias" "chat_on_connect_dev" {
  depends_on = [aws_lambda_function.chat_on_connect]

  name             = "dev"
  description      = "Dev alias targeting the latest version of the chat_on_connect Lambda function."
  function_name    = aws_lambda_function.chat_on_connect.function_name
  function_version = "$LATEST"
}

resource "aws_lambda_alias" "chat_on_connect_prod" {
  depends_on = [aws_lambda_function.chat_on_connect]

  name             = "prod"
  description      = "Prov version targeting a stable version fo the chat_on_connect Lambda function."
  function_name    = aws_lambda_function.chat_on_connect.function_name
  function_version = aws_lambda_function.chat_on_connect.version
}

resource "aws_lambda_permission" "chat_on_connect" {
  statement_id  = "AllowOnConnectRoute"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chat_on_connect.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.chat_pp.execution_arn}/*/$connect"
}
