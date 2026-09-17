import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { fetchProjects, type Project } from '../lib/projects';

export const InvestPage: React.FC = () => {
  const heroImages = [
    { src: 'https://www.teslaincorp.pro/images/shop.avif', alt: 'Tesla' },
    { src: 'https://www.teslaincorp.pro/images/hero1.jpg', alt: 'SpaceX 1' },
    { src: 'https://www.teslaincorp.pro/images/hero2.jpg', alt: 'SpaceX 2' },
    { src: 'https://www.teslaincorp.pro/images/hero3.jpg', alt: 'SpaceX 3' },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    let mounted = true;
    fetchProjects().then((data) => {
      if (mounted) {
        setProjects(data);
        setLoadingProjects(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <main>
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  alt={img.alt}
                  className="object-cover object-center w-full h-full absolute inset-0"
                  src={img.src}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/70 z-[1]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.2)_0%,_rgba(0,0,0,0.9)_100%)] z-[2]"></div>
          </div>

          <div
            className="absolute inset-0 z-[3] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
            <div className="mb-6">
              <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/60 font-light border border-red-500/30 rounded-full px-5 py-2 flex items-center gap-2 bg-black/40 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Private Market Access — From $1,000
              </span>
            </div>

            <h1 className="text-[clamp(2rem,6vw,5rem)] font-black uppercase tracking-[0.08em] leading-[1.05] text-white mb-6 max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              Own a Stake in<br />
              <span className="text-red-500">Tomorrow's World</span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-light max-w-xl leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Direct investment access to SpaceX Space City, The Boring Company Tunnel Network, and AI-powered capital programs — the infrastructure of the next century, open to everyone.
            </p>

            {/* Market Abstraction / Ticker Box */}
            <div className="w-full max-w-3xl mb-10 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-sm px-4 py-3 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">TSLA</span>
                  <span className="text-emerald-400">+$12.40 (+4.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">NVDA</span>
                  <span className="text-emerald-400">+$3.15 (+2.6%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">AAPL</span>
                  <span className="text-emerald-400">+$1.80 (+0.9%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">BTC/USD</span>
                  <span className="text-emerald-400">+$1,450 (+2.1%)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#opportunities"
                className="group px-8 py-3.5 bg-red-600 text-white text-sm font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-400 ease-out hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(232,33,39,0.25)] flex items-center justify-center gap-2"
              >
                View Opportunities <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/invest/signup"
                className="px-8 py-3.5 text-sm font-semibold tracking-[0.1em] uppercase text-white rounded-full border border-white/30 transition-all duration-400 ease-out hover:border-red-500/50 hover:text-red-400 hover:scale-[1.02] flex items-center justify-center"
              >
                Create Account
              </a>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          <div className="relative z-20 pb-8 flex justify-center items-center gap-2">
            {heroImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === activeSlide ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50 w-1.5'
                }`}
                aria-label={`Show slide ${idx + 1} (${img.alt})`}
              />
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="relative w-full bg-zinc-50 pt-0 pb-24 sm:pb-32 overflow-hidden text-black">
          <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-black to-zinc-50"></div>
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-6">
              Intelligent System Design
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-black mb-16 sm:mb-20 w-full">
              Three Steps.<br />
              <span className="text-black/40">Real Ownership.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="group relative bg-white rounded-2xl p-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(232,33,39,0.1)] hover:border-red-500/10 transition-all duration-500 cursor-pointer">
                <span className="block text-5xl sm:text-6xl font-black text-black/30 mb-3 tracking-tight">
                  01
                </span>
                <div className="w-10 h-[3px] bg-red-500 rounded-full mb-5"></div>
                <h3 className="text-lg sm:text-xl font-bold tracking-[0.04em] text-black mb-4">
                  Create Your Account
                </h3>
                <ul className="flex flex-col gap-3">
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Sign up in under 2 minutes
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Complete quick account registration
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Fund your account — deposit from $1,000
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="group relative bg-white rounded-2xl p-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(232,33,39,0.1)] hover:border-red-500/10 transition-all duration-500 cursor-pointer">
                <span className="block text-5xl sm:text-6xl font-black text-black/30 mb-3 tracking-tight">
                  02
                </span>
                <div className="w-10 h-[3px] bg-red-500 rounded-full mb-5"></div>
                <h3 className="text-lg sm:text-xl font-bold tracking-[0.04em] text-black mb-4">
                  Choose Your Investment
                </h3>
                <ul className="flex flex-col gap-3">
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Browse SpaceX, Boring Company &amp; more
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Select a tier — Silver, Gold, or Platinum
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Or activate an AI trading plan
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="group relative bg-white rounded-2xl p-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(232,33,39,0.1)] hover:border-red-500/10 transition-all duration-500 cursor-pointer">
                <span className="block text-5xl sm:text-6xl font-black text-black/30 mb-3 tracking-tight">
                  03
                </span>
                <div className="w-10 h-[3px] bg-red-500 rounded-full mb-5"></div>
                <h3 className="text-lg sm:text-xl font-bold tracking-[0.04em] text-black mb-4">
                  Track &amp; Earn
                </h3>
                <ul className="flex flex-col gap-3">
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Monitor your stake in real time
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Receive yield distributions to your account
                  </li>
                  <li className="text-sm text-black/70 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-[7px] shrink-0"></span>
                    Withdraw profits whenever you choose
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MARKETS / MUSK ECOSYSTEM SECTION */}
        <section id="markets" className="relative w-full bg-black py-24 sm:py-32 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-500 font-semibold mb-6">
              Strategic Exposure
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.06em] leading-[1.1] text-white mb-8 w-full">
              The Innovation<br />
              <span className="text-white/40">Ecosystem</span>
            </h2>
            <p className="text-base sm:text-lg text-white/50 font-light max-w-2xl leading-relaxed mb-16">
              Every company in our portfolio is building critical infrastructure for civilisation's next chapter — aerospace, clean energy, AI, neural interfaces, and underground transit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* SpaceX */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.07] hover:border-red-500/35 cursor-pointer">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-400">
                    Open for Investment
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">SpaceX</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">PRIVATE</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Reusable launch vehicles, Starlink satellite internet, and the first interplanetary transportation system
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent transition-all duration-500 group-hover:via-red-500/50"></div>
              </div>

              {/* The Boring Company */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.07] hover:border-red-500/35 cursor-pointer">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-400">
                    Open for Investment
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">The Boring Company</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">PRIVATE</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  High-speed underground transit networks eliminating urban traffic — operational in Las Vegas, expanding globally
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent transition-all duration-500 group-hover:via-red-500/50"></div>
              </div>

              {/* Tesla */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] cursor-default">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">Tesla</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">TSLA</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Electric vehicles, autonomous driving, energy storage, and solar — the vertically integrated clean energy company
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-all duration-500 group-hover:via-white/[0.12]"></div>
              </div>

              {/* Neuralink */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] cursor-default">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">Neuralink</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">PRIVATE</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Brain-computer interface technology restoring mobility and expanding human cognitive bandwidth
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-all duration-500 group-hover:via-white/[0.12]"></div>
              </div>

              {/* xAI */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] cursor-default">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">xAI</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">PRIVATE</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Advanced AI research company building Grok — a frontier large language model with real-time internet access
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-all duration-500 group-hover:via-white/[0.12]"></div>
              </div>

              {/* X Corp */}
              <div className="group relative rounded-xl p-6 border transition-colors duration-400 border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] cursor-default">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">X Corp</span>
                  <span className="text-xs font-mono tracking-wider text-white/25">PRIVATE</span>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  The everything app — payments, social, video, and AI converging into a single consumer platform
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-all duration-500 group-hover:via-white/[0.12]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED OPPORTUNITIES SECTION */}
        <section id="opportunities" className="relative py-24 px-6 sm:px-10 lg:px-16 bg-black overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px bg-white/20"></div>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">
                    Private Market Access
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.0]">
                  Featured<br />
                  <span className="text-white/25">Opportunities</span>
                </h2>
              </div>
              <a
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-[11px] font-bold tracking-[0.14em] uppercase rounded-full border border-white/[0.12] text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 self-start sm:self-auto"
                href="/projects"
              >
                All Opportunities
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>

            {loadingProjects ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
                <p className="text-xs uppercase font-mono text-white/50">Loading opportunities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.18] transition-all duration-500 bg-[#080808] cursor-pointer"
                  >
                    <div className="relative h-52 overflow-hidden bg-zinc-900">
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent"></div>
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full backdrop-blur-md bg-white/10 text-white border border-white/20">
                          {project.category}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight mb-1 leading-snug">
                          {project.name}
                        </h3>
                        <p className="text-xs text-white/45 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center py-2 border-y border-white/[0.06]">
                        <div>
                          <p className="text-sm font-bold text-red-500">{project.display_metric || 'N/A'}</p>
                          <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Target Yield</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            ${(project.target_amount ? project.target_amount / 1_000_000 : 50).toFixed(0)}M
                          </p>
                          <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Target</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-auto">
                        <span className="text-[10px] text-white/30">View details</span>
                        <a
                          href={`/projects/${project.slug}`}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-2 text-red-500"
                        >
                          Invest Now
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default InvestPage;
