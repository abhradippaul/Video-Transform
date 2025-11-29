
module "raw_bucket" {
  source              = "./module/s3"
  sqs_arn             = module.sqs.sqs_arn
  bucket_name         = var.raw_bucket_name
  env                 = var.env
  enable_notification = true
  cloudfront_arn      = module.cloudfront.cloudfront_arn
  # cloudfront_arn = ""
}

module "transformed_bucket" {
  source              = "./module/s3"
  sqs_arn             = module.sqs.sqs_arn
  bucket_name         = var.transformed_bucket_name
  env                 = var.env
  enable_notification = false
  cloudfront_arn      = module.cloudfront.cloudfront_arn
  # cloudfront_arn = ""
}

module "lambda" {
  source      = "./module/lambda"
  lambda_name = "sqs_notify"
  providers = {
    aws = aws.us_east_1
  }
}

module "cloudfront" {
  source          = "./module/cloudfront"
  s3_domain_name  = module.transformed_bucket.bucket_domain_name
  price_class     = "PriceClass_100"
  lambda_edge_arn = "${module.lambda.lambda_edge_arn}:${module.lambda.lambda_version}"
}

module "sqs" {
  source     = "./module/sqs"
  bucket_arn = module.raw_bucket.bucket_arn
  sqs_name   = var.sqs_name
  env        = var.env
}
