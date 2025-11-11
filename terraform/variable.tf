variable "env" {
  type    = string
  default = "dev"
}

variable "raw_bucket_name" {
  type    = string
  default = "abhradippaul-raw-video-image-transform"
}

variable "transformed_bucket_name" {
  type    = string
  default = "abhradippaul-transformed-video-image-transform"
}

variable "sqs_name" {
  type    = string
  default = "video-image-transform"
}
