#!/bin/sh

# Download env file from S3
echo "Downloading env file from S3..."
aws s3 cp s3://my-env-configs/backend/.env.development /app/.env

# Load it manually
export $(grep -v '^#' /app/.env | xargs)

# Start your app
echo "Starting Node.js app..."
npm run start:dev
