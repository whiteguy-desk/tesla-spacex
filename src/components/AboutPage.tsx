import React from 'react';
import {
  Rocket,
  ChartColumn,
  DollarSign,
  Users,
  Bot,
  TrendingUp,
  Building2,
  ShoppingBag,
  Lock,
  Award,
  Eye,
  Shield,
  Target,
  Zap,
  Heart,
  Globe,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="bg-black text-white overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden pt-[70px]">
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/[0.04] rounded-full blur-[140px] pointer-events-none"></div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
            <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-red-500 font-semibold mb-6">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] leading-[1.05] text-white mb-8">
              About Tesla<br />
              <span className="text-white/25">Capital Inc</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              We are an AI-powered private equity and trading platform built on a single conviction: the most consequential investment opportunities of the 21st century should not be reserved for institutions.
            </p>
          </div>
        </section>

        {/* KEY STATISTICS */}
        <section className="relative w-full bg-zinc-950 border-t border-b border-white/[0.04] py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="text-center">
                <Rocket className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">-12</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Portfolio Projects</p>
              </div>
              <div className="text-center">
                <ChartColumn className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">-12</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Open to Invest</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">$-85.2B+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Total Raised</p>
              </div>
              <div className="text-center">
                <Users className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">-16,200</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Active Investors</p>
              </div>
              <div className="text-center">
                <Bot className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">-5</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">AI Plans</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-4 h-4 text-white/20 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">-8</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Membership Tiers</p>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-5">
                  Our Mission
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-6">
                  Democratising<br />
                  <span className="text-black/30">Private Markets</span>
                </h2>
                <p className="text-base text-black/60 font-light leading-relaxed mb-5">
                  For decades, pre-IPO equity in world-changing companies was gated behind accreditation requirements, minimum investments of $250,000+, and institutional intermediaries who captured most of the upside.
                </p>
                <p className="text-sm text-black/50 font-light leading-relaxed mb-5">
                  Tesla Inc exists to dismantle that structure. Through structured investment vehicles, tiered entry points from $1,000, and an AI-powered trading layer, we give every qualified investor access to the same opportunity set that institutions have always enjoyed.
                </p>
                <p className="text-sm text-black/50 font-light leading-relaxed">
                  Our mission is not charity — it is market efficiency. The most transformational companies deserve the broadest possible investor base, and investors deserve access to the most transformational companies.
                </p>
              </div>

              <div>
                <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-red-600 font-semibold mb-5">
                  Our Vision
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black mb-6">
                  A World Where<br />
                  <span className="text-black/30">Everyone Invests</span>
                </h2>
                <p className="text-base text-black/60 font-light leading-relaxed mb-5">
                  We envision a future where retail investors hold meaningful positions in the infrastructure of civilisation: the rockets that reach orbit, the tunnels that move cities, the AI systems that define the next century.
                </p>
                <p className="text-sm text-black/50 font-light leading-relaxed mb-8">
                  That future is not a distant ambition — it is what Tesla Inc is building right now, one verified investor and one funded project at a time.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-black/[0.05]">
                    <p className="text-xl font-black text-black mb-0.5">50+</p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-black/40">Countries Served</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-black/[0.05]">
                    <p className="text-xl font-black text-black mb-0.5">$1K</p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-black/40">Minimum Entry</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-black/[0.05]">
                    <p className="text-xl font-black text-black mb-0.5">24/7</p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-black/40">AI Operations</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-black/[0.05]">
                    <p className="text-xl font-black text-black mb-0.5">100%</p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-black/40">Segregated Funds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
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
                What We Do
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                Three Products.<br />
                <span className="text-white/30">One Platform.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <Building2 className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  Private Equity Access
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed flex-1">
                  We structure investment vehicles that give retail and accredited investors direct stake exposure in pre-IPO companies operating at the frontier of technology — SpaceX, Neuralink, xAI, The Boring Company, and more.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <Bot className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  AI Capital Programs
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed flex-1">
                  Our proprietary algorithmic trading strategies deploy capital across innovation-driven equities using systematic, risk-managed frameworks. Investors activate a plan, fund it, and the AI works continuously.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-red-500/20 hover:bg-white/[0.05] transition-all duration-400 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-base font-bold tracking-[0.04em] text-white mb-3">
                  Premium Product Shop
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed flex-1">
                  A curated marketplace for Tesla vehicles, Powerwall home energy systems, and solar products — allowing our community to buy directly into the hardware that powers the energy transition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPANY HISTORY */}
        <section className="relative w-full bg-zinc-950 py-20 sm:py-28 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                Company History
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                Our Journey
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-[1px] bg-white/[0.08]"></div>
              <div className="flex flex-col gap-10">
                {/* 2021 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-white/[0.12] bg-black">
                      <span className="text-[10px] font-black tracking-tight text-white/40">21</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2021</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Foundation</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      Tesla Inc was founded with a single conviction: private equity in transformational technology should not be exclusive to institutions. The platform concept was developed.
                    </p>
                  </div>
                </div>

                {/* 2022 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-white/[0.12] bg-black">
                      <span className="text-[10px] font-black tracking-tight text-white/40">22</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2022</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Platform Build</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      Full-stack development of the investment platform, AI trading infrastructure, and compliance framework. KYC integration, secure fund accounts, and the investor dashboard were built from scratch.
                    </p>
                  </div>
                </div>

                {/* 2023 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-white/[0.12] bg-black">
                      <span className="text-[10px] font-black tracking-tight text-white/40">23</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2023</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">First Projects Live</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      The SpaceX Space City Fund and The Boring Company Tunnel Project launched as the first live investment opportunities. Hundreds of early investors gained their first private equity exposure.
                    </p>
                  </div>
                </div>

                {/* 2024 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-white/[0.12] bg-black">
                      <span className="text-[10px] font-black tracking-tight text-white/40">24</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2024</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">AI Plans Launch</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      The AI Capital Programs division launched systematic trading strategies across multiple capital tiers. The shop division went live with Tesla vehicle and energy product orders.
                    </p>
                  </div>
                </div>

                {/* 2025 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-white/[0.12] bg-black">
                      <span className="text-[10px] font-black tracking-tight text-white/40">25</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2025</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Scale &amp; Expansion</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      Platform expanded to serve investors across 50+ countries. Membership tiers introduced. Neuralink, xAI, and DOGE investment vehicles added to the pipeline.
                    </p>
                  </div>
                </div>

                {/* 2026 */}
                <div className="flex gap-6 sm:gap-8">
                  <div className="relative shrink-0 mt-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center z-10 relative border-red-500/50 bg-red-600/10">
                      <span className="text-[10px] font-black tracking-tight text-red-400">26</span>
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black tracking-[0.15em] text-white/25 uppercase">2026</span>
                      <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Now
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Today</h3>
                    <p className="text-sm text-white/45 font-light leading-relaxed">
                      A fully integrated private equity, AI trading, and commerce platform. Multiple live projects, active AI plans, and a growing global investor community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY TESLA INC */}
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
                Why Tesla Inc
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                What Sets Us<br />
                <span className="text-white/30">Apart</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-5 p-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-[0.03em]">
                    Real Private Equity — Not Tokens
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed">
                    Our investment vehicles provide structured stake exposure in the actual companies, not synthetic derivatives or tokenised representations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-[0.03em]">
                    Proprietary AI Infrastructure
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed">
                    The AI Capital Programs are built on systems developed in-house — not third-party managed funds or copy-trading platforms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-[0.03em]">
                    Curated Portfolio
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed">
                    We don't list every startup seeking capital. Every company in our portfolio is hand-selected based on defensible moat, leadership quality, and civilisational relevance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-[0.03em]">
                    Community of Investors
                  </h3>
                  <p className="text-sm text-white/45 font-light leading-relaxed">
                    Our investor base spans 50+ countries. Membership tiers provide elevated access, exclusive deals, and priority allocation for loyal long-term participants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PRINCIPLES */}
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
                Core Principles
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-black">
                What We<br />
                <span className="text-black/30">Believe In</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Eye className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Transparency First</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  Every project shows its funding progress, investor count, yield structure, and risk level in full. No hidden fees, no opaque strategies.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Investor Protection</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  KYC verification, segregated fund accounts, and systematic risk controls exist for one reason: to protect your capital before anything else.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Target className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Access for All</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  Pre-IPO private equity has historically been reserved for institutions and ultra-high-net-worth individuals. We believe that barrier should not exist.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Technology-Led</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  From algorithmic trading to AI risk management to real-time portfolio dashboards, every layer of this platform is built on technology — not guesswork.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Heart className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Long-Term Alignment</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  We succeed only when our investors succeed. Our fee structure, risk architecture, and investment curation all reflect that singular alignment.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(232,33,39,0.08)] hover:border-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Global Perspective</h3>
                <div className="w-6 h-[2px] bg-red-500/30 rounded-full mb-3"></div>
                <p className="text-sm text-black/55 font-light leading-relaxed">
                  Innovation is borderless. We serve investors across 50+ countries, accepting multi-currency deposits and offering globally relevant investment opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section className="relative w-full bg-black py-20 sm:py-28 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium mb-4">
                Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.05em] text-white">
                The Team<br />
                <span className="text-white/30">Behind the Platform</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-black text-red-400">MC</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Marcus Chen</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-red-500/70 font-medium mb-4">
                  Chief Executive Officer
                </p>
                <div className="w-6 h-[1px] bg-white/[0.1] mb-4"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed">
                  Former VP at Bridgewater Associates with 15 years in alternative investments and private equity structuring.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-black text-red-400">SR</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Sofia Reyes</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-red-500/70 font-medium mb-4">
                  Chief Investment Officer
                </p>
                <div className="w-6 h-[1px] bg-white/[0.1] mb-4"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed">
                  Ex-Goldman Sachs technology equity analyst. Specialist in pre-IPO valuation and venture-stage private markets.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-black text-red-400">JK</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">James Kowalski</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-red-500/70 font-medium mb-4">
                  Chief Technology Officer
                </p>
                <div className="w-6 h-[1px] bg-white/[0.1] mb-4"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed">
                  Built algorithmic trading infrastructure at Two Sigma. Architect of the AI Capital Programs execution engine.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.12] transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <span className="text-sm font-black text-red-400">AL</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Amara Levi</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-red-500/70 font-medium mb-4">
                  Head of Compliance
                </p>
                <div className="w-6 h-[1px] bg-white/[0.1] mb-4"></div>
                <p className="text-xs text-white/40 font-light leading-relaxed">
                  15 years in financial regulation across the SEC and private sector. Leads our KYC, AML, and investor protection frameworks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
