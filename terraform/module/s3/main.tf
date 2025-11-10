resource "aws_s3_bucket" "bucket" {
  bucket        = var.bucket_name
  force_destroy = true
  tags = {
    "Name" = var.env
  }
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id

  queue {
    queue_arn = var.sqs_arn
    events    = ["s3:ObjectCreated:*"]
  }
}

resource "aws_s3_bucket_cors_configuration" "bucket_cors" {
  bucket = aws_s3_bucket.bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["http://localhost:5173"]
    # expose_headers  = ["*"]
    max_age_seconds = 3600
  }

  # cors_rule {
  #   allowed_methods = ["GET"]
  #   allowed_origins = ["*"]
  # }
}
