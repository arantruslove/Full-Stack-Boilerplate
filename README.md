# Full Stack Boilerplate

This repo contains boilerplate code to deploy a React - Django Rest Framework - PostgreSQL application on AWS. This application facilitates blue-green deployment.

# Local Development
**Prerequisites:**
 -  Docker/Docker-Compose installed and virtualisation enabled
 
 **Commands to execute in the root of the repo:**

 1. Build the Docker images: `docker-compose -f docker-compose.dev.yaml build`
 2. Run the containers: `docker-compose -f docker-compose.dev.yaml up`
 
 **Command to execute in the backend terminal:**
 -  Migrate the Postgres database: `python manage.py migrate`

 
 
# Staging and Production Deployment

**Prerequisites:**
 1. An AWS account
 2. Own a web domain
 3. A Linux system (can use WSL if on Windows)
 4. Terraform installed
 5. Ansible installed (on the Linux system)

## Terraform
1. Obtain the AWS access key and secret access key
2. Set these as system environment variables with the following keys:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
3. Create an S3 bucket which will be used to store *terraform.tfstate* file
4. Add an AWS key-pair and securely store its private key
5. Setup *backend-config.hcl* based on *example.backend-config.hcl*
6. Setup *terraform.tfvars* based on *example.terraform.tfvars*
7. In the same directory, execute: `terraform init -backend-config="backend-config.hcl"` 
8. To configure the AWS infrastucture, execute: `terraform apply` 

## DNS


