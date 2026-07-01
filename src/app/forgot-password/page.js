'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, Key } from 'lucide-react';
import api from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setResetToken('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'Reset token generated successfully.');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to request reset token. Make sure email exists.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-lg">
        
        <div className="text-center mb-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-3 w-3" /> Back to Login
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and we'll generate a verification reset token for you.
          </p>
        </div>

        {!resetToken ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'Requesting...' : 'Request Reset Token'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
              <Key className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-foreground text-sm">Token Generated Successfully</h3>
              <p className="text-xs text-muted-foreground mt-1">Copy the token below to update your password.</p>
            </div>

            <div className="bg-secondary p-3 rounded-lg border border-border select-all font-mono text-xs text-center break-all font-bold text-foreground">
              {resetToken}
            </div>

            <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 leading-normal">
              <strong>Testing Tip:</strong> In a production environment, this token is securely emailed. For this template, it is returned in the API payload to allow instant testing!
            </div>

            <Link
              href={`/reset-password?token=${resetToken}`}
              className="w-full text-center rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
            >
              Proceed to Reset Password Page
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
