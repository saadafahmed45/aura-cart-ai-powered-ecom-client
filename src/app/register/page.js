'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { registerSchema } from '../../validators/schemas';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, googleLogin } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      router.push('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    try {
      await googleLogin(credentialResponse.credential);
      router.push('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Google sign-up failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-lg">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Join us today and enjoy quick checkouts and order trackings.
          </p>
        </div>

        {/* Google Sign Up Button */}
        <div className="flex justify-center mb-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg('Google sign-up failed')}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground font-medium">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            {errors.name && <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            {errors.email && <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            {errors.password && <span className="text-xs text-destructive mt-1 block">{errors.password.message}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            {errors.confirmPassword && <span className="text-xs text-destructive mt-1 block">{errors.confirmPassword.message}</span>}
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-semibold">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Register'} <ArrowRight className="h-4 w-4" />
          </button>

        </form>

        <div className="mt-6 text-center text-sm border-t border-border/40 pt-4">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}

