# ⭐ Little Star - Child Development Tracking App

> Professional child development tracking with AI-powered health guidance

A modern, privacy-focused web application for parents to track their children's growth, health, activities, and milestones with intelligent AI assistance.

## ✨ Features

### 👶 **Child Development Tracking**
- **Growth Monitoring** - Height, weight, BMI with CDC percentile calculations
- **Health Records** - Vaccinations, appointments, medical notes
- **Activity Logging** - Meals, sleep, play with mood tracking
- **Milestone Tracking** - Motor, language, cognitive, social development
- **Memory Book** - Photos and special moments

### 🤖 **AI Health Assistant**
- **Evidence-Based Guidance** - CDC, WHO, AAP guidelines only
- **Cost-Optimized** - 85% cost reduction through local processing
- **Emergency Detection** - Immediate safety alerts for urgent symptoms
- **Child-Specific Context** - Personalized advice using actual health data
- **Safety-First Design** - "I don't know" over hallucination

### 🔒 **Privacy & Security**
- **End-to-End Privacy** - No data sharing, full user control
- **Row Level Security** - Database-level access control
- **JWT Authentication** - Secure user sessions
- **COPPA Compliant** - Child privacy protection standards

### 📱 **User Experience**
- **Mobile-Responsive** - Works perfectly on all devices
- **Intuitive Design** - Clean, family-friendly interface
- **Real-Time Updates** - Instant synchronization across devices
- **Offline-Ready** - Works without internet connection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenRouter API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Creaitivily/littlestar.git
cd littlestar
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Set up the database**
- Create a Supabase project
- Run `database-setup.sql` in SQL Editor
- Run `database-health-ai-assistant.sql` for AI features

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenRouter API with multi-model fallback
- **Charts**: Recharts for growth visualization
- **Routing**: React Router for navigation

## 📊 AI System Architecture

### Cost-Optimized Processing
- **70% Local Processing** - Common health questions answered locally
- **25% Compressed Context** - Standard queries with minimal API usage  
- **5% Full Context** - Complex medical reasoning when needed

### Multi-Model Fallback
1. **Primary**: Llama-3.1-8B ($0.18/1M tokens) - Cost-efficient
2. **Fallback**: Claude-3-Haiku ($0.25/1M tokens) - Complex reasoning
3. **Emergency**: GPT-4o-mini ($0.15/1M tokens) - Safety-critical queries

### Safety Features
- **Emergency Detection** - Pattern recognition for urgent symptoms
- **Professional Referrals** - Always recommend pediatrician consultation
- **Evidence-Based Only** - No speculation or unverified information
- **Medical Disclaimers** - Clear legal compliance

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── forms/          # Data entry forms
│   ├── health/         # Health tracking components
│   ├── layout/         # App layout and navigation
│   └── ui/             # shadcn/ui components
├── pages/              # Application pages/routes
├── lib/                # Utilities and services
├── contexts/           # React context providers
├── chatbotprompts/     # AI system prompts
└── data/               # Mock data and constants
```

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SITE_URL=http://localhost:5173

# AI Configuration
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_AI_DAILY_COST_LIMIT_CENTS=100
```

### Database Setup
1. Run `database-setup.sql` for core functionality
2. Run `database-health-ai-assistant.sql` for AI features
3. Configure authentication providers in Supabase dashboard

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting (via ESLint)
- **Tailwind CSS** - Utility-first styling

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Add components in appropriate directories
3. Update types in `lib/supabase.ts` if needed
4. Add database migrations if required
5. Test thoroughly before submitting PR

## 🚀 Deployment

### Recommended: Vercel
1. Connect GitHub repository to Vercel
2. Add environment variables in dashboard
3. Deploy automatically on push to main

### Alternative: Netlify
1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. Configure environment variables

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📈 Performance

### Bundle Optimization
- **Tree Shaking** - Unused code eliminated
- **Code Splitting** - Components loaded on demand
- **Asset Optimization** - Images and fonts optimized

### Database Performance
- **Indexed Queries** - Fast data retrieval
- **RLS Policies** - Secure, performant access control
- **Real-time Updates** - Efficient WebSocket connections

### AI Cost Management
- **Daily Limits** - Prevent unexpected costs
- **Usage Tracking** - Monitor API consumption
- **Smart Fallbacks** - Cheaper models when possible

## 🔒 Security

### Data Protection
- **Row Level Security** - Database-level access control
- **JWT Authentication** - Secure, stateless sessions
- **Input Validation** - Prevent injection attacks
- **HTTPS Enforced** - Encrypted data transmission

### Privacy Compliance
- **No Data Sharing** - User data never shared with third parties
- **User Control** - Complete data ownership and deletion rights
- **COPPA Compliance** - Child privacy protection standards
- **Medical Disclaimers** - Clear liability protections

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Update documentation for new features
- Ensure all tests pass
- Maintain code coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check `DEPLOYMENT_GUIDE.md` for setup help
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

### Common Issues
- **Build Errors**: Ensure Node.js 18+ and all dependencies installed
- **Database Issues**: Verify Supabase setup and RLS policies
- **AI Errors**: Check OpenRouter API key and usage limits
- **OAuth Issues**: Verify Google Cloud Console configuration

## 🎯 Roadmap

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Pediatrician sharing features
- [ ] Offline-first architecture

### Version 1.x
- [ ] Additional health tracking categories
- [ ] Improved AI model fine-tuning
- [ ] Enhanced data visualization
- [ ] Bulk data import/export
- [ ] Family sharing features

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and authentication
- **OpenRouter** - AI model access and management
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **CDC/WHO** - Pediatric health guidelines and data

---

**Built with ❤️ for families everywhere**

*Little Star helps parents track their children's development journey with professional tools and AI-powered insights.*

[🌟 Star this repo](https://github.com/Creaitivily/littlestar) if you find it useful!