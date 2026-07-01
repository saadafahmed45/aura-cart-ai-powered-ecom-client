'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validators/schemas';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { isAuthenticated, user } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const res = await login({ email: data.email, password: data.password });
      if (res.user?.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Invalid credentials or connection error');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-lg">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please sign in to access your orders and profile.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
              />
            </div>
            {errors.email && <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
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
            {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>

        </form>

        <div className="mt-6 text-center text-sm border-t border-border/40 pt-4">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
}
