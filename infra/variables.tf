variable "domain_name" {
  description = "Domain name of the website being deployed."
  type        = string
  default     = "revision-ace.com"
}

variable "production_instance" {
  description = "Flag to determine which instance is for production."
  type        = number
  validation {
    condition     = var.production_instance == 1 || var.production_instance == 2
    error_message = "The production_instance variable must be either 1 or 2."
  }
}


