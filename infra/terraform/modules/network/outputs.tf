output "vpc" {
  value = aws_vpc.main
}

output "ec2_subnet" {
  value = aws_subnet.ec2_subnet
}
