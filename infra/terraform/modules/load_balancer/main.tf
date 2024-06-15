resource "aws_lb" "main" {
  name               = "main-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.lb_sg_id]
  subnets            = var.lb_subnet_ids
}

# Defining target groups for the two instances
resource "aws_lb_target_group" "target_group_1" {
  name     = "terraform-target-group-1"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

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

resource "aws_lb_target_group" "target_group_2" {
  name     = "terraform-target-group-2"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

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

# Attaching EC2 instances to the target groups
resource "aws_lb_target_group_attachment" "attachment_1" {
  target_group_arn = aws_lb_target_group.target_group_1.arn
  target_id        = var.ec2_instance_1_id
  port             = 80
}

resource "aws_lb_target_group_attachment" "attachment-2" {
  target_group_arn = aws_lb_target_group.target_group_2.arn
  target_id        = var.ec2_instance_2_id
  port             = 80
}
