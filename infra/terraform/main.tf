# Storing statefile
terraform {
  backend "s3" {
    bucket  = "terraform-12345"
    key     = "terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}

provider "aws" {
  region = "eu-west-2"
}

module "network" {
  source = "./modules/network"
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.network.vpc.id
}

module "compute" {
  source              = "./modules/compute"
  production_instance = var.production_instance
  ec2_subnet_id       = module.network.ec2_subnet.id
  ec2_sg_id           = module.security_groups.ssh_http_sg.id
}

module "rds" {
  source         = "./modules/rds"
  rds_subnet_ids = [module.network.rds_subnet_1.id, module.network.rds_subnet_2.id]
  rds_sg_id      = module.security_groups.rds_sg.id
  db_port        = var.db_port
  db_name        = var.db_name
  db_username    = var.db_username
  db_password    = var.db_password
}
