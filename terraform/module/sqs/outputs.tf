output "sqs_arn" {
  value = aws_sqs_queue.queue.arn
}

output "sqs_id" {
  value = aws_sqs_queue.queue.id
}
