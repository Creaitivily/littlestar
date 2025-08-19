# Little Star - Supabase MCP Server Integration Guide

This guide will help you connect your Little Star app to Supabase using the Model Context Protocol (MCP) server.

## 🌟 What is Supabase MCP?

The Model Context Protocol (MCP) allows AI assistants to directly interact with your Supabase database, enabling:
- Natural language database queries
- Automated data management
- AI-powered analytics and insights
- Seamless integration with Claude Code

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Little Star Project**: Your current app setup
4. **Claude Code**: For MCP integration

## 🚀 Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `little-star-db`
   - **Database Password**: Generate a secure password
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for setup to complete (~2 minutes)

## 🔑 Step 2: Get Your Credentials

### Project Reference ID
1. In your Supabase dashboard
2. Go to Settings → General
3. Copy your **Reference ID** (looks like: `abcdefghijklmnop`)

### Personal Access Token
1. Go to [Supabase Account Settings](https://app.supabase.com/account/tokens)
2. Click "Generate new token"
3. Name: `little-star-mcp-server`
4. Select appropriate scopes:
   - `projects.read`
   - `projects.write` (if needed)
   - `organizations.read`
5. Click "Generate token"
6. **Copy and save** the token immediately (you won't see it again)

### API Keys
1. In your project dashboard
2. Go to Settings → API
3. Copy:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: For client-side access
   - **service_role secret**: For server-side access (keep secure!)

## ⚙️ Step 3: Configure MCP Server

### For Claude Code

Create a `.claudecode/mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### For Cursor

Create a `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### For Windows Users

If you encounter issues, use CMD wrapper:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

## 🗄️ Step 4: Create Little Star Database Schema

### Tables for Little Star App

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daughters table
CREATE TABLE daughters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth records
CREATE TABLE growth_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daughter_id UUID REFERENCES daughters(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    percentile_height INTEGER,
    percentile_weight INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health records
CREATE TABLE health_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daughter_id UUID REFERENCES daughters(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('appointment', 'vaccination', 'medication', 'checkup')),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    doctor TEXT,
    description TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'missed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daughter_id UUID REFERENCES daughters(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sleep', 'meal', 'play', 'learning', 'outdoor')),
    title TEXT NOT NULL,
    duration_minutes INTEGER,
    description TEXT,
    mood TEXT CHECK (mood IN ('happy', 'neutral', 'fussy', 'excited', 'calm')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories
CREATE TABLE memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daughter_id UUID REFERENCES daughters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments
CREATE TABLE file_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    record_id UUID NOT NULL,
    record_type TEXT NOT NULL CHECK (record_type IN ('health_record', 'memory', 'activity')),
    original_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daughters ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own daughters" ON daughters FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own growth records" ON growth_records FOR ALL USING (
    daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own health records" ON health_records FOR ALL USING (
    daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own activities" ON activities FOR ALL USING (
    daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own memories" ON memories FOR ALL USING (
    daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own file attachments" ON file_attachments FOR ALL USING (
    record_id IN (
        SELECT id FROM health_records WHERE daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
        UNION
        SELECT id FROM memories WHERE daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
        UNION
        SELECT id FROM activities WHERE daughter_id IN (SELECT id FROM daughters WHERE user_id = auth.uid())
    )
);
```

## 🔒 Step 5: Security Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MCP Configuration
SUPABASE_ACCESS_TOKEN=your-personal-access-token
SUPABASE_PROJECT_REF=your-project-ref
```

### Security Best Practices

1. **Use Read-Only Mode**: Start with `--read-only` flag
2. **Project Scoping**: Always use `--project-ref` to limit access
3. **Environment Separation**: Never connect MCP to production databases
4. **Token Security**: Store tokens securely, rotate regularly
5. **Minimal Permissions**: Grant only necessary database permissions

## 🧪 Step 6: Test the Connection

### Verify MCP Server

1. Restart your AI tool (Claude Code/Cursor)
2. Check for green "connected" status
3. Try a simple query: "Show me the database schema"
4. Test with: "How many tables are in the database?"

### Test Database Operations

```sql
-- Insert test data
INSERT INTO users (id, email, full_name) VALUES 
(uuid_generate_v4(), 'test@example.com', 'Test Parent');

-- Verify connection works
SELECT COUNT(*) FROM users;
```

## 🎯 Step 7: Integration with Little Star

### Update Your App Configuration

Install Supabase client:

```bash
npm install @supabase/supabase-js
```

Create Supabase client:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 🚀 Step 8: MCP Commands You Can Use

Once connected, you can use natural language commands like:

- "Show me all daughters in the database"
- "Create a new growth record for Emma"
- "What's the average height for 3-year-olds in my database?"
- "Generate a report of activities this month"
- "Find all memories tagged with 'milestone'"
- "Show me upcoming health appointments"

## 🔧 Troubleshooting

### Common Issues

1. **Token Expired**: Regenerate your personal access token
2. **Connection Failed**: Check project reference ID
3. **Permission Denied**: Verify token scopes
4. **Windows Issues**: Use CMD wrapper configuration

### Debug Commands

```bash
# Test MCP server manually
npx @supabase/mcp-server-supabase@latest --read-only --project-ref=YOUR_REF

# Check Supabase CLI
npx supabase status
```

## 📚 Next Steps

1. **Implement Authentication**: Add Supabase Auth to your app
2. **Real-time Features**: Use Supabase realtime subscriptions
3. **File Storage**: Integrate Supabase Storage for attachments
4. **Edge Functions**: Add serverless functions for complex operations
5. **Analytics**: Create MCP-powered insights and reports

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [MCP Server GitHub](https://github.com/supabase-community/supabase-mcp)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🌟 Little Star + Supabase = Perfect Match

With this setup, your Little Star app will have:
- ✅ Secure, scalable database
- ✅ AI-powered data insights
- ✅ Real-time capabilities
- ✅ Automatic backups
- ✅ Global CDN for files
- ✅ Built-in authentication

Your daughter's precious data will be safe, organized, and easily accessible through natural language queries!