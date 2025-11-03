#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Creating ASOPETS database schema in Supabase...');

const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Session storage table (mandatory for session management)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- User storage table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  phone VARCHAR,
  address TEXT,
  city VARCHAR,
  country VARCHAR(100) DEFAULT 'Philippines',
  date_of_birth DATE,
  emergency_contact VARCHAR,
  emergency_phone VARCHAR,
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true, "reminders": true}',
  is_email_confirmed BOOLEAN DEFAULT false,
  email_confirmation_token VARCHAR,
  email_confirmation_expires TIMESTAMP,
  password_reset_token VARCHAR,
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  breed VARCHAR,
  date_of_birth DATE,
  age INTEGER,
  microchip_id VARCHAR,
  birthmarks TEXT,
  image_url VARCHAR,
  share_token VARCHAR(12) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  date_administered DATE NOT NULL,
  next_due_date DATE,
  veterinarian VARCHAR,
  clinic VARCHAR,
  batch_number VARCHAR,
  weight VARCHAR,
  cost VARCHAR,
  notes TEXT,
  image_url VARCHAR,
  attachments TEXT[],
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_sms BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  medical_record_id INTEGER REFERENCES medical_records(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  due_date DATE NOT NULL,
  is_overdue BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vet clinics table
CREATE TABLE IF NOT EXISTS vet_clinics (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  type VARCHAR DEFAULT 'general',
  hours TEXT,
  description TEXT,
  website VARCHAR,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  average_rating NUMERIC(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clinic ratings table
CREATE TABLE IF NOT EXISTS clinic_ratings (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinic_id INTEGER NOT NULL REFERENCES vet_clinics(id) ON DELETE CASCADE,
  medical_record_id INTEGER REFERENCES medical_records(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  storage_limit INTEGER,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR NOT NULL DEFAULT 'active',
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  payment_method VARCHAR,
  payment_id VARCHAR,
  storage_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scanned pets table
CREATE TABLE IF NOT EXISTS scanned_pets (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  pet_id TEXT NOT NULL,
  owner_id TEXT,
  type TEXT NOT NULL DEFAULT 'pet_profile',
  name TEXT,
  pet_name TEXT,
  category TEXT,
  breed TEXT,
  date_of_birth TEXT,
  age INTEGER,
  image_url TEXT,
  microchip_id TEXT,
  birthmarks TEXT,
  medical_record_count INTEGER DEFAULT 0,
  last_updated TEXT,
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_clinic_ratings_clinic_id ON clinic_ratings(clinic_id);
CREATE INDEX IF NOT EXISTS idx_scanned_pets_user_id ON scanned_pets(user_id);
`;

const insertPlansSQL = `
-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, storage_limit, features) VALUES
('Basic', 0.00, 100, '{"pets": 3, "records_per_pet": 50, "support": "community"}'),
('Premium 3GB', 9.99, 3072, '{"pets": "unlimited", "records_per_pet": "unlimited", "support": "email", "advanced_features": true}'),
('Premium Unlimited', 19.99, NULL, '{"pets": "unlimited", "records_per_pet": "unlimited", "support": "priority", "advanced_features": true, "api_access": true}')
ON CONFLICT DO NOTHING;
`;

try {
  // Create tables
  console.log('📋 Creating database tables...');
  const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
  
  if (createError) {
    console.error('❌ Error creating tables:', createError.message);
    // Try using the SQL editor approach
    console.log('🔧 Trying alternative approach...');
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'pets', 'medical_records']);
    
    if (error) {
      console.log('⚠️  Could not check existing tables. Please run the SQL manually.');
    } else {
      console.log('📋 Existing tables:', data.map(t => t.table_name));
    }
  } else {
    console.log('✅ Tables created successfully');
  }

  // Insert default subscription plans
  console.log('📦 Inserting default subscription plans...');
  const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertPlansSQL });
  
  if (insertError) {
    console.log('⚠️  Could not insert subscription plans:', insertError.message);
  } else {
    console.log('✅ Default subscription plans inserted');
  }

  // Test table access
  console.log('🧪 Testing table access...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (usersError) {
    console.log('⚠️  Table access test failed:', usersError.message);
    console.log('💡 You may need to run the SQL script manually in your Supabase dashboard');
  } else {
    console.log('✅ Tables are accessible');
  }

  console.log('\n🎉 Database setup complete!');
  console.log('🚀 You can now run: npm run dev');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n💡 Manual setup required:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Open SQL Editor');
  console.log('3. Run the script from scripts/create-tables.sql');
}