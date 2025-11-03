-- ASOPETS Database Schema for Supabase
-- Run this in your Supabase SQL Editor

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
  age INTEGER, -- Age in months for precise tracking
  microchip_id VARCHAR,
  birthmarks TEXT,
  image_url VARCHAR,
  share_token VARCHAR(12) UNIQUE, -- Unique token for shareable links
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL, -- vaccine, deworming, treatment, surgery, checkup
  title VARCHAR NOT NULL, -- e.g., "Rabies Vaccination", "Annual Checkup"
  description TEXT,
  date_administered DATE NOT NULL,
  next_due_date DATE,
  veterinarian VARCHAR,
  clinic VARCHAR,
  batch_number VARCHAR,
  weight VARCHAR, -- pet weight in kg at time of treatment
  cost VARCHAR,
  notes TEXT,
  image_url VARCHAR, -- for certificates/records
  attachments TEXT[], -- multiple photo attachments
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_sms BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders table for notifications
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  medical_record_id INTEGER REFERENCES medical_records(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL, -- vaccine, deworming, treatment, checkup
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
  type VARCHAR DEFAULT 'general', -- general, emergency, specialty, 24hour
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
  rating INTEGER NOT NULL, -- 1-5 stars
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL, -- "Basic", "Premium 3GB", "Premium Unlimited"
  price NUMERIC(10, 2) NOT NULL,
  storage_limit INTEGER, -- in MB, null for unlimited
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR NOT NULL DEFAULT 'active', -- active, cancelled, expired
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  payment_method VARCHAR, -- stripe, gcash, etc
  payment_id VARCHAR, -- external payment reference
  storage_used INTEGER DEFAULT 0, -- in MB
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scanned pets table for persistent storage of QR scanned pet profiles
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

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, storage_limit, features) VALUES
('Basic', 0.00, 100, '{"pets": 3, "records_per_pet": 50, "support": "community"}'),
('Premium 3GB', 9.99, 3072, '{"pets": "unlimited", "records_per_pet": "unlimited", "support": "email", "advanced_features": true}'),
('Premium Unlimited', 19.99, NULL, '{"pets": "unlimited", "records_per_pet": "unlimited", "support": "priority", "advanced_features": true, "api_access": true}')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_clinic_ratings_clinic_id ON clinic_ratings(clinic_id);
CREATE INDEX IF NOT EXISTS idx_scanned_pets_user_id ON scanned_pets(user_id);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scanned_pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own pets" ON pets FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own pets" ON pets FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own pets" ON pets FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own pets" ON pets FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own pet medical records" ON medical_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own pet medical records" ON medical_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can update own pet medical records" ON medical_records FOR UPDATE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own pet medical records" ON medical_records FOR DELETE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid()::text)
);

-- Similar policies for reminders
CREATE POLICY "Users can view own pet reminders" ON reminders FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own pet reminders" ON reminders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can update own pet reminders" ON reminders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()::text)
);
CREATE POLICY "Users can delete own pet reminders" ON reminders FOR DELETE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()::text)
);

-- Policies for clinic ratings
CREATE POLICY "Users can view all clinic ratings" ON clinic_ratings FOR SELECT TO authenticated;
CREATE POLICY "Users can insert own clinic ratings" ON clinic_ratings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own clinic ratings" ON clinic_ratings FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own clinic ratings" ON clinic_ratings FOR DELETE USING (auth.uid()::text = user_id);

-- Policies for scanned pets
CREATE POLICY "Users can view own scanned pets" ON scanned_pets FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own scanned pets" ON scanned_pets FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own scanned pets" ON scanned_pets FOR DELETE USING (auth.uid()::text = user_id);

-- Allow public read access to vet clinics
CREATE POLICY "Anyone can view vet clinics" ON vet_clinics FOR SELECT TO authenticated;

-- Allow public read access to subscription plans
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT TO authenticated;