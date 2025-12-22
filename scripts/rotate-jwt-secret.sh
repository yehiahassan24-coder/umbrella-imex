#!/bin/bash
# JWT Secret Rotation Script
# Run this to generate a new secure JWT secret

echo "🔐 Generating new JWT secret..."
echo ""

NEW_SECRET=$(openssl rand -base64 64)

echo "✅ New JWT Secret Generated:"
echo ""
echo "$NEW_SECRET"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. Copy the secret above"
echo "2. Update in Vercel:"
echo "   - Go to: Settings → Environment Variables"
echo "   - Update JWT_SECRET with new value"
echo "   - Click 'Save'"
echo ""
echo "3. Redeploy:"
echo "   - Go to: Deployments"
echo "   - Click 'Redeploy' on latest deployment"
echo ""
echo "4. Update local .env (if applicable):"
echo "   JWT_SECRET=\"$NEW_SECRET\""
echo ""
echo "⚠️  WARNING: All existing sessions will be invalidated!"
echo "   Users will need to login again."
echo ""
echo "🔒 Keep this secret secure. Never commit to Git!"
