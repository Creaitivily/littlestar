import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Star, 
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
  Play,
  Baby,
  Activity,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream-50 to-mint-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-lavender-500" />
              <span className="text-xl font-bold text-gray-800">Little Star</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-lavender-300 hover:bg-lavender-400 text-gray-800" onClick={() => navigate('/signup')}>
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Star className="w-20 h-20 text-lavender-400 mx-auto mb-6 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Track Your Little Star's
            <span className="block text-lavender-600">Beautiful Journey</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A minimalist, secure app to organize and cherish your daughter's growth, 
            health records, activities, and precious memories - all in one beautiful place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-lavender-300 hover:bg-lavender-400 text-gray-800 text-lg px-8 py-4"
              onClick={() => navigate('/signup')}
            >
              Start Tracking Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => alert('Demo video coming soon!')}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✨ Free forever • 🔒 Privacy first • 📱 Works on all devices
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Track Your Little Star
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beautifully organized tools to capture every precious moment and milestone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-lavender-50 border-lavender-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-lavender-600 mb-4" />
                <CardTitle className="text-gray-800">Growth Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor height, weight, and development milestones with beautiful charts and percentile tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-mint-50 border-mint-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-mint-600 mb-4" />
                <CardTitle className="text-gray-800">Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize appointments, vaccinations, and medical documents in one secure place.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-pink-50 border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-12 h-12 text-pink-600 mb-4" />
                <CardTitle className="text-gray-800">Daily Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track meals, sleep patterns, playtime, and learning activities with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cream-100 border-cream-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Camera className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle className="text-gray-800">Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Capture and organize photos, videos, and special moments in beautiful timelines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-lavender-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Family's Privacy is Our Priority
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We understand how precious your daughter's data is. That's why we built Little Star 
            with enterprise-grade security and privacy protection.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">COPPA compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">No data selling</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is Little Star really free?</AccordionTrigger>
              <AccordionContent>
                Yes! Little Star is completely free for basic tracking features. We believe every parent 
                should have access to beautiful tools to track their child's journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How secure is my daughter's data?</AccordionTrigger>
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
                Yes! Little Star is fully responsive and works beautifully on phones, tablets, and desktops. 
                Track your little star's journey from anywhere.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-lavender-100 to-mint-100">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="w-16 h-16 text-lavender-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Start Your Little Star's Journey Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of parents who trust Little Star to organize and cherish 
            their daughter's most precious moments.
          </p>
          <Button 
            size="lg" 
            className="bg-lavender-300 hover:bg-lavender-400 text-gray-800 text-xl px-12 py-6"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
            <Star className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-lavender-400" />
                <span className="text-lg font-bold">Little Star</span>
              </div>
              <p className="text-gray-400">
                Track your little star's beautiful journey with love and care.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><a href="#coppa" className="hover:text-white">COPPA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            {/* Medical Disclaimer */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Important Medical Disclaimer</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Little Star's AI Health Assistant provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always consult your pediatrician or qualified healthcare provider for personalized medical guidance regarding your child's health. 
                    For medical emergencies, call 911 immediately. This service cannot replace professional medical care.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Little Star. Made with ❤️ for families everywhere.</p>
              <div className="mt-2">
                <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-400 underline">
                  Admin Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}