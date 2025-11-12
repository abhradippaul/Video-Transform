resource "aws_cloudwatch_log_group" "cloudwathc_log_group" {
  name              = "/aws/lambda/${var.lambda_name}"
  retention_in_days = 3

  tags = {
    Function = var.lambda_name
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "url_rewrite_role" {
  name               = "lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# data "aws_iam_policy_document" "url_rewrite_lambda_permissions" {
#   statement {
#     effect = "Allow"
#     actions = [
#       "logs:CreateLogGroup",
#       "logs:CreateLogStream",
#       "logs:PutLogEvents"
#     ]
#     resources = ["arn:aws:logs:*:*:*"]
#   }

#   statement {
#     effect = "Allow"
#     actions = [
#       "lambda:GetFunction",
#       "lambda:PublishVersion",
#       "lambda:GetFunctionConfiguration"
#     ]
#     resources = ["*"]
#   }
# }

data "aws_iam_policy_document" "url_rewrite_lambda_permissions" {
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "url_rewrite_lambda" {
  name   = "lambda_inline_policy"
  role   = aws_iam_role.url_rewrite_role.name
  policy = data.aws_iam_policy_document.url_rewrite_lambda_permissions.json
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/index.js"
  output_path = "${path.module}/function.zip"
}

resource "aws_lambda_function" "url_rewrite" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = var.lambda_name
  role             = aws_iam_role.url_rewrite_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs22.x"
  publish          = true

  tags = {
    Application = var.lambda_name
  }
}

resource "aws_lambda_permission" "allow_cloudfront_invoke" {
  statement_id  = "AllowExecutionFromCloudFront"
  action        = "lambda:GetFunction"
  function_name = aws_lambda_function.url_rewrite.function_name
  principal     = "edgelambda.amazonaws.com"
}
