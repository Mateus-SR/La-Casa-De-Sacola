import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient("https://iuyaztuvzhtlkthoacac.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eWF6dHV2emh0bGt0aG9hY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTk5OTIsImV4cCI6MjA5MDUzNTk5Mn0.ep_Fh8a8hkK_7hAvzBnisNBPT8aRbz-hZHlvU49ed-s")