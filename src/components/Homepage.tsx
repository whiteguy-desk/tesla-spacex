import React, { useState } from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

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

  return (
    <main className="w-full h-[100dvh] bg-black p-0 m-0 relative overflow-hidden">
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
    </main>
  );
};
