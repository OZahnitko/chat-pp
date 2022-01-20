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
}
