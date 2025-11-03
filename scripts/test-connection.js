#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import postgres from 'postgres';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL;

console.log('🔍 Testing Supabase connection...');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('DATABASE_URL:', databaseUrl?.replace(/:[^:@]*@/, ':****@'));

// Test Supabase client connection
try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test a simple query
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.log('⚠️  Supabase client error:', error.message);
    if (error.code === '42P01') {
      console.log('✅ Connection successful, but tables don\'t exist yet');
    }
  } else {
    console.log('✅ Supabase client connection successful');
  }
} catch (error) {
  console.error('❌ Supabase client connection failed:', error.message);
}

// Test direct PostgreSQL connection
try {
  console.log('\n🔍 Testing direct PostgreSQL connection...');
  const sql = postgres(databaseUrl);
  
  // Test connection
  const result = await sql`SELECT version()`;
  console.log('✅ PostgreSQL connection successful');
  console.log('Database version:', result[0].version);
  
  // Check if tables exist
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'pets', 'medical_records')
  `;
  
  console.log('📋 Existing tables:', tables.map(t => t.table_name));
  
  if (tables.length === 0) {
    console.log('⚠️  No ASOPETS tables found. You need to create them.');
    console.log('💡 Run the SQL script in scripts/create-tables.sql in your Supabase dashboard');
  }
  
  await sql.end();
  
} catch (error) {
  console.error('❌ PostgreSQL connection failed:', error.message);
}

console.log('\n🎯 Next steps:');
console.log('1. If connection is successful but no tables exist:');
console.log('   - Go to your Supabase dashboard');
console.log('   - Open SQL Editor');
console.log('   - Run the script from scripts/create-tables.sql');
console.log('2. Then try: npm run dev');