# API Routes Migration Guide

## 🎯 What Needs to Be Migrated

// ...existing code...

### 1. **Scripts API** (`app/api/scripts/route.ts`)
**Current Import:**
```typescript
import { createScript, getScripts } from "@/lib/database"
```

**New Import:**
```typescript
import { createScript, getScripts } from "@/lib/database-new"
```

**Changes Needed:**
- The `createScript` function signature is the same
- The `getScripts` function returns the same data structure

### 2. **Giveaways API** (`app/api/giveaways/route.ts`)
**Current Import:**
```typescript
import { createGiveaway, createGiveawayRequirement, createGiveawayPrize, getGiveaways } from "@/lib/database"
```

**New Import:**
```typescript
import { createGiveaway, createGiveawayRequirement, createGiveawayPrize, getGiveaways } from "@/lib/database-new"
```

**Changes Needed:**
- All functions have the same signatures
- Data structures remain the same

### 3. **Other API Routes**
Check these files and update their imports:
- `app/api/ads/route.ts`
- `app/api/user/giveaway-entries/route.ts`
- `app/api/giveaways/[id]/route.ts`
- `app/api/scripts/[id]/route.ts`
- `app/api/admin/users/route.ts`

## 🔄 Migration Steps

### Step 1: Update Imports
Replace all imports from:
```typescript
import { ... } from "@/lib/database"
```

To:
```typescript
import { ... } from "@/lib/database-new"
```

### Step 2: Check Function Signatures
Most functions have the same signatures, but verify:
- `createScript(data)` - ✅ Same
- `getScripts(filters)` - ✅ Same
- `createGiveaway(data)` - ✅ Same
- `getGiveaways(filters)` - ✅ Same
- `createGiveawayRequirement(data)` - ✅ Same
- `createGiveawayPrize(data)` - ✅ Same

### Step 3: Test Each Route
After updating imports, test each API endpoint:
1. Create a script
2. Fetch scripts
3. Create a giveaway
4. Fetch giveaways
5. Create giveaway entries
6. Fetch user data

## 📝 Example Migration

**Before (Old Database):**
```typescript
import { createScript, getScripts } from "@/lib/database"

export async function POST(request: NextRequest) {
  // ... your existing code
  const scriptId = await createScript(scriptData)
  // ... rest of your code
}
```

**After (New Drizzle Database):**
```typescript
import { createScript, getScripts } from "@/lib/database-new"

export async function POST(request: NextRequest) {
  // ... your existing code (no changes needed!)
  const scriptId = await createScript(scriptData)
  // ... rest of your code
}
```

## 🚨 Important Notes

1. **No Logic Changes**: Your existing API logic doesn't need to change
2. **Same Function Names**: All function names remain the same
3. **Same Parameters**: All function parameters remain the same
4. **Same Return Types**: All return types remain the same
5. **Type Safety**: You now get better TypeScript support

## 🔍 What to Check

After migration, verify:
- ✅ Scripts can be created and fetched
- ✅ Giveaways can be created and fetched
- ✅ User authentication still works
- ✅ All CRUD operations function properly
- ✅ No TypeScript errors

## 🆘 Troubleshooting

If you encounter issues:

1. **Import Errors**: Make sure you're importing from `@/lib/database-new`
2. **Function Not Found**: Check if the function exists in `database-new.ts`
3. **Type Errors**: The new types are more strict - check your data structures
4. **Database Connection**: Verify your Xata Lite connection string

## 🎉 Benefits After Migration

- **Type Safety**: Full TypeScript support
- **Better Performance**: Optimized SQL queries
- **Easier Debugging**: Better error messages
- **Schema Management**: Version-controlled database changes
- **Free Database**: Xata Lite is completely free

Your migration is straightforward - just update the imports and you're done! 🚀
