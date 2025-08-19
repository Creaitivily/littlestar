'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SocialLoginButton } from './social-login-button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void> | void;
  onSignupClick?: () => void;
  onForgotPasswordClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSignupClick,
  onForgotPasswordClick,
  isLoading = false,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const handleFormSubmit = async (data: LoginFormData) => {
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    if (isSubmitting || isLoading) return;
    
    setIsSubmitting(true);
    try {
      // Handle social login
      console.log(`Logging in with ${provider}`);
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
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Continue tracking your little star's journey
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialLogin('google')}
            disabled={isSubmitting || isLoading}
          />
          <SocialLoginButton
            provider="apple"
            onClick={() => handleSocialLogin('apple')}
            disabled={isSubmitting || isLoading}
          />
          <SocialLoginButton
            provider="facebook"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isSubmitting || isLoading}
          />
        </div>

        <div className="relative mb-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gradient-to-r from-cream-50 to-lavender-50 px-3 text-sm text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                disabled={isSubmitting || isLoading}
                className="border-lavender-300 data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-sm text-lavender-600 hover:text-lavender-700 transition-colors"
              disabled={isSubmitting || isLoading}
            >
              Forgot password?
            </button>
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
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onSignupClick}
              className="text-lavender-600 hover:text-lavender-700 font-medium transition-colors"
              disabled={isSubmitting || isLoading}
            >
              Sign up for free
            </button>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-lavender-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};