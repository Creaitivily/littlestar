'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Star, Heart, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SocialLoginButton } from './social-login-button';

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
  marketingEmails: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => Promise<void> | void;
  onLoginClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onLoginClick,
  isLoading = false,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeToTerms: false,
      agreeToPrivacy: false,
      marketingEmails: true,
    },
  });

  const password = watch('password');
  const agreeToTerms = watch('agreeToTerms');
  const agreeToPrivacy = watch('agreeToPrivacy');
  const marketingEmails = watch('marketingEmails');

  // Password strength indicators
  const passwordChecks = [
    { label: '8+ characters', met: password?.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password || '') },
    { label: 'Lowercase letter', met: /[a-z]/.test(password || '') },
    { label: 'Number', met: /\d/.test(password || '') },
  ];

  const handleFormSubmit = async (data: SignupFormData) => {
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    try {
      // Handle social signup
      console.log(`Signing up with ${provider}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="card-gradient rounded-2xl p-8 shadow-large border border-lavender-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Star className="h-12 w-12 text-lavender-500 animate-sparkle" fill="currentColor" />
              <Heart className="h-4 w-4 text-pink-400 absolute -top-1 -right-1 animate-pulse" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-semibold text-gradient mb-2">
            Create Your Account
          </h2>
          <p className="text-muted-foreground">
            Start tracking your little star's journey today
          </p>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-3 mb-6">
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialSignup('google')}
            disabled={isSubmitting || isLoading}
            text="Sign up with Google"
          />
          <SocialLoginButton
            provider="apple"
            onClick={() => handleSocialSignup('apple')}
            disabled={isSubmitting || isLoading}
            text="Sign up with Apple"
          />
          <SocialLoginButton
            provider="facebook"
            onClick={() => handleSocialSignup('facebook')}
            disabled={isSubmitting || isLoading}
            text="Sign up with Facebook"
          />
        </div>

        <div className="relative mb-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gradient-to-r from-cream-50 to-lavender-50 px-3 text-sm text-muted-foreground">
              or create account with email
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  className={cn(
                    'pl-10 bg-white/50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-300',
                    errors.firstName && 'border-red-300 focus:border-red-400 focus:ring-red-300'
                  )}
                  {...register('firstName')}
                  disabled={isSubmitting || isLoading}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                className={cn(
                  'bg-white/50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-300',
                  errors.lastName && 'border-red-300 focus:border-red-400 focus:ring-red-300'
                )}
                {...register('lastName')}
                disabled={isSubmitting || isLoading}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                className={cn(
                  'pl-10 bg-white/50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-300',
                  errors.email && 'border-red-300 focus:border-red-400 focus:ring-red-300'
                )}
                {...register('email')}
                disabled={isSubmitting || isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className={cn(
                  'pl-10 pr-10 bg-white/50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-300',
                  errors.password && 'border-red-300 focus:border-red-400 focus:ring-red-300'
                )}
                {...register('password')}
                disabled={isSubmitting || isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting || isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicators */}
            {password && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {passwordChecks.map((check, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center space-x-1',
                        check.met ? 'text-green-600' : 'text-muted-foreground'
                      )}
                    >
                      <Check
                        className={cn(
                          'h-3 w-3',
                          check.met ? 'text-green-600' : 'text-gray-300'
                        )}
                      />
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={cn(
                  'pl-10 pr-10 bg-white/50 border-lavender-200 focus:border-lavender-400 focus:ring-lavender-300',
                  errors.confirmPassword && 'border-red-300 focus:border-red-400 focus:ring-red-300'
                )}
                {...register('confirmPassword')}
                disabled={isSubmitting || isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting || isLoading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeToTerms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
                disabled={isSubmitting || isLoading}
                className="mt-1 border-lavender-300 data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
              <div className="flex-1">
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <a href="/terms" className="text-lavender-600 hover:text-lavender-700 underline">
                    Terms of Service
                  </a>
                </Label>
                {errors.agreeToTerms && (
                  <p className="text-xs text-red-600 mt-1" role="alert">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeToPrivacy"
                checked={agreeToPrivacy}
                onCheckedChange={(checked) => setValue('agreeToPrivacy', !!checked)}
                disabled={isSubmitting || isLoading}
                className="mt-1 border-lavender-300 data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
              <div className="flex-1">
                <Label
                  htmlFor="agreeToPrivacy"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <a href="/privacy" className="text-lavender-600 hover:text-lavender-700 underline">
                    Privacy Policy
                  </a>
                </Label>
                {errors.agreeToPrivacy && (
                  <p className="text-xs text-red-600 mt-1" role="alert">
                    {errors.agreeToPrivacy.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketingEmails"
                checked={marketingEmails}
                onCheckedChange={(checked) => setValue('marketingEmails', !!checked)}
                disabled={isSubmitting || isLoading}
                className="mt-1 border-lavender-300 data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
              <Label
                htmlFor="marketingEmails"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                Send me helpful tips and updates about Little Star (optional)
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full button-gradient text-white hover:opacity-90 transition-opacity"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="text-lavender-600 hover:text-lavender-700 font-medium transition-colors"
              disabled={isSubmitting || isLoading}
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-lavender-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-green-500" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 text-pink-500" />
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};