# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Little Star - Child Development Tracking App

## Project Overview
Little Star is a minimalist, privacy-focused child development tracking application built with React, TypeScript, Vite, and Supabase. It allows parents to track their children's growth, activities, health records, and memories in a secure, user-friendly interface.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom color palette (lavender, cream, mint)
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Authentication**: Supabase Auth with JWT tokens
- **Icons**: Lucide React
- **Build Tool**: Vite with Hot Module Replacement

## Key Features
- 🔐 **Secure Authentication** with Supabase Auth (email/password + Google OAuth)
- 👶 **Child Profile Management** with 4-step onboarding wizard
- 📊 **Dashboard** with personalized metrics and quick actions
- 📈 **Growth Tracking** with height/weight measurements
- 🏥 **Health Records** management
- 🎯 **Activities Tracking** (meals, sleep, play)
- 📸 **Memory Book** with photos and milestones
- 📋 **Reports** generation
- 🛡️ **Privacy-First** design with user data isolation

## Database Schema
### Core Tables
- `users` - User profiles linked to Supabase auth
- `daughters` - Child profiles with birth date/time
- `activities` - Daily activities tracking
- `growth_records` - Height/weight measurements
- `health_records` - Medical appointments and notes
- `memories` - Photos and milestone memories

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Foreign key constraints ensure data integrity

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5178
```

### Database Setup
Run in Supabase SQL Editor:
```sql
-- See database-setup.sql for complete schema
-- Key command for birth time feature:
ALTER TABLE public.daughters ADD COLUMN IF NOT EXISTS birth_time TIME;
```

### Development Server
```bash
npm run dev
```
Runs on http://localhost:5178 (or next available port)

### Build
```bash
npm run build
```
Builds TypeScript and creates production bundle with Vite

### Lint
```bash
npm run lint
```
Runs ESLint with TypeScript support, reports unused disable directives

### Preview Production Build
```bash
npm run preview
```

## Architecture Overview

### Import Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)
- Use `@/components/ui/button` instead of relative imports

### Component Architecture
- **Pages**: Main route components in `src/pages/`
- **Auth Components**: Authentication flow in `src/components/auth/`
- **UI Components**: shadcn/ui primitives in `src/components/ui/`
- **Forms**: Data entry forms in `src/components/forms/`
- **Layout**: App shell components in `src/components/layout/`

### State Management
- **AuthContext**: Centralized auth state and user profile management
- **Supabase Client**: Database operations and real-time subscriptions
- No external state management library (Redux, Zustand) - uses React Context

### Database Layer
- **Type Safety**: Full TypeScript types for all tables in `src/lib/supabase.ts`
- **RLS Policies**: Row Level Security ensures users only access their own data
- **Foreign Keys**: All child tables reference `user_id` for data isolation

## Authentication Flow
1. User signs up/logs in via Supabase Auth
2. User profile automatically created in `public.users` table
3. First-time users complete child onboarding modal
4. Child record created in `daughters` table
5. Dashboard loads with personalized content

## Child Onboarding Process
4-step wizard:
1. **Name**: Child's full name
2. **Birth Date**: Calendar date picker
3. **Birth Time**: Time picker for precise tracking
4. **Photo**: Optional profile image upload

## Critical Implementation Details

### Database Schema Changes
- When modifying schema, update both `database-setup.sql` AND TypeScript types in `src/lib/supabase.ts`
- Use `database-update-birth-time.sql` as example for adding columns
- All tables require `user_id` foreign key for RLS policies

### Authentication Flow
1. **Supabase Auth**: Handles JWT tokens and session management
2. **User Profile Creation**: Automatic creation in `public.users` table via AuthContext
3. **Child Onboarding**: First-time users must complete 4-step wizard
4. **Data Isolation**: RLS policies ensure users only see their own data

### Error Handling Patterns
- Database constraint errors are caught and handled gracefully
- Foreign key violations trigger automatic user profile creation
- All forms include validation and timeout protection
- Console logging for debugging (check browser DevTools)

### File Upload Limitations
- Image uploads currently disabled due to blob URL issues
- Supabase Storage integration planned for future enhancement

## Error Handling
- Comprehensive error logging
- User-friendly error messages
- Fallback mechanisms for database issues
- Foreign key constraint protection
- Request timeout prevention

## Security Features
- JWT token-based authentication
- Row Level Security (RLS) policies
- User data isolation
- Input validation and sanitization
- Secure password requirements (6+ characters)

## Performance Optimizations
- Vite for fast development builds
- Hot Module Replacement (HMR)
- Lazy loading of components
- Optimized bundle size
- Tree shaking for unused code

## Testing
- Browser DevTools console logging for debugging
- Error boundary implementation
- Validation testing for forms
- Database constraint testing

## Deployment Considerations
- Update environment variables for production
- Configure Supabase OAuth redirect URLs
- Set up proper domain for CORS
- Enable production build optimizations

## Known Issues & Solutions
- **Foreign Key Errors**: Automatically creates user profiles
- **Birth Time Column**: Added via database migration
- **Image Upload**: Currently disabled (blob URL issues)
- **Loading Issues**: Comprehensive timeout and error handling

## Future Enhancements
- Multiple children support
- Photo upload to Supabase Storage
- Push notifications for milestones
- Data export functionality
- Offline capability
- Mobile app version

## Support
- Check browser console for detailed error logs
- Verify database schema matches expectations
- Ensure environment variables are correctly set
- Test with clean browser session (incognito mode)

## Version History
- v1.0: Initial release with core functionality
- v1.1: Added birth time tracking
- v1.2: Enhanced error handling and user profile management

---

**Little Star** - Tracking precious moments, one milestone at a time ⭐👶✨