# Git & GitHub Setup Guide for Pawanhans Backend

## 📥 Install Git

1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Open Command Prompt/PowerShell and verify: `git --version`

## 🏗️ Create GitHub Repository

1. Go to https://github.com and sign in
2. Click "New repository"
3. Repository name: `pawanhans-backend`
4. Description: "Backend API for Pawanhans Travel Website"
5. Keep it Public
6. **DO NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

## 🚀 Push Code to GitHub

### Step 1: Initialize Git Repository
```bash
cd "C:\Users\DELL\Desktop\pawanhans-backend"
git init
```

### Step 2: Add Files
```bash
git add .
```

### Step 3: Initial Commit
```bash
git commit -m "Initial commit: Pawanhans backend API"
```

### Step 4: Connect to GitHub
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pawanhans-backend.git
```

### Step 5: Push to GitHub
```bash
git push -u origin main
```

## 🔧 Commands Summary

```bash
# Navigate to backend directory
cd "C:\Users\DELL\Desktop\pawanhans-backend"

# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Pawanhans backend API"

# Set main branch
git branch -M main

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pawanhans-backend.git

# Push to GitHub
git push -u origin main
```

## ✅ Verify Setup

After pushing, you should see your code at:
`https://github.com/YOUR_USERNAME/pawanhans-backend`

## 🚀 Next Steps

Once code is on GitHub:
1. Go to https://railway.app
2. Connect your GitHub account
3. Deploy `pawanhans-backend` repository
4. Set environment variables
5. Database setup with `railway run npm run setup`

## 🆘 Troubleshooting

- **Permission denied**: Make sure you're using your GitHub username in the URL
- **Repository not found**: Double-check the repository name and that it exists
- **Push rejected**: Try `git push --force origin main` (only if repository is empty)

## 📝 Remember to Replace

In the commands above, replace `YOUR_USERNAME` with your actual GitHub username.</content>
<parameter name="filePath">c:\Users\DELL\Desktop\Duplicate Website Design\GIT_SETUP_GUIDE.md