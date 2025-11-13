#!/bin/bash

# Vercel Deployment Verification Script
# This script checks if recent commits have been deployed to Vercel

echo "🔍 Checking Vercel Deployment Status..."
echo ""

# Get latest commit hash
LATEST_COMMIT=$(git rev-parse HEAD)
LATEST_COMMIT_SHORT=$(git rev-parse --short HEAD)
LATEST_COMMIT_MSG=$(git log -1 --pretty=%B)

echo "📦 Latest Local Commit:"
echo "   Hash: $LATEST_COMMIT_SHORT"
echo "   Message: $LATEST_COMMIT_MSG"
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current Branch: $CURRENT_BRANCH"
echo ""

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on main branch. Vercel typically deploys from main."
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes."
    git status --short
    echo ""
fi

# Check if we're ahead of origin
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
if [ "$AHEAD" -gt 0 ]; then
    echo "⚠️  Warning: You are $AHEAD commit(s) ahead of origin/main"
    echo "   Run 'git push' to deploy to Vercel"
    echo ""
fi

# Check recent commits
echo "📋 Recent Commits (last 5):"
git log --oneline -5
echo ""

# Instructions for manual verification
echo "✅ Manual Verification Steps:"
echo "   1. Visit https://vercel.com/dashboard"
echo "   2. Check latest deployment status"
echo "   3. Verify build completed successfully"
echo "   4. Test on production URL"
echo ""

echo "🧪 Quick Test Checklist:"
echo "   [ ] Generate new report - check academic writing style"
echo "   [ ] Refresh page during generation - no duplicate conversations"
echo "   [ ] Check sidebar - status badges visible"
echo "   [ ] Click source links - copy animation works"
echo "   [ ] Verify markdown headers render correctly"
echo ""

