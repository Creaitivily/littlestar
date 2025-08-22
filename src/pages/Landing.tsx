import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { 
  Heart, 
  Shield, 
  Camera, 
  TrendingUp, 
  Calendar, 
  Users, 
  Lock, 
  Smartphone, 
  CheckCircle, 
  ArrowRight,
  Baby,
  Activity,
  FileText,
  Globe,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function Landing() {
  const navigate = useNavigate()
  useAuthRedirect() // Handle OAuth redirects

  const features = [
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor height, weight, and development milestones with beautiful charts and percentile tracking",
      color: "bg-sage-100 text-sage-600"
    },
    {
      icon: Heart,
      title: "Health Records",
      description: "Organize appointments, vaccinations, and medical documents in one secure place",
      color: "bg-coral-100 text-coral-600"
    },
    {
      icon: Calendar,
      title: "Daily Activities",
      description: "Track meals, sleep patterns, playtime, and learning activities with ease",
      color: "bg-peach-100 text-peach-600"
    },
    {
      icon: Camera,
      title: "Memory Book",
      description: "Capture and organize photos, videos, and special moments in beautiful timelines",
      color: "bg-cream-200 text-navy-600"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Enterprise-grade encryption with GDPR & COPPA compliance for global families",
      color: "bg-mint-100 text-mint-600"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available worldwide with culturally sensitive tools for diverse families",
      color: "bg-sage-100 text-sage-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      text: "MilestoneBee has been incredible for tracking my daughter's development. The bee theme makes it so cheerful!",
      rating: 5
    },
    {
      name: "David K.",
      text: "Love how secure and private it is. Perfect for organizing all of our child's important milestones.",
      rating: 5
    },
    {
      name: "Emma L.",
      text: "The growth charts are beautiful and the age-based activities feature is so helpful for our infant.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cream-50 via-peach-50 to-sage-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-cream-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MilestoneBee" className="w-10 h-10" />
              <span className="text-2xl font-bold text-navy-700">MilestoneBee</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-700 hover:text-coral-600">
                Login
              </Button>
              <Button className="bg-coral-500 hover:bg-coral-600 text-white shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/signup')}>
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-sage-500">
                {" "}MilestoneBee
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The most intuitive child development tracker that grows with your family. 
              Monitor growth, activities, health records, and precious memories with beautiful analytics 
              and age-appropriate insights.
            </p>
            
            <div className="flex justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/signup')}
              >
                Start Journey Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center">
                  <div className="flex flex-col items-center p-4 bg-coral-50 rounded-2xl">
                    <Baby className="w-8 h-8 text-coral-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Activities</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-sage-50 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-sage-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Growth</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-peach-50 rounded-2xl">
                    <Heart className="w-8 h-8 text-peach-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Health</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-cream-100 rounded-2xl">
                    <Camera className="w-8 h-8 text-navy-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Memories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to nurture your little one
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed by parents, for parents. Simple yet powerful tools to help you understand your child better.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Reach Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-sage-50 to-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 text-coral-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Parents Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              MilestoneBee serves families across the globe with culturally sensitive, 
              accessible parenting tools designed for modern, diverse families.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-coral-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">North America</h3>
              <p className="text-sm text-gray-600">US, Canada, Mexico</p>
            </div>
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-coral-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Europe</h3>
              <p className="text-sm text-gray-600">UK, EU, Scandinavia</p>
            </div>
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-coral-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Asia Pacific</h3>
              <p className="text-sm text-gray-600">Australia, Japan, Singapore</p>
            </div>
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-coral-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">And Growing</h3>
              <p className="text-sm text-gray-600">New regions added regularly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-coral-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Family's Privacy is Our Priority
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We understand how precious your child's data is. That's why we built MilestoneBee 
            with enterprise-grade security and privacy protection, compliant with global privacy standards.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">GDPR & COPPA compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">No data selling, ever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by parents everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of families who trust us with their most precious moments
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle key={i} className="w-4 h-4 text-coral-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is MilestoneBee really free?</AccordionTrigger>
              <AccordionContent>
                Yes! MilestoneBee is completely free for basic tracking features. We believe every parent 
                should have access to beautiful tools to track their child's journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How secure is my child's data?</AccordionTrigger>
              <AccordionContent>
                We use enterprise-grade encryption and follow strict privacy protocols. Your data is never 
                sold or shared with third parties, and you maintain complete control over your information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I export my data?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can export all your data in multiple formats (PDF, CSV, etc.) at any time. 
                Your memories and records belong to you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Does it work on mobile devices?</AccordionTrigger>
              <AccordionContent>
                Yes! MilestoneBee is fully responsive and works beautifully on phones, tablets, and desktops. 
                Track your child's milestones from anywhere.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-coral-500 to-sage-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-coral-100 mb-8">
            Join thousands of parents who are already tracking their child's beautiful moments with us.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-coral-600 hover:bg-cream-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/signup')}
          >
            Start Journey Free
            <Heart className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-coral-500 to-sage-500 rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="MilestoneBee" className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">MilestoneBee</span>
              </div>
              <p className="text-gray-400">
                Track your child's milestones, one buzz at a time 🐝
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><a href="#coppa" className="hover:text-white transition-colors">COPPA Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                Made with ❤️ for families everywhere
              </div>
              <div className="text-gray-400 text-sm">
                &copy; 2024 MilestoneBee. 
                <Link to="/admin" className="ml-2 text-xs hover:text-gray-300 underline">
                  Admin Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}