# AWS Direct Connection Setup

This frontend can now connect directly to AWS services without going through the backend API.

## Setup Instructions

1. **Install AWS SDK packages:**
   ```bash
   cd frontend
   npm install @aws-sdk/client-ec2 @aws-sdk/client-cost-explorer
   ```

2. **Configure AWS credentials in `.env` file:**
   ```env
   VITE_USE_DIRECT_AWS=true
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=your_actual_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_actual_secret_key
   ```

3. **Enable direct AWS connection:**
   Set `VITE_USE_DIRECT_AWS=true` in your `.env` file

## Features

- Direct EC2 instance listing from AWS
- Direct EC2 instance stop/start operations
- Direct Cost Explorer data fetching
- Fallback to backend API when direct connection is disabled

## Security Notes

⚠️ **Important:** Exposing AWS credentials in frontend code is NOT recommended for production environments. This should only be used for:
- Development/testing purposes
- Internal tools with restricted access
- Environments with additional security layers

For production, keep using the backend API approach which securely manages AWS credentials server-side.

## Toggle Between Modes

- Set `VITE_USE_DIRECT_AWS=false` to use backend API (recommended for production)
- Set `VITE_USE_DIRECT_AWS=true` to connect directly to AWS (development only)
