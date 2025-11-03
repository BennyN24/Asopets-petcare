# Supabase Setup Guide for ASOPETS

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: ASOPETS
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:

### Required Environment Variables

Add these to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Update your DATABASE_URL to use Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

## Step 3: Update MCP Configuration

Update `.kiro/settings/mcp.json` with your Supabase credentials:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "uvx",
      "args": ["mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "https://your-project-ref.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key-here"
      },
      "disabled": false,
      "autoApprove": [
        "create_table",
        "insert_row", 
        "update_row",
        "delete_row",
        "select_rows",
        "run_sql"
      ]
    }
  }
}
```

## Step 4: Run Database Migration

After updating your environment variables:

```bash
npm run db:push
```

## Step 5: Enable Row Level Security (Optional but Recommended)

In your Supabase dashboard:
1. Go to **Authentication** → **Policies**
2. Enable RLS on your tables for better security
3. Create policies for user data access

## Features You'll Get with Supabase

- ✅ PostgreSQL database (keeps your existing schema)
- ✅ Real-time subscriptions for live updates
- ✅ Built-in file storage for pet photos
- ✅ Row Level Security for data protection
- ✅ Built-in authentication (optional replacement)
- ✅ Automatic backups
- ✅ Dashboard for database management

## Next Steps

1. Complete the setup above
2. Test the connection with `npm run dev`
3. Verify your data migrated correctly
4. Consider enabling Supabase Auth for enhanced security

## Troubleshooting

- Make sure your DATABASE_URL includes the correct password
- Verify your Supabase project is active
- Check that all environment variables are set correctly
- Ensure your IP is allowed in Supabase (usually auto-configured)