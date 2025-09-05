#!/bin/bash

echo "🚀 Starting API Routes Migration to Drizzle..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your DATABASE_URL from Xata Lite"
    echo "and Discord OAuth credentials"
    echo "See env-template.txt for reference"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Generate migrations
echo "📝 Generating database migrations..."
npm run db:generate

if [ $? -eq 0 ]; then
    echo "✅ Migrations generated successfully"
else
    echo "❌ Failed to generate migrations"
    exit 1
fi

echo ""
echo "🔧 Next steps:"
echo "1. Set up your Xata Lite database at https://xata.io"
echo "2. Set up Discord OAuth at https://discord.com/developers/applications"
echo "3. Update your .env.local with DATABASE_URL and Discord credentials"
echo "4. Run: npm run db:migrate"
echo "5. Update your API routes to use '@/lib/database-new'"
echo "6. Test your application with: npm run dev"
echo ""
echo "📚 See MIGRATION_GUIDE.md for detailed instructions"
echo ""
echo "🎉 Migration setup complete!"
