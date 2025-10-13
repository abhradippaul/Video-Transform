resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
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
