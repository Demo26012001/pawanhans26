# Pawanhans Backend Deployment Guide

## 🚀 Deploy to Railway (Recommended)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `pawanhans-backend` repository
3. Railway will automatically detect Node.js and deploy

### Step 3: Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pawanhans?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random

# AWS S3 (for image uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET_NAME=pawanhans-images

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@pawanhans.com

# Default Admin
ADMIN_NAME=Pawanhans Admin
ADMIN_EMAIL=Admin@pawanhans.com
ADMIN_PASSWORD=Admin@p1234
```

### Step 4: Database Setup
After deployment, run the database setup:
```bash
railway run npm run setup
```

### Step 5: Get API URL
Railway will provide a URL like: `https://pawanhans-backend.up.railway.app`

## 🗄️ MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create free account → Create cluster
3. Create database user with password
4. Get connection string from "Connect" → "Connect your application"
5. Replace `<username>`, `<password>`, `<cluster>` in the connection string

## ☁️ AWS S3 Setup (Optional - Can skip for now)

1. Go to https://aws.amazon.com/s3/
2. Create bucket: `pawanhans-images`
3. Create IAM user with S3 permissions
4. Get access keys

## 📧 Gmail Setup

1. Enable 2FA on Gmail
2. Go to Google Account → Security → App passwords
3. Generate app password for "Pawanhans Backend"
4. Use this password in EMAIL_PASS

## 🔗 Frontend Configuration

Update your frontend `.env` file:
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

## ✅ Testing Deployment

1. Visit Railway URL
2. Should see: `{"message":"Pawanhans API Server","status":"running"}`
3. Test login with default admin credentials
4. Upload test image and package

## 🆘 Troubleshooting

- **Build fails**: Check Railway logs for errors
- **Database connection**: Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all)
- **Email not working**: Check Gmail app password
- **Images not uploading**: Verify AWS credentials and bucket permissions</content>
<parameter name="filePath">c:\Users\DELL\Desktop\Duplicate Website Design\BACKEND_DEPLOYMENT_GUIDE.md