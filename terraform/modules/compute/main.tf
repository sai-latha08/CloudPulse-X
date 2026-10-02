# Compute Module (EC2 & Security Groups)
resource "aws_security_group" "api_sg" {
  name        = "${var.environment}-sg-api-prod"
  description = "Security group for CloudPulse API compute tier"
  vpc_id      = var.vpc_id

  # Ingress HTTPS
  ingress {
    description = "Allow inbound HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Ingress HTTP
  ingress {
    description = "Allow inbound HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Restricted Bastion SSH (demonstrating security compliance)
  ingress {
    description = "Restricted Internal SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-sg-api-prod"
  }
}

resource "aws_instance" "api_server_01" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.xlarge"
  subnet_id     = var.public_subnet_ids[0]

  vpc_security_group_ids = [aws_security_group.api_sg.id]

  tags = {
    Name        = "api-server-01"
    Environment = var.environment
    Service     = "API-Gateway"
  }
}

resource "aws_instance" "api_server_02" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.xlarge"
  subnet_id     = var.public_subnet_ids[1]

  vpc_security_group_ids = [aws_security_group.api_sg.id]

  tags = {
    Name        = "api-server-02"
    Environment = var.environment
    Service     = "API-Gateway"
  }
}

output "security_group_id" {
  value = aws_security_group.api_sg.id
}

output "instance_ids" {
  value = [aws_instance.api_server_01.id, aws_instance.api_server_02.id]
}

variable "vpc_id" { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "environment" { type = string; default = "production" }
