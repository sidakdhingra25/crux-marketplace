#!/bin/bash

echo "🔄 Updating API Route Imports to Drizzle..."
echo ""

# Find all TypeScript files in the api directory
echo "📁 Finding API route files..."
API_FILES=$(find app/api -name "*.ts" -type f)

if [ -z "$API_FILES" ]; then
    echo "❌ No API route files found"
    exit 1
fi

echo "Found API route files:"
echo "$API_FILES"
echo ""

# Update imports in each file
echo "🔄 Updating imports..."
for file in $API_FILES; do
    echo "Processing: $file"
    
    # Replace the import statement
    sed -i 's|from "@/lib/database"|from "@/lib/database-new"|g' "$file"
    
    # Check if the file was updated
    if grep -q "from \"@/lib/database-new\"" "$file"; then
        echo "✅ Updated: $file"
    else
        echo "⚠️  No changes needed: $file"
    fi
done

echo ""
echo "🎉 Import updates complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up Xata Lite database"
echo "2. Update your .env.local file"
echo "3. Run: npm run db:migrate"
echo "4. Test your API routes"
echo ""
echo "📚 See API_MIGRATION_GUIDE.md for detailed instructions"
