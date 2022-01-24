resource "aws_codedeploy_app" "chat_pp" {
  compute_platform = "Lambda"
  name             = "chat_pp"
}

resource "aws_codedeploy_deployment_group" "chat_on_connect" {
  depends_on = [aws_lambda_function.chat_on_connect]

  app_name               = aws_codedeploy_app.chat_pp.name
  deployment_config_name = "CodeDeployDefault.LambdaAllAtOnce"
  deployment_group_name  = "chat_on_connect"
  service_role_arn       = aws_iam_role.code_deploy.arn

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }
}
