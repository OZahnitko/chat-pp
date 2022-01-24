resource "aws_iam_role" "code_deploy" {
  name = "code_deploy_role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : { "Service" : "codedeploy.amazonaws.com" },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "code_deploy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda"
  role       = aws_iam_role.code_deploy.name
}

resource "aws_iam_role" "chat_on_connect" {
  depends_on = [aws_cloudwatch_log_group.chat_on_connect]

  name = "chat_on_connect_role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : { "Service" : "lambda.amazonaws.com" },
        "Action" : "sts:AssumeRole"
      }
    ]
  })

  inline_policy {
    name = "chat_on_connect_policy"

    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "ChatConnectLogs",
          "Effect" : "Allow",
          "Action" : [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:DescribeLogStreams",
            "logs:GetLogEvents",
            "logs:PutLogEvents",
            "logs:PutRetentionPolicy"
          ],
          "Resource" : [
            "${aws_cloudwatch_log_group.chat_on_connect.arn}",
            "${aws_cloudwatch_log_group.chat_on_connect.arn}:log-stream:*"
          ]
        },
        {
          "Sid" : "ChatConnectOther",
          "Effect" : "Allow",
          "Action" : [
            "execute-api:Invoke",
            "execute-api:ManageConnections",
            "xray:PutTelemetryRecords",
            "xray:PutTraceSegments"
          ],
          "Resource" : ["*"]
        }
      ]
    })
  }
}
