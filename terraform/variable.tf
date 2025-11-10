variable "env" {
  type    = string
  default = "dev"
}

variable "raw_bucket_name" {
  type    = string
  default = ""
}

variable "transformed_bucket_name" {
  type    = string
  default = ""
}

variable "sqs_name" {
  type    = string
  default = ""
}
