# Git Configuration Guide

## Fix Commit Identity

Your commits currently show:
```
Committer: voldmort <voldmort@localhost.localdomain>
```

This should be updated to your real name and professional email.

## Quick Fix

```bash
# Set your real name and email globally
git config --global user.name "Your Real Name"
git config --global user.email "you@company.com"

# Optional: Fix the last commit's author
git commit --amend --reset-author --no-edit

# If you've made multiple commits, you can rebase:
git rebase -i HEAD~5 -x "git commit --amend --reset-author --no-edit"
```

## Verify Configuration

```bash
# Check current config
git config --global user.name
git config --global user.email

# View recent commits
git log --oneline -5
```

## Why This Matters

Professional commit identity is important for:
- ✅ **Investors** - Shows professionalism
- ✅ **Clients** - If repo becomes public
- ✅ **Audits** - Proper attribution
- ✅ **Open-source** - Community standards
- ✅ **Team collaboration** - Clear ownership

## Example

```bash
# Good commit identity
git config --global user.name "John Smith"
git config --global user.email "john.smith@umbrella-import.com"

# Result:
# Author: John Smith <john.smith@umbrella-import.com>
```

## After Fixing

Your commits will show:
```
Author: Your Real Name <you@company.com>
Date:   Mon Dec 23 01:00:00 2025 +0200
```

Much more professional! ✅
