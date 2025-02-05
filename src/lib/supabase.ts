import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://kbgohzzsxbsfmfuxkyao.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZ29oenpzeGJzZm1mdXhreWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTY4NjksImV4cCI6MjA1NDI3Mjg2OX0.IDDwuuQTXdGbuk1Ib5NUuYpOt5eyao1lsRkFgk2F6Sc';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);