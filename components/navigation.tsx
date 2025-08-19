'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Star, Heart, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  onLoginClick,
  onSignupClick,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '#features', icon: Sparkles },
    { label: 'Benefits', href: '#benefits', icon: Heart },
    { label: 'Security', href: '#security', icon: Shield },
    { label: 'FAQ', href: '#faq', icon: Star },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-soft border-b border-lavender-200'
          : 'bg-transparent',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Star 
                className="h-8 w-8 text-lavender-500 animate-sparkle" 
                fill="currentColor" 
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-pink-300 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-2xl font-display font-semibold text-gradient">
                Little Star
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Track your daughter's journey
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href.replace('#', ''))}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-lavender-600 transition-colors duration-200 group"
                >
                  <IconComponent className="h-4 w-4 group-hover:text-pink-500 transition-colors" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="text-foreground hover:text-lavender-600 hover:bg-lavender-100/50"
            >
              Sign In
            </Button>
            <Button
              onClick={onSignupClick}
              className="button-gradient text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-medium border border-lavender-200 animate-slide-up">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href.replace('#', ''))}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-left text-base font-medium text-foreground hover:text-lavender-600 hover:bg-lavender-100/50 rounded-md transition-colors duration-200"
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2 border-t border-lavender-200">
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="w-full justify-center text-foreground hover:text-lavender-600 hover:bg-lavender-100/50"
                >
                  Sign In
                </Button>
                <Button
                  onClick={onSignupClick}
                  className="w-full justify-center button-gradient text-white hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-sparkle opacity-60"></div>
      <div className="absolute top-2 right-1/3 w-1 h-1 bg-mint-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1 left-2/3 w-1 h-1 bg-lavender-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '2s' }}></div>
    </nav>
  );
};

export default Navigation;