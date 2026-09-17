import React from 'react';
import {
  Building2,
  Bot,
  ShoppingBag,
  UserCheck,
  FileCheck,
  Wallet,
  BarChart3,
  TrendingUp,
  CircleCheck,
  Award,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="bg-black text-white overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-[70px]">
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
            <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6">
              Platform Guide
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8">
              How It<br />
              <span className="text-white/30">Works</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Musk Capital Inc gives you structured access to private equity in the world's most consequential technology companies — alongside AI-powered trading strategies and a curated product shop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                className="px-8 py-3.5 rounded-full bg-red-600 text-white text-sm font-semibold tracking-[0.08em] uppercase hover:bg-red-500 transition-colors duration-300"
                href="/invest"
              >
                Start Investing
              </a>
              <a
                className="px-8 py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                href="/invest"
              >
                Browse Projects
              </a>
            </div>
          </div>
        </section>

        {/* THREE WAYS TO PARTICIPATE */}
        <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                What We Offer
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                Three Ways to Participate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <Building2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  Private Equity Access
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Invest in pre-IPO stakes in SpaceX, Neuralink, xAI, and other Musk-portfolio companies not available on public markets.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <Bot className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  AI Trading Plans
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Activate systematic AI-managed trading strategies scaled to your capital size, with returns distributed on a defined cycle.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  Tesla Product Shop
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Order Tesla vehicles, Powerwall home energy systems, and solar products directly through the platform with integrated financing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FIVE STEPS TO YOUR FIRST INVESTMENT */}
        <section className="relative w-full bg-zinc-50 py-20 sm:py-28 overflow-hidden text-black">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-4">
                Getting Started
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black">
                Five Steps to Your<br />
                <span className="text-black/30">First Investment</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                  <span className="text-5xl sm:text-6xl font-black text-black/10 leading-none">01</span>
                  <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block"></div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3">
                    Create Your Account
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-5">
                    Register in under 2 minutes with your email and basic information. Choose a secure password and confirm your email address to activate your account.
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Email and password registration</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Instant account activation via email confirmation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Full access to browse plans and projects before depositing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                  <span className="text-5xl sm:text-6xl font-black text-black/10 leading-none">02</span>
                  <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block"></div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3">
                    Complete KYC Verification
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-5">
                    Submit your government-issued identity document and a selfie for identity verification. KYC is required to unlock deposits and investments.
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Submit passport, national ID, or driver's license</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Liveness check (selfie) for anti-fraud protection</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Verification typically completed within 24 hours</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                  <span className="text-5xl sm:text-6xl font-black text-black/10 leading-none">03</span>
                  <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block"></div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3">
                    Fund Your Account
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-5">
                    Deposit funds via bank wire or cryptocurrency. Minimum deposit is $1,000. Funds reflect in your account balance after confirmation.
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Bank wire transfer (USD, EUR, GBP)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Cryptocurrency deposits (BTC, ETH, USDT)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Minimum deposit: $1,000</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                  <span className="text-5xl sm:text-6xl font-black text-black/10 leading-none">04</span>
                  <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block"></div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3">
                    Choose Your Investment
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-5">
                    Browse private equity projects or activate an AI trading plan. Select based on your capital size, risk appetite, and return expectations.
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Private equity: SpaceX, Tesla, Neuralink, xAI, Boring Co.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">AI Plans: systematic strategies from $1K to $500K+</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Full project details, financials, and milestones before committing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 shrink-0">
                  <span className="text-5xl sm:text-6xl font-black text-black/10 leading-none">05</span>
                  <div className="sm:mt-3 w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-8 h-[3px] bg-red-500 rounded-full mb-4 hidden sm:block"></div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.03em] text-black mb-3">
                    Track Returns &amp; Withdraw
                  </h3>
                  <p className="text-sm text-black/60 font-light leading-relaxed mb-5">
                    Monitor your portfolio from your dashboard in real time. Yield distributions are credited automatically per your plan's cycle.
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Live portfolio dashboard with yield tracking</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Distributions credited on plan schedule (daily / weekly / monthly)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CircleCheck className="w-4 h-4 text-red-500 mt-[1px] shrink-0" />
                      <span className="text-sm text-black/70 leading-relaxed">Withdraw profits to your original payment method anytime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TWO PATHS ONE PLATFORM */}
        <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                Investment Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                Two Paths.<br />
                <span className="text-white/30">One Platform.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Path 1 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col hover:border-white/[0.15] transition-colors duration-400">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white/60" />
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">
                    Private Equity
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-[0.04em] text-white mb-4">
                  Project Investments
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
                  Gain direct stake exposure in pre-IPO companies operating at the frontier of technology. Each project offers tiered entry points with defined yield structures and milestone-linked distributions.
                </p>
                <ul className="flex flex-col gap-3 mb-10 flex-1">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">SpaceX Space City Fund</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Tesla Growth Equity</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Neuralink Series Fund</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">xAI Ventures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">The Boring Company Infrastructure</span>
                  </li>
                </ul>
                <a
                  className="block w-full text-center py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                  href="/invest"
                >
                  Browse Projects
                </a>
              </div>

              {/* Path 2 */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col hover:border-white/[0.15] transition-colors duration-400">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white/60" />
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">
                    AI Capital Programs
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-[0.04em] text-white mb-4">
                  AI Trading Plans
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
                  Algorithmically managed systematic strategies that deploy capital across diversified positions. Plans are tiered by capital size and execution cycle, from daily micro-trades to long-cycle institutional strategies.
                </p>
                <ul className="flex flex-col gap-3 mb-10 flex-1">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Automated 24/7 position management</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Multiple capital tiers and risk profiles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Defined execution cycles (daily to monthly)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">No active management required</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-red-500/60 shrink-0"></span>
                    <span className="text-sm text-white/60">Real-time performance tracking</span>
                  </li>
                </ul>
                <a
                  className="block w-full text-center py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-semibold tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-300"
                  href="/invest"
                >
                  View AI Plans
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AI PLANS */}
        <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16 text-center">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                AI Capital Programs
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white mb-4">
                Available AI Plans
              </h2>
              <p className="text-sm text-white/40 font-light max-w-xl mx-auto">
                Systematic strategies scaled to your capital size. Activate any plan from your dashboard after funding your account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Starter AI */}
              <div className="relative rounded-2xl p-7 flex flex-col transition-all duration-300 bg-white/[0.03] border border-white/[0.07]">
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-1">
                  Starter AI
                </h3>
                <p className="text-xs text-white/40 mb-5">$1,000 - $10,000</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-white">200%–350%</span>
                </div>
                <p className="text-[10px] text-white/30 mb-4">
                  Based on historical backtesting and volatility-adjusted strategy modeling.
                </p>
                <div className="text-xs text-white/40 mb-5">
                  <span className="text-white/20 uppercase tracking-[0.15em] text-[9px]">Cycle: </span>24 hours
                </div>
                <div className="w-full h-[1px] bg-white/[0.06] mb-5"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed mb-6 flex-1">
                  Designed for new investors seeking structured exposure to innovation-focused equities with automated risk controls.
                </p>
                <ul className="flex flex-col gap-2 mb-7">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Automated trade execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Risk-adjusted capital deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Portfolio rebalancing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Monthly performance reporting</span>
                  </li>
                </ul>
                <a
                  className="block w-full text-center py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  href="/invest"
                >
                  Activate Plan
                </a>
              </div>

              {/* Growth AI */}
              <div className="relative rounded-2xl p-7 flex flex-col transition-all duration-300 bg-white/[0.03] border border-white/[0.07]">
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-1">
                  Growth AI
                </h3>
                <p className="text-xs text-white/40 mb-5">$10,000 – $100,000</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-white">350%–550%</span>
                </div>
                <p className="text-[10px] text-white/30 mb-4">
                  Advanced signal detection with volatility-aware execution framework.
                </p>
                <div className="text-xs text-white/40 mb-5">
                  <span className="text-white/20 uppercase tracking-[0.15em] text-[9px]">Cycle: </span>3 days
                </div>
                <div className="w-full h-[1px] bg-white/[0.06] mb-5"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed mb-6 flex-1">
                  Enhanced AI signal modeling focused on high-growth innovation sectors and dynamic capital rotation.
                </p>
                <ul className="flex flex-col gap-2 mb-7">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">High-frequency signal detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Sector rotation strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Volatility hedging logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Weekly analytics dashboard</span>
                  </li>
                </ul>
                <a
                  className="block w-full text-center py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  href="/invest"
                >
                  Activate Plan
                </a>
              </div>

              {/* Elite AI */}
              <div className="relative rounded-2xl p-7 flex flex-col transition-all duration-300 bg-white/[0.03] border border-white/[0.07]">
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-1">
                  Elite AI
                </h3>
                <p className="text-xs text-white/40 mb-5">$100,000+</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-white">+700%</span>
                </div>
                <p className="text-[10px] text-white/30 mb-4">
                  Multi-layered AI execution across diversified innovation assets.
                </p>
                <div className="text-xs text-white/40 mb-5">
                  <span className="text-white/20 uppercase tracking-[0.15em] text-[9px]">Cycle: </span>5 days
                </div>
                <div className="w-full h-[1px] bg-white/[0.06] mb-5"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed mb-6 flex-1">
                  Designed for large capital deployment with structured downside protection and dynamic reallocation systems.
                </p>
                <ul className="flex flex-col gap-2 mb-7">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Cross-sector AI allocation engine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Downside risk containment protocol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Real-time capital rebalancing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[5px] shrink-0"></span>
                    <span className="text-xs text-white/50">Dedicated strategy oversight</span>
                  </li>
                </ul>
                <a
                  className="block w-full text-center py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  href="/invest"
                >
                  Activate Plan
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP TIERS */}
        <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                Membership
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                Membership Tiers
              </h2>
              <p className="text-sm text-white/40 font-light mt-3 max-w-xl">
                Unlock premium features and elevated access as your investment volume grows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Silver */}
              <div
                className="rounded-2xl p-7 border border-white/[0.08] flex flex-col"
                style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
              >
                <div className="w-8 h-[3px] rounded-full mb-5" style={{ backgroundColor: '#a8b2c1' }}></div>
                <h3 className="text-base font-bold tracking-[0.06em] uppercase text-white mb-2">Silver</h3>
                <p className="text-[10px] text-white/40 mb-4 tracking-wide">
                  Minimum account balance of $5,000 or cumulative investment of $10,000.
                </p>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
                  The entry point into the Musk Space Membership Programme. Designed for emerging investors seeking premium access and portfolio support.
                </p>
                <ul className="flex flex-col gap-2.5 flex-1">
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#a8b2c1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Priority customer support (48h response)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#a8b2c1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Exclusive member-only market insights</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#a8b2c1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Early access to new investment plans</span>
                  </li>
                </ul>
              </div>

              {/* Gold */}
              <div
                className="rounded-2xl p-7 border border-white/[0.08] flex flex-col"
                style={{ background: 'linear-gradient(135deg, #2b2111, #1f180a)' }}
              >
                <div className="w-8 h-[3px] rounded-full mb-5" style={{ backgroundColor: '#e5c158' }}></div>
                <h3 className="text-base font-bold tracking-[0.06em] uppercase text-white mb-2">Gold</h3>
                <p className="text-[10px] text-white/40 mb-4 tracking-wide">
                  Minimum account balance of $50,000 or cumulative investment of $100,000.
                </p>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
                  Elevated tier for active capital allocators featuring expedited service and dedicated account management.
                </p>
                <ul className="flex flex-col gap-2.5 flex-1">
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#e5c158' }} />
                    <span className="text-xs text-white/60 leading-relaxed">24/7 priority support line</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#e5c158' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#e5c158' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Reduced transaction fees</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#e5c158' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Invitations to private investor webcasts</span>
                  </li>
                </ul>
              </div>

              {/* Platinum */}
              <div
                className="rounded-2xl p-7 border border-white/[0.08] flex flex-col"
                style={{ background: 'linear-gradient(135deg, #1f2833, #0b0c10)' }}
              >
                <div className="w-8 h-[3px] rounded-full mb-5" style={{ backgroundColor: '#66fcf1' }}></div>
                <h3 className="text-base font-bold tracking-[0.06em] uppercase text-white mb-2">Platinum</h3>
                <p className="text-[10px] text-white/40 mb-4 tracking-wide">
                  Minimum account balance of $250,000+ or cumulative investment of $500,000+.
                </p>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
                  Institutional-grade tier offering bespoke portfolio structuring, zero management fees, and direct access.
                </p>
                <ul className="flex flex-col gap-2.5 flex-1">
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#66fcf1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">1-on-1 strategy sessions with senior analysts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#66fcf1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Direct co-investment allocation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#66fcf1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Zero strategy management fees</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CircleCheck className="w-3.5 h-3.5 mt-[2px] shrink-0" style={{ color: '#66fcf1' }} />
                    <span className="text-xs text-white/60 leading-relaxed">Exclusive quarterly board briefings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;
