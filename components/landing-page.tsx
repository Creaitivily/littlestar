'use client';

import React, { useState } from 'react';
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
  Cloud, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Play,
  Quote,
  Sparkles,
  Baby,
  Activity,
  FileText,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Navigation from './navigation';
import Footer from './footer';
import { LoginForm } from './auth/login-form';
import { SignupForm } from './auth/signup-form';
import { SEOMeta } from './seo-meta';

interface LandingPageProps {
  className?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ className }) => {
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);

  // Features data
  const features = [
    {
      icon: TrendingUp,
      title: 'Growth Tracking',
      description: 'Beautiful charts and milestones to track your daughter\'s physical and developmental growth over time.',
      color: 'text-mint-500',
      bgColor: 'bg-mint-100',
    },
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'Keep track of appointments, vaccinations, medications, and health records in one secure place.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Calendar,
      title: 'Activity Logging',
      description: 'Record daily activities, sleep patterns, meals, and special moments with ease.',
      color: 'text-lavender-500',
      bgColor: 'bg-lavender-100',
    },
    {
      icon: Camera,
      title: 'Memory Preservation',
      description: 'Store photos, videos, and notes to create a beautiful digital scrapbook of precious memories.',
      color: 'text-cream-600',
      bgColor: 'bg-cream-100',
    },
  ];

  // Benefits data
  const benefits = [
    {
      icon: Heart,
      title: 'Peace of Mind',
      description: 'Never worry about forgetting important details or missing milestones again.',
    },
    {
      icon: Users,
      title: 'Family Sharing',
      description: 'Safely share updates with grandparents, caregivers, and family members.',
    },
    {
      icon: Cloud,
      title: 'Secure Backup',
      description: 'Your precious memories are safely stored and backed up in the cloud.',
    },
    {
      icon: Smartphone,
      title: 'Easy Access',
      description: 'Access your data anytime, anywhere from your phone, tablet, or computer.',
    },
  ];

  // Security features
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Bank-Level Encryption',
      description: 'All data is encrypted with industry-standard security protocols.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data belongs to you. We never sell or share your personal information.',
    },
    {
      icon: Award,
      title: 'COPPA Compliant',
      description: 'Fully compliant with children\'s privacy protection regulations.',
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'Meets international data protection and privacy standards.',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Mother of Emma (3 years)',
      content: 'Little Star has been a game-changer for our family. I love how I can track Emma\'s milestones and share them with her grandparents who live far away.',
      avatar: '/images/testimonial-1.jpg',
      rating: 5,
    },
    {
      name: 'Maria Rodriguez',
      role: 'Mother of Sofia (18 months)',
      content: 'The growth tracking feature is amazing! It\'s so reassuring to see Sofia\'s progress visualized in beautiful charts. The pediatrician loves the detailed records too.',
      avatar: '/images/testimonial-2.jpg',
      rating: 5,
    },
    {
      name: 'Jennifer Chen',
      role: 'Mother of Lily (5 years)',
      content: 'I wish I had this app when Lily was born. The memory preservation feature is wonderful - it\'s like a digital baby book that I can access anywhere.',
      avatar: '/images/testimonial-3.jpg',
      rating: 5,
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Is Little Star free to use?',
      answer: 'Yes! Little Star offers a comprehensive free plan that includes basic tracking features. We also offer premium plans with additional features like unlimited photo storage and advanced analytics.',
    },
    {
      question: 'How secure is my daughter\'s data?',
      answer: 'Security is our top priority. We use bank-level encryption, are COPPA compliant, and follow strict data protection protocols. Your data is never sold or shared with third parties.',
    },
    {
      question: 'Can I share data with family members?',
      answer: 'Absolutely! You can safely invite grandparents, caregivers, and other family members to view specific information while maintaining full control over what they can see.',
    },
    {
      question: 'What if I want to export my data?',
      answer: 'You own your data completely. You can export all your information at any time in standard formats, ensuring you never lose access to your precious memories.',
    },
    {
      question: 'Does it work offline?',
      answer: 'Yes! Little Star works offline and automatically syncs when you reconnect to the internet, so you never miss capturing important moments.',
    },
    {
      question: 'Is there customer support?',
      answer: 'We offer comprehensive customer support through email, chat, and our help center. Our parent-friendly support team is here to help you every step of the way.',
    },
  ];

  const handleAuthSubmit = async (data: any) => {
    console.log('Auth data:', data);
    // Handle authentication
    setShowAuthModal(null);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOMeta />
      <div className={cn('min-h-screen bg-gradient-to-b from-lavender-50 via-cream-50 to-mint-50', className)}>
        {/* Navigation */}
        <Navigation
          onLoginClick={() => setShowAuthModal('login')}
          onSignupClick={() => setShowAuthModal('signup')}
        />

        {/* Hero Section */}
        <section className="relative pt-20 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left animate-fade-in">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
                  <Badge className="bg-pink-200 text-pink-800 hover:bg-pink-300">
                    <Star className="h-3 w-3 mr-1" fill="currentColor" />
                    Trusted by 10,000+ families
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-display font-bold text-gradient mb-6 leading-tight">
                  Track Your Little Star's Journey
                </h1>
                
                <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  The most gentle and secure way to track your daughter's growth, health, 
                  activities, and precious memories. Designed by parents, for parents.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button
                    size="lg"
                    onClick={() => setShowAuthModal('signup')}
                    className="button-gradient text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg"
                  >
                    Start Tracking for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection('demo')}
                    className="border-lavender-300 text-lavender-700 hover:bg-lavender-100 px-8 py-4 text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Secure & private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>Made for families</span>
                  </div>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className="relative animate-slide-in-right">
                <div className="relative bg-white rounded-3xl shadow-large p-8 border border-lavender-200">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Star className="h-8 w-8 text-lavender-500 animate-sparkle" fill="currentColor" />
                        <Heart className="h-3 w-3 text-pink-400 absolute -top-1 -right-1 animate-pulse" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gradient">Emma's Journey</h3>
                        <p className="text-sm text-muted-foreground">3 years, 2 months old</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-mint-100 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-mint-600" />
                          <div>
                            <p className="font-medium text-mint-800">Height: 37.5 inches</p>
                            <p className="text-sm text-mint-600">Growing beautifully! 📈</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-pink-100 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-5 w-5 text-pink-600" />
                          <div>
                            <p className="font-medium text-pink-800">Vaccination: Up to date</p>
                            <p className="text-sm text-pink-600">Next checkup: June 15th</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-lavender-100 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Camera className="h-5 w-5 text-lavender-600" />
                          <div>
                            <p className="font-medium text-lavender-800">New Memory Added</p>
                            <p className="text-sm text-lavender-600">First day at preschool! 🎒</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-pink-200 rounded-full p-3 animate-float">
                  <Heart className="h-6 w-6 text-pink-600" fill="currentColor" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-mint-200 rounded-full p-3 animate-float" style={{ animationDelay: '1s' }}>
                  <Star className="h-6 w-6 text-mint-600" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Decorations */}
          <div className="absolute top-1/4 left-1/12 w-2 h-2 bg-pink-300 rounded-full animate-sparkle opacity-60"></div>
          <div className="absolute top-1/3 right-1/6 w-3 h-3 bg-lavender-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-mint-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '4s' }}></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
                Everything You Need to Track Her Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools designed specifically for tracking your daughter's 
                development, health, and precious moments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={index}
                    className="card-gradient border-lavender-200 hover:shadow-medium transition-all duration-300 group"
                  >
                    <CardHeader className="text-center">
                      <div className={cn('inline-flex p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform', feature.bgColor)}>
                        <IconComponent className={cn('h-8 w-8', feature.color)} />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
                  Why Parents Love Little Star
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of families who trust Little Star to keep their 
                  most precious memories safe and organized.
                </p>
                
                <div className="space-y-6">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 bg-lavender-100 rounded-xl">
                          <IconComponent className="h-6 w-6 text-lavender-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-large p-8 border border-lavender-200">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>10,000+ Happy Families</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                        <Baby className="h-6 w-6 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-mint-100 rounded-lg p-3">
                          <p className="text-sm font-medium text-mint-800">
                            "First steps captured! So grateful for this app."
                          </p>
                          <p className="text-xs text-mint-600 mt-1">- Sarah, mom of Emma</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 justify-end">
                      <div className="flex-1">
                        <div className="bg-lavender-100 rounded-lg p-3">
                          <p className="text-sm font-medium text-lavender-800">
                            "The pediatrician loves the detailed records!"
                          </p>
                          <p className="text-xs text-lavender-600 mt-1">- Maria, mom of Sofia</p>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-lavender-200 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-lavender-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-16 lg:py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
                Your Data, Safe & Secure
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We understand how precious your daughter's information is. That's why we've 
                built Little Star with the highest security and privacy standards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={index}
                    className="text-center card-gradient border-lavender-200 hover:shadow-medium transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4 mx-auto">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
                Loved by Families Everywhere
              </h2>
              <p className="text-xl text-muted-foreground">
                See what parents are saying about their Little Star experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="card-gradient border-lavender-200 hover:shadow-medium transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-lavender-400 mb-4" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-lavender-200 text-lavender-800">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 lg:py-24 bg-white/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about Little Star.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg border border-lavender-200 px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-lavender-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-lavender-200 via-mint-200 to-pink-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Star className="h-16 w-16 text-lavender-600 animate-sparkle" fill="currentColor" />
                <Heart className="h-6 w-6 text-pink-500 absolute -top-2 -right-2 animate-pulse" fill="currentColor" />
                <Sparkles className="h-4 w-4 text-mint-500 absolute -bottom-1 -left-1 animate-sparkle" style={{ animationDelay: '1s' }} />
              </div>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-gradient mb-6">
              Start Your Little Star's Journey Today
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Little Star to preserve their most 
              precious memories. Start tracking your daughter's journey for free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowAuthModal('signup')}
                className="button-gradient text-white hover:opacity-90 transition-opacity px-8 py-4 text-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAuthModal('login')}
                className="bg-white/80 border-white text-foreground hover:bg-white px-8 py-4 text-lg"
              >
                Sign In
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever plan available • Start in 30 seconds
            </p>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Auth Modals */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setShowAuthModal(null)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
                aria-label="Close modal"
              >
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {showAuthModal === 'login' ? (
                <LoginForm
                  onSubmit={handleAuthSubmit}
                  onSignupClick={() => setShowAuthModal('signup')}
                  onForgotPasswordClick={() => {
                    // Handle forgot password
                    console.log('Forgot password clicked');
                  }}
                />
              ) : (
                <SignupForm
                  onSubmit={handleAuthSubmit}
                  onLoginClick={() => setShowAuthModal('login')}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;