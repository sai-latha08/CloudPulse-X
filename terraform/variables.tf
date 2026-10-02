variable "aws_region" {
  type        = string
  description = "Target AWS deployment region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Target environment stage (production, staging, dev)"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "Primary CIDR block for production VPC"
  default     = "10.0.0.0/16"
}
