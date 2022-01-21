# resource "aws_lambda_layer_version" {
#   filename   = ""
#   layer_name = "lambda_layer"
# }

resource "aws_lambda_function" "lambda_functions" {
  depends_on = [aws_iam_role.lambda_functions]

  for_each = aws_iam_role.lambda_functions

  function_name = each.key
  role          = each.value.arn
  handler       = "index.handler"
  filename      = "../packages/lambda-functions/${each.key}/function.zip"
  runtime       = "nodejs14.x"
  layers        = []
  tags          = {}
  publish       = true
}

resource "aws_lambda_alias" "lambda_functions_dev_alias" {
  depends_on = [aws_lambda_function.lambda_functions]

  for_each = aws_lambda_function.lambda_functions

  name             = "dev"
  description      = "Dev alias targeting the latest version of the function."
  function_name    = each.value.arn
  function_version = "$LATEST"
}


resource "aws_lambda_alias" "lambda_functions_prod_alias" {
  depends_on = [aws_lambda_function.lambda_functions]

  for_each = aws_lambda_function.lambda_functions

  name             = "prod"
  description      = "Prod alias targeting a stable version of the function."
  function_name    = each.value.arn
  function_version = "1"
}
