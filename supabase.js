// supabase.js

// 🚨 SUBSTITUA PELAS SUAS CHAVES DO SUPABASE 🚨
const SUPABASE_URL = 'https://ssugymxninzkvheburki.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdWd5bXhuaW56a3ZoZWJ1cmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzAyMjUsImV4cCI6MjA3OTUwNjIyNX0.kvzsbowBW_e7y9Du6smip8eewi8tukTiAHdix3GFL5A';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
