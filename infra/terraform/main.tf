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
