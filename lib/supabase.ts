import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://aaisjnexkvvukzqncrto.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXNqbmV4a3Z2dWt6cW5jcnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTM4ODIsImV4cCI6MjA3NDk4OTg4Mn0.WXNWjkcMYVwkQNrD56JikMXAdfo33boUcF5VOqpeQgE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
