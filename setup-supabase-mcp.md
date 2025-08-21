# 🚀 Supabase MCP Setup Instructions

## ✅ Configuration Status
- **Project Reference**: `ctiewkuervrxlajpjaaz` ✅ 
- **MCP Server Package**: `@supabase/mcp-server-supabase@latest` ✅ Installed
- **Local .mcp.json**: ✅ Created
- **Claude Desktop Config**: ✅ Updated
- **Personal Access Token**: ⚠️ **NEEDS TO BE CREATED**

## 🔑 Step 1: Create Supabase Personal Access Token

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/account/tokens
2. **Click "Generate new token"**
3. **Name it**: `Claude-MCP-MilestoneBee`
4. **Copy the generated token** (you'll only see it once!)

## 🔧 Step 2: Update Configuration Files

### Update Local Project Configuration
Edit: `C:\Users\gabri\Basics\.mcp.json`

Replace `PLACEHOLDER_TOKEN_NEEDS_REPLACEMENT` with your actual token:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=ctiewkuervrxlajpjaaz"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACTUAL_TOKEN_HERE"
      }
    }
  }
}
```

### Update Claude Desktop Configuration
Edit: `C:\Users\gabri\AppData\Roaming\Claude\claude_desktop_config.json`

Find the `supabase-milestonebee` section and replace the token there too.

## 🔄 Step 3: Restart Claude Desktop

After updating both files:
1. **Close Claude Desktop completely**
2. **Restart Claude Desktop**
3. **Check if the MCP server is connected**

## 🧪 Step 4: Test the Connection

In a new Claude conversation, try using the `/mcp` command:

```
/mcp list-tools
```

You should see Supabase tools available, including:
- `supabase_sql_query` - Execute read-only SQL queries
- `supabase_get_table_info` - Get table schema information
- `supabase_list_tables` - List all tables in your database

## 📋 Available MCP Tools for MilestoneBee

Once connected, you can use these commands:

### Query Database
```
/mcp supabase_sql_query "SELECT * FROM public.users LIMIT 5"
```

### Check Table Structure
```
/mcp supabase_get_table_info "public.users"
```

### List All Tables
```
/mcp supabase_list_tables
```

### Get User Settings
```
/mcp supabase_sql_query "SELECT country, emergency_contact_numbers FROM public.user_settings WHERE user_id = 'some-uuid'"
```

## 🛡️ Security Features

- **Read-only mode**: Prevents accidental data modification
- **Project-scoped**: Only accesses your MilestoneBee project
- **Token-based**: Secure authentication with personal access token

## 🔍 Troubleshooting

### If MCP doesn't appear:
1. Check that both configuration files have the correct token
2. Restart Claude Desktop completely
3. Verify the project reference is correct: `ctiewkuervrxlajpjaaz`

### If queries fail:
1. Check your Supabase project is active
2. Verify the personal access token has correct permissions
3. Ensure Row Level Security policies allow access

### Check MCP Status:
```
/mcp list-servers
```

Should show `supabase-milestonebee` as connected.

## 🎯 What This Enables

With Supabase MCP connected, Claude can:
- Query your MilestoneBee database directly
- Help analyze user data patterns
- Suggest database optimizations
- Debug SQL queries
- Generate reports from your data
- Assist with database migrations
- Provide insights about user behavior

## 📊 Example Queries You Can Ask Claude

Once MCP is working:

> "Show me the most common activity types in my database"
> 
> "What countries do my users most often select?"
> 
> "Check if all users have settings records"
> 
> "Show me the database schema for the daughters table"
> 
> "Generate a report of user growth over time"

## ✅ Final Checklist

- [ ] Personal Access Token created in Supabase
- [ ] Token added to `.mcp.json`
- [ ] Token added to Claude Desktop config
- [ ] Claude Desktop restarted
- [ ] `/mcp list-tools` shows Supabase tools
- [ ] Test query works successfully

Once all items are checked, your Supabase MCP integration is complete! 🎉