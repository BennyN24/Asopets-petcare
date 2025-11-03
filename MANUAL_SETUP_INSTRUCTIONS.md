# Manual Supabase Setup Instructions

Since there are network connectivity issues with the direct PostgreSQL connection, please follow these manual steps:

## Step 1: Create Tables in Supabase Dashboard

1. **Go to your Supabase Dashboard**

   - Visit: https://supabase.com/dashboard
   - Select your project: `gszinnwhntxzrfdxejyo`

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the SQL Script**
   - Copy the entire content from `scripts/create-tables.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

## Step 2: Verify Tables Were Created

After running the SQL script, you should see these tables in your database:

- ✅ `sessions` - For session management
- ✅ `users` - User accounts
- ✅ `pets` - Pet profiles
- ✅ `medical_records` - Medical history
- ✅ `reminders` - Vaccination/checkup reminders
- ✅ `vet_clinics` - Veterinary clinics
- ✅ `clinic_ratings` - Clinic reviews
- ✅ `subscription_plans` - Subscription tiers
- ✅ `user_subscriptions` - User subscriptions
- ✅ `scanned_pets` - QR code scanned pets

## Step 3: Test Your Application

Once the tables are created:

```bash
npm run dev
```

Your application should now connect successfully to Supabase!

## Step 4: Enable Row Level Security (Optional but Recommended)

The SQL script already enables RLS and creates basic policies. You can review and modify them in:

- Dashboard → Authentication → Policies

## Step 5: Set up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `pet-photos`
3. Make it public for easier image access
4. Set file size limit to 5MB
5. Allow image types: JPEG, PNG, WebP

## Troubleshooting

### If you get permission errors:

- Make sure you're using the Service Role Key in your environment
- Check that RLS policies are correctly configured

### If tables don't appear:

- Refresh your dashboard
- Check the SQL Editor for any error messages
- Ensure the entire SQL script was executed

### If the app can't connect:

- Verify your `.env` file has the correct credentials
- Check that your Supabase project is active
- Ensure your DATABASE_URL is correct

## Current Configuration

Your current setup:

- **Project**: gszinnwhntxzrfdxejyo
- **Region**: ap-southeast-1
- **Database**: PostgreSQL with all ASOPETS tables
- **Storage**: pet-photos bucket for images
- **Auth**: Custom authentication system (not using Supabase Auth)

## Next Steps After Manual Setup

1. ✅ Tables created manually
2. 🔄 Test connection: `npm run test:connection`
3. 🚀 Start development: `npm run dev`
4. 🧪 Test user registration and pet creation
5. 📱 Test the full application workflow

## MCP Supabase Integration

Once tables are created, the MCP Supabase server should work properly for direct database editing. The configuration is already set up in `.kiro/settings/mcp.json`.

## Support

If you encounter any issues:

1. Check the Supabase dashboard logs
2. Review the browser console for errors
3. Verify all environment variables are set correctly
4. Test individual API endpoints
