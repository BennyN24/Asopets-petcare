#!/usr/bin/env node

/**
 * Supabase Setup Script for ASOPETS
 * This script helps set up your database schema and initial data in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
  console.log('Please check your .env file and SUPABASE_SETUP.md guide');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabase() {
  console.log('🚀 Setting up Supabase for ASOPETS...');

  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📋 Tables not found. Please run: npm run db:push');
      console.log('This will create all necessary tables using your Drizzle schema.');
    } else if (error) {
      console.error('❌ Connection error:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('✅ Database tables are ready');
    }

    // Enable Row Level Security (optional)
    console.log('🔒 Consider enabling Row Level Security in your Supabase dashboard');
    console.log('   Go to Authentication → Policies to set up data access rules');

    // Storage setup
    console.log('📁 Setting up storage bucket for pet photos...');
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const petPhotosBucket = buckets?.find(bucket => bucket.name === 'pet-photos');
    
    if (!petPhotosBucket) {
      const { data: bucket, error: bucketError } = await supabase.storage.createBucket('pet-photos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (bucketError) {
        console.log('⚠️  Could not create pet-photos bucket:', bucketError.message);
        console.log('   You can create it manually in the Supabase dashboard');
      } else {
        console.log('✅ Created pet-photos storage bucket');
      }
    } else {
      console.log('✅ pet-photos storage bucket already exists');
    }

    console.log('\n🎉 Supabase setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Test your application');
    console.log('3. Check the Supabase dashboard for real-time data');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupSupabase();