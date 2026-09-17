import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatAuthError } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../lib/navigation';

export const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(formatAuthError(error));
        setIsLoading(false);
        return;
      }

      // Successful login - navigate to dashboard (or redirect target)
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTarget = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTarget);
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="min-h-[100dvh] bg-black flex items-start sm:items-center justify-center px-6 py-20 pt-24 sm:py-24 overflow-y-auto">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,33,39,0.03)_0%,_transparent_60%)] pointer-events-none"></div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-10">
            <a
              className="text-lg font-bold tracking-[0.25em] uppercase text-white inline-block cursor-pointer"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Meta <span className="text-red-500">Wealth</span>
            </a>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <h1
                className="text-2xl font-bold tracking-[0.04em] text-white mb-2"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              >
                Welcome back
              </h1>
              <p className="text-sm text-white/40 font-light mb-4">
                Access your investment dashboard
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-light leading-relaxed">
                {errorMessage}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="john.doe@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs tracking-wide uppercase cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  className="text-xs text-white/30 hover:text-white/60 transition-colors duration-300"
                  href="/invest/forgot-password"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(232,33,39,0.2)] mt-2 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-white/[0.06]"></div>
              <span className="text-[11px] text-white/20 uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-[1px] bg-white/[0.06]"></div>
            </div>

            <p className="text-center text-sm text-white/40 font-light">
              Don&apos;t have an account?{' '}
              <a
                className="text-white/70 hover:text-white transition-colors duration-300 font-medium cursor-pointer"
                href="/invest/signup"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/invest/signup');
                }}
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
