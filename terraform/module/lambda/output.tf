output "role" {
  value = data.aws_iam_policy_document.assume_role
}

output "lambda_edge_arn" {
  value = aws_lambda_function.url_rewrite.arn
}

output "lambda_version" {
  value = aws_lambda_function.url_rewrite.version
}
