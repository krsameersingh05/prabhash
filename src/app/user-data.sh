#!/bin/bash
# Update system
sudo apt update -y

# Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs git

# Clone Next.js app
cd /home/ubuntu
git clone 
cd nextjs-app

# Install dependencies and build the app
npm install
npm run build

# Start Next.js app
npm run start &
