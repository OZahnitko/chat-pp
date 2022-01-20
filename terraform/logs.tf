resource "aws_cloudwatch_log_group" "lambda_functions" {
  for_each = { for function in var.lambda_functions : function => function }

  name = "/aws/lambda/${each.value}"
}
