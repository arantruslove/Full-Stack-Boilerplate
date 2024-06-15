variable "vpc_id" {
  type = string
}

variable "lb_subnet_ids" {
  description = "Load balancer subnets (2 minimum)."
  type        = list(string)
}

variable "lb_sg_id" {
  description = "Load balancer security group."
  type        = string
}

variable "ec2_instance_1_id" {
  type = string
}

variable "ec2_instance_2_id" {
  type = string
}

