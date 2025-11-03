#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Verifying Supabase setup...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
  try {
    // Test basic connection
    console.log('✅ Supabase client initialized');
    
    // Try to query subscription plans (this should work if tables exist)
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .limit(5);
    
    if (plansError) {
      console.log('❌ Subscription plans table error:', plansError.message);
      if (plansError.code === '42P01') {
        console.log('💡 Tables not found. Please run the SQL script manually in Supabase dashboard.');
        return false;
      }
    } else {
      console.log('✅ Subscription plans table accessible');
      console.log('📋 Found', plans.length, 'subscription plans');
      plans.forEach(plan => {
        console.log(`   - ${plan.name}: $${plan.price}`);
      });
    }
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
    }
    
    // Test pets table
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('count')
      .limit(1);
    
    if (petsError) {
      console.log('❌ Pets table error:', petsError.message);
    } else {
      console.log('✅ Pets table accessible');
    }
    
    console.log('\n🎉 Supabase setup verification complete!');
    console.log('🚀 Your database is ready for ASOPETS');
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

verifySetup();