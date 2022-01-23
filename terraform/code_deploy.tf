resource "aws_codedeploy_app" "chat_pp" {
  compute_platform = "Lambda"
  name             = "chat_pp"
}

resource "aws_codedeploy_deployment_group" "lambda_functions" {
  depends_on = [aws_lambda_function.lambda_functions]

  for_each = aws_lambda_function.lambda_functions

  app_name               = aws_codedeploy_app.chat_pp.name
  deployment_config_name = "CodeDeployDefault.LambdaLinear10PercentEvery1Minute"
  deployment_group_name  = each.key
  service_role_arn       = aws_iam_role.code_deploy.arn

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }
}
