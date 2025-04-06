import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gltoyennfzqfefxxhvog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdG95ZW5uZnpxZmVmeHhodm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MjIyNTgsImV4cCI6MjA1MjA5ODI1OH0.tey1_3HhJv9DchgIukThZQJ8hSLBfE9s8bkgCQWpT5o';

// The storage key will be 'sb-gltoyennfzqfefxxhvog-auth-token'
const defaultStorageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);