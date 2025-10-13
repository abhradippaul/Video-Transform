module "bucket" {
  source      = "./module/s3"
  sqs_arn     = module.sqs.sqs_arn
  bucket_name = "abhradippaul-video-image-transform"
  env         = var.env
}

module "sqs" {
  source     = "./module/sqs"
  bucket_arn = module.bucket.bucket_arn
  sqs_name   = "video-image-transform"
  env        = var.env
}
