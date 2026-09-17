import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle, FolderOpen } from 'lucide-react';
import { fetchProjects as loadProjects, type Project } from '../lib/projects';

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
  status: string;
  imageUrl: string;
  description: string;
  displayMetric: string | null;
  targetAmount: string | null;
}

const getCategoryStyles = (category: string | null) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('doge')) {
    return {
      tag: category || 'Dogecoin',
      tagBg: '#C2A63330',
      tagColor: '#C2A633',
      tagBorder: '#C2A63350',
      radialColor: '#C2A63360',
      accentColor: '#C2A633',
    };
  }
  if (cat.includes('xai') || cat.includes('ai')) {
    return {
      tag: category || 'xAI',
      tagBg: '#1a1a2e30',
      tagColor: '#818cf8',
      tagBorder: '#1a1a2e50',
      radialColor: '#1a1a2e60',
      accentColor: '#818cf8',
    };
  }
  if (cat.includes('tesla')) {
    return {
      tag: category || 'Tesla',
      tagBg: '#CC000030',
      tagColor: '#CC0000',
      tagBorder: '#CC000050',
      radialColor: '#CC000060',
      accentColor: '#CC0000',
    };
  }
  if (cat.includes('spacex') || cat.includes('space')) {
    return {
      tag: category || 'SpaceX',
      tagBg: '#0047AB30',
      tagColor: '#3b82f6',
      tagBorder: '#0047AB50',
      radialColor: '#0047AB60',
      accentColor: '#3b82f6',
    };
  }
  if (cat.includes('boring')) {
    return {
      tag: category || 'The Boring Company',
      tagBg: '#E05A0030',
      tagColor: '#E05A00',
      tagBorder: '#E05A0050',
      radialColor: '#E05A0060',
      accentColor: '#E05A00',
    };
  }
  if (cat.includes('neuralink')) {
    return {
      tag: category || 'Neuralink',
      tagBg: '#4B008230',
      tagColor: '#a855f7',
      tagBorder: '#4B008250',
      radialColor: '#4B008260',
      accentColor: '#a855f7',
    };
  }
  return {
    tag: category || 'Project',
    tagBg: 'rgba(255, 255, 255, 0.1)',
    tagColor: '#3b82f6',
    tagBorder: 'rgba(255, 255, 255, 0.2)',
    radialColor: 'rgba(59, 130, 246, 0.3)',
    accentColor: '#3b82f6',
  };
};

const formatTargetAmount = (amount: number | null): string | null => {
  if (amount == null) return null;
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await loadProjects();

        if (isMounted) {
          const mapped: ProjectItem[] = (rawData as Project[]).map((db) => {
            const style = getCategoryStyles(db.category);
            return {
              id: db.id,
              slug: db.slug || db.id,
              title: db.name,
              tag: style.tag,
              tagBg: style.tagBg,
              tagColor: style.tagColor,
              tagBorder: style.tagBorder,
              radialColor: style.radialColor,
              accentColor: style.accentColor,
              status: db.status || 'Open',
              imageUrl: db.image_url || '',
              description: db.description || 'Details available upon request.',
              displayMetric: db.display_metric || null,
              targetAmount: formatTargetAmount(db.target_amount),
            };
          });
          setProjects(mapped);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching projects:', err);
          setError(err?.message || 'Failed to load projects. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openProjectsCount = projects.filter(
    (p) => p.status.toLowerCase() === 'open' || p.status.toLowerCase() === 'active'
  ).length;

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

      {/* Projects Grid / State Handling Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
            <p className="text-sm font-semibold text-white/60">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-red-500/20 bg-red-500/[0.05] text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Failed to load projects</h3>
            <p className="text-xs text-white/50 mb-6">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/[0.06] rounded-2xl bg-[#0a0a0a] max-w-xl mx-auto px-6">
            <FolderOpen className="w-12 h-12 text-white/20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Available</h3>
            <p className="text-xs text-white/40 max-w-md leading-relaxed">
              There are currently no active investment opportunities listed. Please check back soon or explore our platform guide.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const isImageFailed = failedImages[project.id] || !project.imageUrl;

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
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-base font-bold text-white">
                            {project.displayMetric || 'Details available'}
                          </p>
                          <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">
                            Highlight Metric
                          </p>
                        </div>
                        <div className="border-l border-white/[0.06]">
                          <p className="text-base font-bold text-white">
                            {project.targetAmount || 'Details available'}
                          </p>
                          <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">
                            Target Amount
                          </p>
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
        )}

        <p className="mt-16 text-[11px] text-white/15 text-center max-w-2xl mx-auto leading-relaxed">
          All investment opportunities involve risk, including the possible loss of principal. Past performance does not guarantee future returns. Projected yields are estimates only and are not guaranteed. Tesla Inc is not a registered broker-dealer or investment adviser.
        </p>
      </div>
    </main>
  );
};

export default ProjectsPage;
