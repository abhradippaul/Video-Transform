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


module "sqs" {
  source     = "./module/sqs"
  bucket_arn = module.raw_bucket.bucket_arn
  sqs_name   = var.sqs_name
  env        = var.env
}
