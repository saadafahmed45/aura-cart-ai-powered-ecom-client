'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Reset token is missing in URL.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to reset password. Token may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-lg">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Set New Password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please enter your new password below.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-center w-fit mx-auto">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Password Changed</h3>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
            >
              Go to Login Page
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center text-center px-4 bg-background text-xs text-muted-foreground animate-pulse">
        Loading credentials settings...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

