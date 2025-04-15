provider "aws" {
  region = "ap-south-1"  # Change as needed
}

resource "aws_instance" "nextjs_app" {
  ami                    = " ami-0c50b6f7dc3701ddd" # Amazon Linux MI (check AWS for latest)
  instance_type          = "t2.micro"
  key_name               = "ubuntu1" # Ensure you have a key pair in AWS
  vpc_security_group_ids = [aws_security_group.nextjs_sg.id]

  user_data = file("user-data.sh")  # Script to set up the instance

  tags = {
    Name = "NextJS-App-Server"
  }
}

resource "aws_security_group" "nextjs_sg" {
  name        = "nextjs-sg"
  description = "Allow inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow SSH
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow Next.js access
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "public_ip" {
  value = aws_instance.nextjs_app.public_ip
}
