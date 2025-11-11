module "raw_bucket" {
  source      = "./module/s3"
  sqs_arn     = module.sqs.sqs_arn
  bucket_name = var.raw_bucket_name
  env         = var.env
}

resource "aws_s3_bucket" "transformed_bucket" {
  bucket        = var.transformed_bucket_name
  force_destroy = true

  tags = {
    "Name" = var.env
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
      "${aws_s3_bucket.transformed_bucket.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.cloudfront.cloudfront_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow_public_access" {
  bucket = aws_s3_bucket.transformed_bucket.id
  policy = data.aws_iam_policy_document.iam_allow_cloudfront_access.json
}

module "cloudfront" {
  source         = "./module/cloudfront"
  s3_domain_name = aws_s3_bucket.transformed_bucket.bucket_regional_domain_name
  price_class    = "PriceClass_100"
}

module "sqs" {
  source     = "./module/sqs"
  bucket_arn = module.raw_bucket.bucket_arn
  sqs_name   = var.sqs_name
  env        = var.env
}
