# PowerShell Script to Update Supabase MCP Token
# Usage: .\setup-mcp-token.ps1 "your-actual-token-here"

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "🔧 Updating Supabase MCP Token Configuration..." -ForegroundColor Green

# File paths
$localMcpPath = "C:\Users\gabri\Basics\.mcp.json"
$claudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"

# Update local .mcp.json
if (Test-Path $localMcpPath) {
    Write-Host "📝 Updating local .mcp.json..." -ForegroundColor Yellow
    $content = Get-Content $localMcpPath -Raw
    $updatedContent = $content -replace "PLACEHOLDER_TOKEN_NEEDS_REPLACEMENT", $Token
    Set-Content $localMcpPath -Value $updatedContent
    Write-Host "✅ Local .mcp.json updated!" -ForegroundColor Green
} else {
    Write-Host "❌ Local .mcp.json not found at: $localMcpPath" -ForegroundColor Red
}

# Update Claude Desktop config
if (Test-Path $claudeConfigPath) {
    Write-Host "📝 Updating Claude Desktop configuration..." -ForegroundColor Yellow
    $content = Get-Content $claudeConfigPath -Raw
    $updatedContent = $content -replace "PLACEHOLDER_TOKEN_NEEDS_REPLACEMENT", $Token
    Set-Content $claudeConfigPath -Value $updatedContent
    Write-Host "✅ Claude Desktop configuration updated!" -ForegroundColor Green
} else {
    Write-Host "❌ Claude Desktop config not found at: $claudeConfigPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Token update complete!" -ForegroundColor Green
Write-Host "🔄 Please restart Claude Desktop to apply changes." -ForegroundColor Cyan
Write-Host "🧪 Test with: /mcp list-tools" -ForegroundColor Cyan