import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  tagBorder: string;
  radialColor: string;
  accentColor: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
  imageUrl: string;
  description: string;
  yieldRange: string;
  minimumInvestment: string;
  investorsCount: string | number;
  raisedAmount: string;
  raisedPercentage: string;
  progressBarPercentage: number;
  targetAmount: string;
  timeLeft: string;
}

const initialProjects: ProjectItem[] = [
  {
    id: 'doge-reserve-fund',
    slug: 'doge-reserve-fund',
    title: 'Dogecoin Reserve Fund',
    tag: 'Dogecoin',
    tagBg: '#C2A63330',
    tagColor: '#C2A633',
    tagBorder: '#C2A63350',
    radialColor: '#C2A63360',
    accentColor: '#C2A633',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248208/projects/doge-reserve.jpg',
    description: "Ride the world's most iconic meme coin with institutional-grade exposure",
    yieldRange: '40%–120%',
    minimumInvestment: '$1K',
    investorsCount: 437,
    raisedAmount: '$55.51B',
    raisedPercentage: '100.0%',
    progressBarPercentage: 100,
    targetAmount: '$50.0M',
    timeLeft: '29d left',
  },
  {
    id: 'xai-colossus-ii-gpu-cluster',
    slug: 'xai-colossus-ii-gpu-cluster',
    title: 'xAI Colossus II — 1M GPU Cluster',
    tag: 'xAI',
    tagBg: '#1a1a2e30',
    tagColor: '#818cf8',
    tagBorder: '#1a1a2e50',
    radialColor: '#1a1a2e60',
    accentColor: '#818cf8',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg',
    description: "Back the infrastructure powering the world's most powerful AI",
    yieldRange: '28%–90%',
    minimumInvestment: '$10K',
    investorsCount: 289,
    raisedAmount: '$128.0M',
    raisedPercentage: '42.7%',
    progressBarPercentage: 42.7,
    targetAmount: '$300.0M',
    timeLeft: '29d left',
  },
  {
    id: 'tesla-gigafactory-mexico-phase-1',
    slug: 'tesla-gigafactory-mexico-phase-1',
    title: 'Gigafactory Mexico — Phase 1',
    tag: 'Tesla',
    tagBg: '#CC000030',
    tagColor: '#CC0000',
    tagBorder: '#CC000050',
    radialColor: '#CC000060',
    accentColor: '#CC0000',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248179/projects/tesla-gigafactory-mexico.jpg',
    description: 'Fund the next generation of affordable Tesla vehicles',
    yieldRange: '18%–45%',
    minimumInvestment: '$3K',
    investorsCount: 542,
    raisedAmount: '$91.5M',
    raisedPercentage: '45.8%',
    progressBarPercentage: 45.8,
    targetAmount: '$200.0M',
    timeLeft: '0d left',
  },
  {
    id: 'spacex-starship-commercial-fleet',
    slug: 'spacex-starship-commercial-fleet',
    title: 'Starship Commercial Fleet Expansion',
    tag: 'SpaceX',
    tagBg: '#0047AB30',
    tagColor: '#3b82f6',
    tagBorder: '#0047AB50',
    radialColor: '#0047AB60',
    accentColor: '#3b82f6',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248177/projects/spacex-starship.jpg',
    description: "Own a stake in the world's most powerful rocket programme",
    yieldRange: '22%–65%',
    minimumInvestment: '$5K',
    investorsCount: 318,
    raisedAmount: '$47.2M',
    raisedPercentage: '31.5%',
    progressBarPercentage: 31.5,
    targetAmount: '$150.0M',
    timeLeft: '0d left',
  },
  {
    id: 'boring-company-tunnel-network',
    slug: 'boring-company-tunnel-network',
    title: 'Underground Tunnel Network',
    tag: 'The Boring Company',
    tagBg: '#E05A0030',
    tagColor: '#E05A00',
    tagBorder: '#E05A0050',
    radialColor: '#E05A0060',
    accentColor: '#E05A00',
    status: 'Open',
    imageUrl: 'https://www.teslaincorp.pro/images/hero2.jpg',
    description: "The infrastructure layer beneath tomorrow's cities. Zero traffic. Zero emissions. Full-speed point-to-point transit.",
    yieldRange: '15%–55%',
    minimumInvestment: '$1K',
    investorsCount: '5,216',
    raisedAmount: '$89.7M',
    raisedPercentage: '35.9%',
    progressBarPercentage: 35.9,
    targetAmount: '$250.0M',
    timeLeft: '0d left',
  },
  {
    id: 'spacex-space-city',
    slug: 'spacex-space-city',
    title: 'Space City Infrastructure Fund',
    tag: 'SpaceX',
    tagBg: '#0047AB30',
    tagColor: '#3b82f6',
    tagBorder: '#0047AB50',
    radialColor: '#0047AB60',
    accentColor: '#3b82f6',
    status: 'Open',
    imageUrl: 'https://www.teslaincorp.pro/images/hero1.jpg',
    description: "Own a stake in humanity's first interplanetary city. Boca Chica is being transformed — be part of the foundation.",
    yieldRange: '18%–75%',
    minimumInvestment: '$1K',
    investorsCount: '3,847',
    raisedAmount: '$127.4M',
    raisedPercentage: '25.5%',
    progressBarPercentage: 25.5,
    targetAmount: '$500.0M',
    timeLeft: '13d left',
  },
  {
    id: 'boring-company-lvcc-phase-3',
    slug: 'boring-company-lvcc-phase-3',
    title: 'Las Vegas Loop — Convention Centre Phase 3',
    tag: 'The Boring Company',
    tagBg: '#FF6B0030',
    tagColor: '#FF6B00',
    tagBorder: '#FF6B0050',
    radialColor: '#FF6B0060',
    accentColor: '#FF6B00',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248185/projects/boring-co-lvcc.webp',
    description: "Stake your claim in the world's first high-speed urban tunnel network",
    yieldRange: '15%–35%',
    minimumInvestment: '$5K',
    investorsCount: 5,
    raisedAmount: '$803.6M',
    raisedPercentage: '100.0%',
    progressBarPercentage: 100,
    targetAmount: '$120.0M',
    timeLeft: '90d left',
  },
  {
    id: 'neuralink-n2-clinical-programme',
    slug: 'neuralink-n2-clinical-programme',
    title: 'Neuralink N2 — Expanded Clinical Programme',
    tag: 'Neuralink',
    tagBg: '#4B008230',
    tagColor: '#a855f7',
    tagBorder: '#4B008250',
    radialColor: '#4B008260',
    accentColor: '#a855f7',
    status: 'Open',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248290/projects/neuralink-n2.jpg',
    description: 'Invest in the future of human-computer symbiosis',
    yieldRange: '30%+',
    minimumInvestment: '$10K',
    investorsCount: 143,
    raisedAmount: '$19.4M',
    raisedPercentage: '24.3%',
    progressBarPercentage: 24.3,
    targetAmount: '$80.0M',
    timeLeft: '60d left',
  },
];

export const ProjectsPage: React.FC = () => {
  const [projects] = useState<ProjectItem[]>(initialProjects);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openProjectsCount = projects.filter((p) => p.status === 'Open').length;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 px-6 sm:px-10 lg:px-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full bg-orange-500/10 blur-[100px]"></div>
        </div>
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white/20"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/35">
              Private Market Access
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6">
            Investment
            <br />
            <span className="text-white/25">Opportunities</span>
          </h1>

          <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-xl">
            Direct exposure to the world's most consequential private companies. Tiered entry, transparent yield structure, no lock-up minimums.
          </p>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-white/[0.06]">
            <div>
              <p className="text-2xl font-bold text-white">{openProjectsCount}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Open Now</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Total Projects</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <p className="text-2xl font-bold text-white">$1K</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Min. Entry</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <p className="text-2xl font-bold text-white">120%+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Max Projected Yield</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isImageFailed = failedImages[project.id];

            return (
              <div
                key={project.id}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.15] transition-all duration-500 bg-[#0a0a0a]"
              >
                <a className="block" href={`/projects/${project.slug}`}>
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-zinc-900">
                    {!isImageFailed ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white/40 p-4 text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider mb-1">
                          {project.tag}
                        </span>
                        <span className="text-sm font-bold text-white">{project.title}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top right, ${project.radialColor} 0%, transparent 60%)`,
                      }}
                    ></div>

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span
                        className="px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full backdrop-blur-md"
                        style={{
                          backgroundColor: project.tagBg,
                          color: project.tagColor,
                          border: `1px solid ${project.tagBorder}`,
                        }}
                      >
                        {project.tag}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full border backdrop-blur-md bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                        {project.status}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white tracking-tight mb-1 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-white/55 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] p-5 space-y-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-base font-bold text-white">{project.yieldRange}</p>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Yield</p>
                      </div>
                      <div className="border-x border-white/[0.06]">
                        <p className="text-base font-bold text-white">{project.minimumInvestment}</p>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Minimum</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-white">{project.investorsCount}</p>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">Investors</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-white">
                          {project.raisedAmount} raised
                        </span>
                        <span className="text-[11px] text-white/40">{project.raisedPercentage}</span>
                      </div>
                      <div className="h-1 w-full bg-white/[0.1] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${project.progressBarPercentage}%`,
                            backgroundColor: project.accentColor,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/30">of {project.targetAmount}</span>
                        <span className="text-[10px] text-white/30">{project.timeLeft}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-[11px] text-white/35">View investment details</span>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-2.5"
                        style={{ color: project.accentColor }}
                      >
                        Invest Now
                        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        <p className="mt-16 text-[11px] text-white/15 text-center max-w-2xl mx-auto leading-relaxed">
          All investment opportunities involve risk, including the possible loss of principal. Past performance does not guarantee future returns. Projected yields are estimates only and are not guaranteed. Tesla Inc is not a registered broker-dealer or investment adviser.
        </p>
      </div>
    </main>
  );
};

export default ProjectsPage;
