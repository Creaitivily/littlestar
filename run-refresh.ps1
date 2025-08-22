# PowerShell script to run content refresh with environment variables
$env:VITE_SUPABASE_URL="https://ctiewkuervrxlajpjaaz.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWV3a3VlcnZyeGxhanBqYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQxNjQsImV4cCI6MjA3MTEzMDE2NH0.av5CL8gcxL79C2zCxMSi4icCTAA6de2Cu81g5M7tzRo"
$env:VITE_ANYCRAWL_API_KEY="ac-a7139fcf0f654d9672083db8b1a03"

Write-Host "Starting content refresh..." -ForegroundColor Green
node scripts/comprehensive-refresh.js
Write-Host "Content refresh completed!" -ForegroundColor Green