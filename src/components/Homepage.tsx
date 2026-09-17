import React, { useState } from 'react';
import { ArrowRight, Image as ImageIcon, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export interface HomepageProps {
  investBgUrl?: string;
  shopBgUrl?: string;
  investHref?: string;
  shopHref?: string;
}

export const Homepage: React.FC<HomepageProps> = ({
  investBgUrl,
  shopBgUrl,
  investHref = '/invest',
  shopHref = '/shop',
}) => {
  const [investImgError, setInvestImgError] = useState(false);
  const [shopImgError, setShopImgError] = useState(false);
  const { user } = useAuth();

  const handleMembershipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      window.location.href = '/dashboard/membership';
    } else {
      window.location.href = '/invest/login';
    }
  };

  return (
    <main className="w-full bg-black p-0 m-0 relative overflow-x-hidden min-h-screen">
      {/* Floating particles background effect */}
      <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '5%', bottom: '-6px', width: '1.5px', height: '1.5px', opacity: 0.1 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up" style={{ left: '19%', bottom: '-8.4px', width: '2.1px', height: '2.1px', opacity: 0.16 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '33%', bottom: '-10.8px', width: '2.7px', height: '2.7px', opacity: 0.22 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up" style={{ left: '47%', bottom: '-6px', width: '1.5px', height: '1.5px', opacity: 0.1 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '61%', bottom: '-8.4px', width: '2.1px', height: '2.1px', opacity: 0.16 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up" style={{ left: '75%', bottom: '-10.8px', width: '2.7px', height: '2.7px', opacity: 0.22 }}></div>
        <div className="absolute rounded-full bg-white animate-float-up-alt" style={{ left: '89%', bottom: '-6px', width: '1.5px', height: '1.5px', opacity: 0.1 }}></div>
      </div>

      {/* HERO HERO SPLIT SECTION */}
      <div className="w-full h-[100dvh] bg-black overflow-hidden relative">
        {/* SVG clip-path definition for wave divider */}
        <svg className="absolute w-0 h-0">
          <defs>
            <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 1,0 L 1,0.9 C 0.65,1.0 0.35,0.8 0,0.9 Z"></path>
            </clipPath>
          </defs>
        </svg>

        {/* SHOP SECTION (Bottom split - 60dvh) */}
        <div className="absolute bottom-0 left-0 w-full h-[60dvh] z-[1]">
          <section className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-pointer will-change-transform scanline-overlay">
            {/* Background Image / Accessible Placeholder */}
            <div className="absolute inset-0 w-full h-full origin-center">
              {shopBgUrl && !shopImgError ? (
                <img
                  alt="Shop Tesla Vehicles"
                  decoding="async"
                  className="object-cover object-center w-full h-full absolute inset-0 text-transparent"
                  src={shopBgUrl}
                  onError={() => setShopImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center text-white/20">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs uppercase tracking-widest font-mono">Shop Background Placeholder</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 opacity-85"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.4)_0%,_transparent_65%)] z-[5]"></div>

            {/* Shop Section Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-3xl pt-8">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.25em] text-white mb-2 sm:mb-3"
                style={{ textShadow: 'rgba(255, 255, 255, 0.15) 0px 0px 20px, rgba(0, 0, 0, 0.8) 0px 2px 10px' }}
              >
                Shop
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/60 font-light tracking-[0.15em] mb-6 sm:mb-8 max-w-md">
                Explore and Purchase Tesla Vehicles
              </p>
              <div className="w-auto">
                <a
                  className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em] uppercase text-white/90 rounded-lg transition-all duration-500 ease-out bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-red-500/50 hover:bg-red-600/10 hover:text-white hover:shadow-[0_0_20px_rgba(232,33,39,0.2)] hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-red-500/30"
                  href={shopHref}
                >
                  <span className="font-semibold whitespace-nowrap">Browse Vehicles</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* INVEST SECTION (Top split - 55dvh with wave clip-path) */}
        <div className="absolute top-0 left-0 w-full h-[55dvh] z-[2]" style={{ clipPath: 'url(#wave-clip)' }}>
          <section className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-pointer will-change-transform scanline-overlay">
            {/* Background Image / Accessible Placeholder */}
            <div className="absolute inset-0 w-full h-full origin-center">
              {investBgUrl && !investImgError ? (
                <img
                  alt="Invest in Tesla Projects"
                  decoding="async"
                  className="object-cover object-center w-full h-full absolute inset-0 text-transparent"
                  src={investBgUrl}
                  onError={() => setInvestImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-950/40 via-zinc-900 to-black flex items-center justify-center text-red-500/20">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs uppercase tracking-widest font-mono">Invest Background Placeholder</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 opacity-85"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.4)_0%,_transparent_65%)] z-[5]"></div>

            {/* Invest Section Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-3xl pb-8">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.25em] text-red-500 mb-2 sm:mb-3"
                style={{ textShadow: 'rgba(232, 33, 39, 0.4) 0px 0px 30px, rgba(0, 0, 0, 0.8) 0px 2px 10px' }}
              >
                Invest
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/60 font-light tracking-[0.15em] mb-6 sm:mb-8 max-w-md">
                Space City Fund · Tunnel Network · AI Plans
              </p>
              <div className="w-auto">
                <a
                  className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em] uppercase text-white/90 rounded-lg transition-all duration-500 ease-out bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-red-500/50 hover:bg-red-600/10 hover:text-white hover:shadow-[0_0_20px_rgba(232,33,39,0.2)] hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-red-500/30"
                  href={investHref}
                >
                  <span className="font-semibold whitespace-nowrap">Start Investing</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Red Glowing Wave Line Overlay */}
        <div className="absolute top-0 left-0 w-full h-[55dvh] pointer-events-none z-[3]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1 1">
            <path
              d="M 0,0.9 C 0.35,0.8 0.65,1.0 1,0.9"
              fill="none"
              stroke="#e82127"
              strokeWidth="0.003"
              className="opacity-90 drop-shadow-[0_0_8px_rgba(232,33,39,0.8)]"
            ></path>
          </svg>
        </div>
      </div>

      {/* PUBLIC HOMEPAGE MEMBERSHIP CARDS SECTION */}
      <section className="relative z-10 w-full bg-[#050505] py-20 sm:py-28 px-6 sm:px-10 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-red-500 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Membership Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              Exclusive Investor <span className="text-white/40">Privileges</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-light mt-3 max-w-xl mx-auto leading-relaxed">
              Unlock elevated allocations, priority vehicle delivery, and institutional yield tools. Select a tier below to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Silver Plan Card */}
            <div
              onClick={handleMembershipClick}
              className="group relative rounded-2xl p-7 border border-white/[0.08] hover:border-slate-400/40 bg-gradient-to-b from-zinc-900 to-black hover:from-slate-900/50 hover:to-black transition-all duration-500 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(168,178,193,0.15)]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
                    Silver Tier
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    $2,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Silver Member</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Essential membership tier providing member-only market insights and priority support.
                </p>
                <ul className="space-y-2.5 mb-8">
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    Priority support (48h response)
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    Exclusive market insights
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    Early project access
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase text-slate-300 group-hover:text-white transition-colors">
                <span>Select Silver Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Gold Plan Card */}
            <div
              onClick={handleMembershipClick}
              className="group relative rounded-2xl p-7 border border-amber-500/30 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 via-zinc-900 to-black hover:from-amber-950/40 transition-all duration-500 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(229,193,88,0.2)]"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    Gold Tier
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    $5,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Gold Member</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Elevated tier for active investors featuring dedicated account management and reduced fees.
                </p>
                <ul className="space-y-2.5 mb-8">
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    24/7 Priority support line
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Dedicated account manager
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Reduced transaction fees
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Private investor webcasts
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase text-amber-400 group-hover:text-amber-300 transition-colors">
                <span>Select Gold Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Platinum Plan Card */}
            <div
              onClick={handleMembershipClick}
              className="group relative rounded-2xl p-7 border border-cyan-500/30 hover:border-cyan-400 bg-gradient-to-b from-cyan-950/20 via-zinc-900 to-black hover:from-cyan-950/40 transition-all duration-500 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(102,252,241,0.2)]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                    Platinum Tier
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    $10,000
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Platinum VIP</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6">
                  Institutional-grade tier offering bespoke portfolio structuring, zero fees, and direct access.
                </p>
                <ul className="space-y-2.5 mb-8">
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    1-on-1 strategy sessions
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Direct co-investment allocation
                  </li>
                  <li className="text-xs text-white/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Zero strategy management fees
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold uppercase text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span>Select Platinum Plan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
