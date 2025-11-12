resource "aws_s3_bucket" "bucket" {
  bucket        = var.bucket_name
  force_destroy = true
  tags = {
    "Name" = var.env
  }
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  count  = var.enable_notification ? 1 : 0
  bucket = aws_s3_bucket.bucket.id

  queue {
    filter_prefix = "video/"
    queue_arn     = var.sqs_arn
    events        = ["s3:ObjectCreated:*"]
  }
}

data "aws_iam_policy_document" "iam_allow_cloudfront_access" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadWrite"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.bucket.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [var.cloudfront_arn]
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "cors_configuration" {
  bucket = aws_s3_bucket.bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}

resource "aws_s3_bucket_policy" "allow_public_access" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.iam_allow_cloudfront_access.json
}
