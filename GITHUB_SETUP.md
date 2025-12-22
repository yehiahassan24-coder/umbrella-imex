# GitHub Setup & Deployment Guide

## Prerequisites
- GitHub account (create at https://github.com/signup if needed)
- Git installed on your system

---

## Step 1: Initialize Git Repository

```bash
cd /home/voldmort/Desktop/Umbrellaimport/umbrella-app

# Initialize Git
git init

# Configure Git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Umbrella Import & Export platform"
```

---

## Step 2: Create GitHub Repository

### Option A: Via GitHub Website (Easier)
1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `umbrella-import-export`
   - **Description**: "Professional bilingual import/export platform with admin dashboard"
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** check "Initialize with README" (you already have one)
3. Click "Create repository"

### Option B: Via GitHub CLI (Advanced)
```bash
# Install GitHub CLI first
# Ubuntu/Debian:
sudo apt install gh

# macOS:
brew install gh

# Login
gh auth login

# Create repository
gh repo create umbrella-import-export --private --source=. --remote=origin
```

---

## Step 3: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/umbrella-import-export.git

# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 4: Verify Upload

1. Go to your repository: `https://github.com/YOUR_USERNAME/umbrella-import-export`
2. You should see all your files
3. Verify `.env` files are NOT visible (they're in .gitignore)

---

## Step 5: Set Up Branch Protection (Optional but Recommended)

1. Go to repository Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
5. Save changes

---

## Common Issues & Solutions

### Issue: "Permission denied (publickey)"
**Solution**: Set up SSH key or use HTTPS with personal access token
```bash
# Use HTTPS instead
git remote set-url origin https://github.com/YOUR_USERNAME/umbrella-import-export.git
```

### Issue: "Updates were rejected"
**Solution**: Pull first, then push
```bash
git pull origin main --rebase
git push origin main
```

### Issue: ".env file is visible on GitHub"
**Solution**: Remove it immediately
```bash
# Remove from Git history
git rm --cached .env
git commit -m "Remove .env file"
git push origin main

# Then rotate all secrets (JWT_SECRET, database password, etc.)
```

---

## Future Updates

To push changes after initial setup:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Vercel will auto-deploy on push!
```

---

## Security Checklist

Before pushing to GitHub:
- [ ] `.env` files are in `.gitignore`
- [ ] No passwords in code
- [ ] No API keys hardcoded
- [ ] `.gitignore` is properly configured
- [ ] Repository is set to Private (if sensitive)

---

## Next Step

Once code is on GitHub, proceed to Vercel deployment!
