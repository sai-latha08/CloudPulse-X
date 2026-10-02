# Storage Module (S3 Bucket with Block Public Access & Default Encryption)
resource "aws_s3_bucket" "assets" {
  bucket = "cloudpulse-application-assets-${var.environment}"

  tags = {
    Name        = "application-assets"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "assets_block" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets_encryption" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

output "bucket_name" {
  value = aws_s3_bucket.assets.id
}

variable "environment" { type = string; default = "production" }
