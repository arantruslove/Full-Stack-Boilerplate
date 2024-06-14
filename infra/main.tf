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

/**
Setting up VPC and compute instances
**/
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "Terraform-VPC"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "terraform-igw"
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "public-subnet"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-route-table"
  }
}

resource "aws_route_table_association" "public_association" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "ssh-http-security-group" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ssh-http-security-group"
  }
}

resource "aws_security_group" "https-security-group" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "https-security-group"
  }
}

# Creating SSM role for the EC2 instance
resource "aws_iam_role" "ssm-role" {
  name = "SSMRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm-policy-attachment" {
  role       = aws_iam_role.ssm-role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ssm-instance-profile" {
  name = "SSMInstanceProfile"
  role = aws_iam_role.ssm-role.name
}

# Create EC2 instances
resource "aws_instance" "instance_1" {
  ami                         = "ami-01f10c2d6bce70d90"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.ssh-http-security-group.id]
  iam_instance_profile        = aws_iam_instance_profile.ssm-instance-profile.name
  associate_public_ip_address = true

  # Importing existing resources
  key_name = "terraform"

  tags = {
    Name        = "instance-1"
    Environment = var.production_instance == 1 ? "production" : "staging"
  }
}

resource "aws_instance" "instance_2" {
  ami                         = "ami-01f10c2d6bce70d90"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.ssh-http-security-group.id]
  iam_instance_profile        = aws_iam_instance_profile.ssm-instance-profile.name
  associate_public_ip_address = true

  # Importing existing resources
  key_name = "terraform"

  tags = {
    Name        = "instance-2"
    Environment = var.production_instance == 1 ? "staging" : "production"
  }
}

# Postgres rds instance
resource "aws_subnet" "rds_subnet_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "rds-subnet-1"
  }
}

resource "aws_subnet" "rds_subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.5.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "rds-subnet-2"
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  subnet_ids = [aws_subnet.rds_subnet_1.id, aws_subnet.rds_subnet_2.id]
  tags = {
    Name = "rds-subnet-group"
  }
}

resource "aws_security_group" "rds_security_group" {

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds-subnet-group"
  }
}



# Creating postgresql database instance
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = "db.t3.micro"
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres16"
  publicly_accessible  = true
  skip_final_snapshot  = true

  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]

  tags = {
    Name = "production-db"
  }
}

# Setting up the load balancer
# Configuring subnets for the load balancer
resource "aws_subnet" "lb-subnet-1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-2a"

  tags = {
    Name = "lb-subnet-1"
  }
}

resource "aws_subnet" "lb-subnet-2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-west-2b"

  tags = {
    Name = "lb-subnet-2"
  }
}

resource "aws_route_table_association" "lb-subnet-1-association" {
  subnet_id      = aws_subnet.lb-subnet-1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "lb-subnet-2-association" {
  subnet_id      = aws_subnet.lb-subnet-2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_lb" "main" {
  name               = "terraform-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.https-security-group.id]
  subnets            = [aws_subnet.lb-subnet-1.id, aws_subnet.lb-subnet-2.id]

  tags = {
    Name = "terraform-load-balancer"
  }
}

# Defining target groups for the two instances
resource "aws_lb_target_group" "target-group-1" {
  name     = "terraform-target-group-1"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "terraform-target-group-1"
  }
}

resource "aws_lb_target_group" "target-group-2" {
  name     = "terraform-target-group-2"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    interval            = 30
    path                = "/"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "terraform-target-group-2"
  }
}

resource "aws_lb_target_group_attachment" "attachment-1" {
  target_group_arn = aws_lb_target_group.target-group-1.arn
  target_id        = aws_instance.instance_1.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "attachment-2" {
  target_group_arn = aws_lb_target_group.target-group-2.arn
  target_id        = aws_instance.instance_2.id
  port             = 80
}

resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = ["www.${var.domain_name}", "staging.${var.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "terraform-cert"
  }
}

# Define Listener
resource "aws_lb_listener" "main-https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = var.production_instance == 1 ? aws_lb_target_group.target-group-1.arn : aws_lb_target_group.target-group-2.arn
  }
}

# Adding a listener rule
resource "aws_lb_listener_rule" "main_rule" {
  listener_arn = aws_lb_listener.main-https.arn

  action {
    type             = "forward"
    target_group_arn = var.production_instance == 1 ? aws_lb_target_group.target-group-2.arn : aws_lb_target_group.target-group-1.arn
  }

  condition {
    host_header {
      values = ["staging.${var.domain_name}"]
    }
  }

  priority = 1
}

# Route 53 hosted zone
resource "aws_route53_zone" "primary" {
  name = var.domain_name
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "staging" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "staging.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# Validating the certificate
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

