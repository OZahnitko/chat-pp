resource "aws_iam_role" "lambda_functions" {
  depends_on = [aws_cloudwatch_log_group.lambda_functions]

  for_each = aws_cloudwatch_log_group.lambda_functions

  name = "${each.key}_role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })

  inline_policy {
    name = "${each.key}_policy"

    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Action" : [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource" : ["${each.value.arn}:*"]
        },
        {
          "Effect" : "Allow",
          "Action" : [
            "xray:PutTraceSegments",
            "xray:PutTelemetryRecords"
          ],
          "Resource" : ["*"]
        }
      ]
    })
  }
}

resource "aws_iam_role" "code_deploy" {
  name = "code_deploy_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "codedeploy.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "code_deploy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda"
  role       = aws_iam_role.code_deploy.name
}
