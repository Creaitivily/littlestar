# AnyCrawl Integration Setup Guide

## Overview
This guide explains how to set up and deploy the AnyCrawl content scraping integration for MilestoneBee. The system automatically scrapes parenting content from trusted sources and presents it to users based on their child's age.

## Features Implemented

### ✅ Core Features
- **Topic-based Content Organization**: 9 parenting topics (feeding, sleep, development, etc.)
- **Age-specific Content**: Content filtered by child's age (monthly for 0-12 months, semester-based after)
- **Quality Scoring**: AI-powered content quality assessment
- **Source Verification**: Trusted sources like AAP, Mayo Clinic, CDC
- **Content Refresh System**: Monthly automated content updates
- **Admin Dashboard**: Full content management interface
- **Search & Filtering**: Find content by topic, age, and quality

### 📊 Database Schema
```sql
-- Run this in Supabase SQL Editor
-- See: database-content-schema.sql
```

## Setup Instructions

### 1. Database Setup
1. **Run the SQL Schema**: Execute `database-content-schema.sql` in your Supabase SQL Editor
2. **Verify Tables**: Ensure the following tables are created:
   - `topic_content` - Stores scraped articles
   - `content_refresh_log` - Tracks refresh operations  
   - `user_content_preferences` - User preferences (future use)

### 2. AnyCrawl API Key Setup
1. **Get API Key**: Sign up at [AnyCrawl](https://anycrawl.dev) and get your API key
2. **Update Environment**: Add to `.env.local`:
   ```
   VITE_ANYCRAWL_API_KEY=your-anycrawl-api-key-here
   ```

### 3. Content Refresh Strategy
Since the frontend can't run cron jobs, you have several deployment options:

#### Option A: Vercel Cron Jobs (Recommended for Vercel)
```javascript
// vercel.json
{
  "functions": {
    "api/refresh-content.js": {
      "runtime": "nodejs18.x"
    }
  },
  "cron": [
    {
      "path": "/api/refresh-content",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

#### Option B: GitHub Actions (Free)
```yaml
# .github/workflows/content-refresh.yml
name: Monthly Content Refresh
on:
  schedule:
    - cron: '0 2 1 * *'  # 1st of every month at 2 AM
  workflow_dispatch:     # Manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: curl -X POST "${{ secrets.REFRESH_WEBHOOK_URL }}"
```

#### Option C: Supabase Edge Functions
```sql
-- Create a Supabase Edge Function for content refresh
SELECT cron.schedule('content-refresh', '0 2 1 * *', 'https://your-project.supabase.co/functions/v1/refresh-content');
```

## Usage Guide

### For Users
1. **Navigate to Insights**: Go to the Insights page in MilestoneBee
2. **Select Topics**: Choose interesting topics (feeding, sleep, development, etc.)
3. **View Content**: Articles are automatically filtered by your child's age
4. **Quality Filter**: Toggle high-quality content only

### For Admins
1. **Access Admin Panel**: Login to `/admin` and go to "Content" tab
2. **Monitor Content**: View statistics, refresh status, and content breakdown
3. **Manual Refresh**: Trigger immediate content updates
4. **View History**: See all refresh operations and success rates

## Content Sources

The system scrapes from trusted parenting sources:

### Medical & Professional
- **American Academy of Pediatrics (aap.org)**: Medical guidelines
- **CDC (cdc.gov)**: Health and safety information  
- **Mayo Clinic (mayoclinic.org)**: Medical advice
- **Healthy Children (healthychildren.org)**: AAP's parent resource

### Educational & Development
- **Zero to Three (zerotothree.org)**: Early development
- **Sleep Foundation (sleepfoundation.org)**: Sleep guidance
- **ASHA (asha.org)**: Speech and language development

## Technical Architecture

```
Frontend (React)
├── Insights Page (Topic Selection)
├── ContentCurationSystem (Display)
├── Admin Dashboard (Management)
└── Content Services

Backend Services
├── AnyCrawl API Client
├── Content Scraper (Topic-Age specific)
├── Content Service (Retrieval & Filtering)
└── Refresh Scheduler (Manual triggers)

Database (Supabase)
├── topic_content (Article storage)
├── content_refresh_log (Audit trail)
└── user_content_preferences (Settings)

External Services
├── AnyCrawl API (Web scraping)
├── Scheduled Jobs (Content refresh)
└── Trusted Content Sources
```

## Quality Control

### Content Quality Scoring
- **Domain Authority**: Trusted sources get higher scores
- **Content Length**: Longer articles generally score better
- **Publication Date**: Recent content preferred
- **Keyword Relevance**: Topic and age-appropriate content

### Age-Appropriate Filtering
```typescript
// Monthly precision for first year
"0-1_months", "1-2_months", ..., "11-12_months"

// Semester-based after first year  
"12-18_months", "18-24_months", "24-30_months", "30-36_months"
```

## Performance Optimizations

### Rate Limiting
- 10-second delays between topic/age scrapes
- 5 concurrent scrapers maximum
- 2-second delays between individual requests

### Content Deduplication
- URL-based duplicate detection
- Content hash comparison
- Cleanup of old content (keeps last 2 refresh cycles)

### Database Optimization
- Composite indexes on (topic, age_range, is_active)
- Materialized view for fresh content
- Quality score indexing for fast filtering

## Monitoring & Alerts

### Health Checks
- Daily content count verification
- Automatic emergency refresh for low content
- Quality distribution monitoring

### Admin Alerts
- Failed refresh notifications
- Low content warnings
- Source availability issues

## Troubleshooting

### Common Issues

1. **No Content Showing**
   - Verify AnyCrawl API key is correct
   - Check database tables were created properly
   - Run manual refresh from admin panel

2. **Refresh Failing**
   - Check API rate limits
   - Verify source website availability
   - Review error logs in admin dashboard

3. **Content Quality Issues**
   - Adjust quality thresholds in ContentService
   - Update trusted source domains
   - Review content scoring algorithm

### Debug Commands
```bash
# Check database health
npm run console -- AppInitializer.runHealthCheck()

# Manual content refresh
npm run console -- ContentRefreshScheduler.triggerManualRefresh()

# View content stats
npm run console -- ContentService.getContentStats()
```

## Scaling Considerations

### For High Traffic
- Implement Redis caching for content queries
- Use CDN for static content delivery
- Consider database read replicas for content access

### For Large Content Volumes
- Implement pagination for admin interface
- Archive old content to separate tables
- Use database partitioning by date

## Security & Compliance

### Data Privacy
- No user data sent to AnyCrawl
- Content sanitized before storage
- User preferences stored securely

### API Security
- Rate limiting prevents abuse
- API keys stored as environment variables
- Request timeout protection

## Cost Management

### AnyCrawl Usage
- ~5000 requests/month for initial content seeding
- ~1000 requests/month for regular updates
- Estimated cost: $10-20/month depending on plan

### Optimization Tips
- Batch requests where possible
- Focus on highest-quality sources first
- Implement smart refresh scheduling

## Future Enhancements

### Planned Features
- User content bookmarking/favorites
- Personalized recommendations based on reading history
- Multi-language content support
- Content ratings and feedback system

### Advanced Features
- AI-powered content summarization
- Push notifications for new relevant content
- Integration with calendar for milestone-based content
- Social features for content sharing

## Support & Maintenance

### Regular Tasks
- Monitor content refresh success rates
- Update trusted source domains as needed
- Review and adjust quality scoring parameters
- Archive old content quarterly

### Updates Required
- AnyCrawl API changes
- Source website structure changes
- New parenting topics or age ranges
- Quality scoring improvements

---

## Quick Start Checklist

- [ ] Run `database-content-schema.sql` in Supabase
- [ ] Add AnyCrawl API key to `.env.local`
- [ ] Set up automated content refresh (choose Option A, B, or C)
- [ ] Test manual refresh in admin panel
- [ ] Verify content appears in Insights page
- [ ] Configure monitoring and alerts

**Estimated Setup Time**: 2-3 hours for complete deployment

For questions or issues, refer to the troubleshooting section or check the browser console for detailed error logs.