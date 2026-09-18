import React from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Zap, Rocket, Cpu, Layers, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { HeroVideo } from './HeroVideo';
import { BrandLogo } from './BrandLogo';
import { Reveal, StaggerContainer, PageTransition } from './MotionSystem';

export const Homepage: React.FC = () => {
  const { user, profile } = useAuth();
  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Member';

  const handleMembershipClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (user) {
      window.location.href = '/dashboard/membership';
    } else {
      window.location.href = '/invest/login';
    }
  };

  return (
    <PageTransition>
    <main className="w-full bg-[#030304] text-white p-0 m-0 relative overflow-x-hidden min-h-screen">
      {/* Subtle background ambient particle canvas */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '8%', bottom: '-10px', width: '1.5px', height: '1.5px', opacity: 0.15 }} />
        <div className="absolute rounded-full bg-[#e82127] animate-float-up" style={{ left: '28%', bottom: '-12px', width: '2px', height: '2px', opacity: 0.2 }} />
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '52%', bottom: '-10px', width: '1.5px', height: '1.5px', opacity: 0.15 }} />
        <div className="absolute rounded-full bg-[#e82127] animate-float-up" style={{ left: '76%', bottom: '-14px', width: '2.5px', height: '2.5px', opacity: 0.18 }} />
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '91%', bottom: '-10px', width: '1.5px', height: '1.5px', opacity: 0.15 }} />
      </div>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-[100dvh] flex flex-col items-center justify-between z-10 pt-20 pb-12 px-6 sm:px-10 overflow-hidden">
        {/* Background Cinematic Video */}
        <HeroVideo className="absolute inset-0 z-0" />

        {/* Top Hero Brand Watermark */}
        <div className="relative z-10 flex flex-col items-center pt-6 text-center animate-subtle-pulse">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-white/50 bg-white/[0.04] backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            Independent Mobility & Aerospace Initiative
          </span>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto space-y-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <BrandLogo variant="icon" size="lg" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[0.18em] leading-[1.05] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              The Future
            </span>{' '}
            <span className="text-[#e82127] font-semibold">of Mobility</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-white/70 font-light tracking-[0.1em] max-w-2xl leading-relaxed drop-shadow-md">
            Tesla & Spacex brings together next-generation electric automotive design, autonomous tunnel infrastructure, orbital energy tech, and exclusive private allocation memberships.
          </p>

          {/* Call to Actions - Adapted for Authentication State */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white rounded-xl bg-[#e82127] hover:bg-red-600 shadow-[0_0_25px_rgba(232,33,39,0.4)] hover:shadow-[0_0_35px_rgba(232,33,39,0.6)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <a
                  href="/dashboard/membership"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white/90 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/20 hover:border-white/50 hover:bg-white/[0.12] hover:text-white hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <span>View My Membership</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </>
            ) : (
              <>
                <a
                  href="/projects"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white rounded-xl bg-[#e82127] hover:bg-red-600 shadow-[0_0_25px_rgba(232,33,39,0.4)] hover:shadow-[0_0_35px_rgba(232,33,39,0.6)] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <a
                  href="/shop"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white/90 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/20 hover:border-white/50 hover:bg-white/[0.12] hover:text-white hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <span>Explore Vehicles</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Bottom Hero Metric Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-5xl mx-auto pt-6 border-t border-white/10 text-center">
          <div>
            <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-wider">0–60 MPH</div>
            <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-mono mt-0.5">1.99s Sub-Zero</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-wider">405 MI</div>
            <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-mono mt-0.5">Estimated Range</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-[#e82127] font-mono tracking-wider">100K+ GPU</div>
            <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-mono mt-0.5">xAI Supercluster</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-wider">100%</div>
            <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-mono mt-0.5">Clean Power Flow</div>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT MEMBERSHIP CARD / STATUS SECTION (PROMINENT HIGH PRIORITY POSITION) */}
      <section className="relative z-10 w-full bg-[#08080a] py-20 px-6 sm:px-10 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <Reveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#e82127] bg-[#e82127]/10 px-4 py-1.5 rounded-full border border-[#e82127]/20 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Investor Membership Status
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                  {user ? (
                    <>
                      Member Account <span className="text-[#e82127]">• {displayName}</span>
                    </>
                  ) : (
                    <>
                      Exclusive Investor <span className="text-white/40">Privileges</span>
                    </>
                  )}
                </h2>
              </div>
              <a
                href={user ? '/dashboard/membership' : '/membership'}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e82127] hover:text-red-400 transition-colors group"
              >
                <span>{user ? 'Manage My Membership' : 'Explore Membership Tiers'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>

          {/* Authenticated Member Banner */}
          {user && (
            <Reveal direction="up" delay={100}>
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#121216] to-[#08080a] border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Authenticated Account Active</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                    Welcome back, {displayName}
                  </h3>
                  <p className="text-xs text-white/60 font-light max-w-xl leading-relaxed">
                    You are logged into Tesla &amp; Spacex. Access your membership benefits, priority vehicle reservations, and AI portfolio allocations directly from your member dashboard.
                  </p>
                </div>
                <a
                  href="/dashboard/membership"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#e82127] rounded-full hover:bg-red-600 transition-all shadow-lg shrink-0"
                >
                  <span>View Membership Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          )}

          {/* Membership Tier Cards */}
          <StaggerContainer staggerDelay={100} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver Tier Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleMembershipClick}
              onKeyDown={handleMembershipClick}
              className="group relative rounded-2xl p-8 border border-slate-600/30 hover:border-slate-300 bg-gradient-to-b from-[#121216] via-[#08080a] to-[#030304] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-[0_0_30px_rgba(148,163,184,0.15)] focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                    Silver Tier
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-500/20 text-slate-200 border border-slate-500/30">
                    $2,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Silver Member</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Essential membership tier providing member-only market insights and priority support line.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Priority support (48h response)
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Exclusive market insights
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Early project access
                  </li>
                </ul>
              </div>
              <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold uppercase text-slate-300 group-hover:text-white transition-colors">
                <span>{user ? 'View Silver Benefits' : 'Select Silver Plan'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Gold Tier Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleMembershipClick}
              onKeyDown={handleMembershipClick}
              className="group relative rounded-2xl p-8 border border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 via-[#08080a] to-[#030304] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-[0_0_35px_rgba(217,119,6,0.25)] focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    Gold Tier
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    $5,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Gold Member</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Elevated tier for active investors featuring dedicated account management and fee discounts.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    24/7 Priority support line
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Dedicated account manager
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Reduced transaction fees
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Private investor webcasts
                  </li>
                </ul>
              </div>
              <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold uppercase text-amber-400 group-hover:text-amber-300 transition-colors">
                <span>{user ? 'View Gold Benefits' : 'Select Gold Plan'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Platinum Tier Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleMembershipClick}
              onKeyDown={handleMembershipClick}
              className="group relative rounded-2xl p-8 border border-red-500/40 hover:border-red-400 bg-gradient-to-b from-red-950/20 via-[#08080a] to-[#030304] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-[0_0_35px_rgba(232,33,39,0.25)] focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e82127]">
                    Platinum Tier
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e82127]/20 text-red-300 border border-[#e82127]/30">
                    $10,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Platinum VIP</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Institutional-grade tier offering bespoke portfolio structuring, zero fees, and direct allocation.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e82127]" />
                    1-on-1 strategy sessions
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e82127]" />
                    Direct co-investment allocation
                  </li>
                  <li className="text-xs text-white/80 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e82127]" />
                    Zero strategy management fees
                  </li>
                </ul>
              </div>
              <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold uppercase text-[#e82127] group-hover:text-red-400 transition-colors">
                <span>{user ? 'View Platinum Benefits' : 'Select Platinum Plan'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. MOBILITY / VEHICLE SHOWCASE SECTION */}
      <section className="relative z-10 w-full bg-[#030304] py-24 px-6 sm:px-10 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#e82127] bg-[#e82127]/10 px-3.5 py-1.5 rounded-full border border-[#e82127]/20 mb-3">
                <Zap className="w-3.5 h-3.5" />
                Electric Mobility
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                Designed for Speed. <span className="text-white/40">Engineered for Tomorrow.</span>
              </h2>
            </div>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e82127] hover:text-red-400 transition-colors group"
            >
              <span>View All Fleet Models</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Model S */}
            <a
              href="/shop"
              className="group relative rounded-2xl overflow-hidden bg-[#121216] border border-white/[0.08] hover:border-white/30 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                  alt="Model S"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase text-white tracking-wide">Model S</h3>
                  <span className="text-xs font-mono text-white/50">From $74,990</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  Plaid powertrain delivering 1,020 hp with unmatched range efficiency and aerodynamic profile.
                </p>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-[#e82127] transition-colors">
                  <span>Order Model S</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>

            {/* Cybertruck */}
            <a
              href="/shop"
              className="group relative rounded-2xl overflow-hidden bg-[#121216] border border-white/[0.08] hover:border-white/30 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Foundation_series_Cybertruck_at_dusk_in_San_Jose_dllu.jpg"
                  alt="Tesla Cybertruck Foundation Series"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase text-white tracking-wide">Cybertruck</h3>
                  <span className="text-xs font-mono text-white/50">From $79,990</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  Ultra-hard stainless steel exoskeleton engineered for extreme utility, durability, and response.
                </p>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-[#e82127] transition-colors">
                  <span>Order Cybertruck</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>

            {/* Model 3 / Y */}
            <a
              href="/shop"
              className="group relative rounded-2xl overflow-hidden bg-[#121216] border border-white/[0.08] hover:border-white/30 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80"
                  alt="Model 3"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase text-white tracking-wide">Model 3 Performance</h3>
                  <span className="text-xs font-mono text-white/50">From $38,990</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  Acoustic glass interior, dual-motor all-wheel drive, and Next-Gen autopilot response system.
                </p>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-[#e82127] transition-colors">
                  <span>Order Model 3</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 4. TECHNOLOGY & ENGINEERING PILLARS SECTION */}
      <section className="relative z-10 w-full bg-[#08080a] py-24 px-6 sm:px-10 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-white/70 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
              <Layers className="w-3.5 h-3.5 text-[#e82127]" />
              Multi-Domain Engineering
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Pioneering Earth <span className="text-[#e82127]">&</span> Orbital Tech
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
              We connect terrestrial EV mobility with high-speed tunnel transport and high-density orbital energy infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#08080a] border border-white/[0.08] hover:border-white/20 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e82127]/10 border border-[#e82127]/30 flex items-center justify-center text-[#e82127]">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white tracking-wide">Aerospace Trajectory</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Space City infrastructure fund participating in heavy-lift payload acceleration, Starbase development, and satellite mesh tech.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#08080a] border border-white/[0.08] hover:border-white/20 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/20 flex items-center justify-center text-white">
                <Zap className="w-6 h-6 text-[#e82127]" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white tracking-wide">Tunnel Transit Network</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Zero-emissions high-speed underground loop networks bypassing urban congestion with automated electric vehicles.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#08080a] border border-white/[0.08] hover:border-white/20 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e82127]/10 border border-[#e82127]/30 flex items-center justify-center text-[#e82127]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white tracking-wide">xAI Compute Clusters</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Megawatt-scale GPU compute clusters advancing autonomous driving neural networks and physical artificial intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL STRATEGIC CALL TO ACTION */}
      <section className="relative z-10 w-full bg-[#030304] py-24 px-6 sm:px-10 border-t border-white/[0.08] text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <BrandLogo size="lg" className="justify-center" />
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Ready to Build the Next Era?
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-xl mx-auto">
            Explore active allocation rounds, reserve custom electric vehicles, or join our exclusive investor membership tier today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase text-white bg-[#e82127] rounded-xl hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(232,33,39,0.3)]"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/dashboard/membership"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase text-white/90 bg-white/[0.05] border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  View My Membership
                </a>
              </>
            ) : (
              <>
                <a
                  href="/projects"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase text-white bg-[#e82127] rounded-xl hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(232,33,39,0.3)]"
                >
                  Explore Projects
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/invest/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase text-white/90 bg-white/[0.05] border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  Create Account
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
    </PageTransition>
  );
};

export default Homepage;
