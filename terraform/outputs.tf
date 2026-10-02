output "vpc_id" {
  description = "ID of the provisioned AWS VPC"
  value       = module.vpc.vpc_id
}

output "security_group_id" {
  description = "ID of the API cluster security group"
  value       = module.compute.security_group_id
}

output "rds_endpoint" {
  description = "Database connection endpoint for PostgreSQL"
  value       = module.rds.db_endpoint
}

output "s3_bucket" {
  description = "S3 application assets storage bucket name"
  value       = module.s3.bucket_name
}
