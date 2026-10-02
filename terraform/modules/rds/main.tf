# Database Module (RDS PostgreSQL Multi-AZ)
resource "aws_db_subnet_group" "rds_subnets" {
  name       = "${var.environment}-db-subnets"
  subnet_ids = var.private_db_subnet_ids

  tags = {
    Name = "${var.environment}-rds-subnet-group"
  }
}

resource "aws_db_instance" "production_db" {
  identifier             = "production-db"
  allocated_storage      = 500
  max_allocated_storage  = 1000
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.r6g.2xlarge"
  db_name                = "cloudpulse_prod"
  username               = "cloudpulse_admin"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnets.name
  multi_az               = true
  publicly_accessible    = false
  skip_final_snapshot    = true
  storage_encrypted      = true

  tags = {
    Name        = "production-db"
    Environment = var.environment
  }
}

output "db_endpoint" {
  value = aws_db_instance.production_db.endpoint
}

variable "private_db_subnet_ids" { type = list(string) }
variable "db_password" { type = string; sensitive = true; default = "CloudPulseSecretDB2026!" }
variable "environment" { type = string; default = "production" }
