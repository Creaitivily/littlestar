'use client';

import React from 'react';
import { Star, Heart, Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Bug Reports', href: '/bugs' },
      { label: 'Feature Requests', href: '/features' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'COPPA Compliance', href: '/coppa' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/littlestarapp', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/littlestarapp', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/littlestarapp', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/littlestarapp', label: 'YouTube' },
  ];

  const trustBadges = [
    {
      icon: Shield,
      title: 'COPPA Compliant',
      description: 'Child privacy protection',
    },
    {
      icon: Heart,
      title: 'Parent Approved',
      description: 'Trusted by families',
    },
    {
      icon: Star,
      title: 'Secure Data',
      description: 'Bank-level encryption',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription');
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className={cn('bg-gradient-to-b from-lavender-50 to-cream-50 border-t border-lavender-200', className)}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Star className="h-10 w-10 text-lavender-500 animate-sparkle" fill="currentColor" />
                <Heart className="h-4 w-4 text-pink-400 absolute -top-1 -right-1 animate-pulse" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-semibold text-gradient">
                  Little Star
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track your daughter's journey
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The most gentle and secure way to track your little star's growth, health, 
              activities, and precious memories. Designed by parents, for parents.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-lavender-500" />
                <span>support@littlestar.app</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-mint-500" />
                <span>1-800-LITTLE-STAR</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/70 border-lavender-200 focus:border-lavender-400"
                  required
                />
                <Button
                  type="submit"
                  className="button-gradient text-white hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Get parenting tips and Little Star updates. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-lavender-600 transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-mint-600 transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-pink-600 transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-muted-foreground hover:text-cream-600 transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-lavender-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 border border-lavender-200"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-lavender-500" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground text-sm">
                      {badge.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-lavender-200 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} Little Star. All rights reserved. Made with{' '}
              <Heart className="inline h-4 w-4 text-pink-500" fill="currentColor" />{' '}
              for families.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors border border-lavender-200 hover:border-lavender-300"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <IconComponent className="h-4 w-4 text-muted-foreground hover:text-lavender-600 transition-colors" />
                  </a>
                );
              })}
            </div>

            {/* Additional Trust Indicators */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-blue-500" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-sparkle opacity-40"></div>
      <div className="absolute bottom-8 right-1/3 w-1 h-1 bg-mint-300 rounded-full animate-sparkle opacity-40" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-6 left-2/3 w-1 h-1 bg-lavender-300 rounded-full animate-sparkle opacity-40" style={{ animationDelay: '3s' }}></div>
    </footer>
  );
};

export default Footer;