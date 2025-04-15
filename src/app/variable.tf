connection {
    type ="ssh"
    host=self.public.public_ip
    user="ubuntu"
    private_key=file(" ./ubuntu1.pem")
}