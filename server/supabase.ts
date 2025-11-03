import { createClient } from '@supabase/supabase-js';
import { env } from './config';

// Supabase client for additional features (real-time, storage, etc.)
export const supabase = createClient(
  env.SUPABASE_URL || '',
  env.SUPABASE_ANON_KEY || ''
);

// Export for use in other parts of the application
export default supabase;