terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source      = "./modules/vpc"
  aws_region  = var.aws_region
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

module "compute" {
  source            = "./modules/compute"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  environment       = var.environment
}

module "rds" {
  source                = "./modules/rds"
  private_db_subnet_ids = module.vpc.private_db_subnet_ids
  environment           = var.environment
}

module "s3" {
  source      = "./modules/s3"
  environment = var.environment
}

module "monitoring" {
  source      = "./modules/monitoring"
  environment = var.environment
}
