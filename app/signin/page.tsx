'use client';

import { Database, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">

      {/* Modern Grid Background (Matches Landing Page) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />

      {/* Subtle Spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

      {/* Header / Nav */}
      <div className="relative z-20 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Logo Section */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Database size={24} className="text-emerald-500" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-zinc-100">DrawDB</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Welcome back</h1>
            <p className="text-zinc-400">Sign in to your account to continue designing.</p>
          </div>

          {/* Card */}
          <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5 relative overflow-hidden group">

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full relative flex items-center justify-center gap-3 px-6 py-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-zinc-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-zinc-500" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-zinc-900/50 backdrop-blur text-xs uppercase tracking-widest text-zinc-600 font-semibold">Or</span>
                </div>
              </div>

              {/* Email Sign In (Disabled - Visual Only) */}
              <div className="space-y-4 opacity-70">
                <div className="group/input">
                  <label className="block text-xs font-medium text-zinc-500 mb-2 ml-1 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    disabled
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-400 placeholder:text-zinc-700 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <button
                  disabled
                  className="w-full px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl font-medium cursor-not-allowed hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  Email login coming soon
                </button>
              </div>

              {/* Terms */}
              <p className="text-[10px] text-zinc-600 text-center mt-8 leading-relaxed">
                By signing in, you agree to our{' '}
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v1.0 is live
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
