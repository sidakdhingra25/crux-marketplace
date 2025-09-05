# Migration Guide: Neon to Xata Lite with Drizzle ORM

## 🎯 What We've Accomplished

✅ **Dependencies Installed**: Drizzle ORM, PostgreSQL driver, and Drizzle Kit  
✅ **Schema Created**: Complete database schema with relations  
✅ **Database Functions**: All CRUD operations converted to Drizzle  
✅ **Configuration**: Drizzle config and database connection  
✅ **Scripts Added**: Database migration commands  

## 🚀 Next Steps

### 1. Set Up Xata Lite Database

1. Go to [xata.io](https://xata.io) and sign up
2. Create a new workspace
3. Create a new database (Xata Lite gives you 1 free database)
4. Get your database URL from the dashboard

### 2. Set Up Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy your Client ID and Client Secret

### 3. Update Environment Variables

Create or update your `.env.local` file:

```env
# Database (Xata Lite)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### 4. Generate Database Migrations

```bash
npm run db:generate
```

This will create SQL migration files in the `./drizzle` folder.

### 5. Run Migrations

```bash
npm run db:migrate
```

This will create all your tables in Xata Lite.

### 6. Update API Route Imports

Replace all imports in your API routes from:
```typescript
import { ... } from '@/lib/database'
```

To:
```typescript
import { ... } from '@/lib/database-new'
```

### 7. Test Your Application

Start your development server:
```bash
npm run dev
```

## 📁 Files Created/Modified

- `lib/schema.ts` - Drizzle schema definitions
- `lib/db.ts` - Database connection
- `lib/database-new.ts` - New database functions
- `drizzle.config.ts` - Drizzle configuration
- `package.json` - Added Drizzle scripts

## 🔧 Available Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🎉 Benefits of This Migration

- **Type Safety**: Full TypeScript support with inferred types
- **Better DX**: Auto-completion and IntelliSense
- **Schema Management**: Version-controlled schema changes
- **Free Database**: Xata Lite is completely free
- **Performance**: Optimized SQL queries
- **Relations**: Easy to work with related data

## 🚨 Important Notes

1. **Backup**: Make sure you have a backup of your current Neon database
2. **Data Migration**: You'll need to migrate your existing data manually or write a script
3. **Testing**: Test thoroughly in development before deploying
4. **Discord OAuth**: Make sure to add the correct redirect URI in Discord Developer Portal

## 🆘 Need Help?

If you encounter any issues:
1. Check the Drizzle documentation: https://orm.drizzle.team/
2. Check Xata documentation: https://xata.io/docs
3. Check Discord OAuth documentation: https://discord.com/developers/docs/topics/oauth2
4. Verify your database connection string
5. Check the migration files in the `./drizzle` folder

## 🎯 Final Checklist

- [ ] Set up Xata Lite database
- [ ] Set up Discord OAuth application
- [ ] Update environment variables
- [ ] Generate migrations
- [ ] Run migrations
- [ ] Update API route imports
- [ ] Test application
- [ ] Migrate existing data (if any)

Your migration is ready! 🚀
