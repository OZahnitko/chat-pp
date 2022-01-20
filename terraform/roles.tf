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
 
