resource "aws_codedeploy_app" "chat_pp" {
  compute_platform = "Lambda"
  name             = "chat_pp"
}
