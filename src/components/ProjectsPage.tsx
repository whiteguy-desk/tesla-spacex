import React, { useState, useEffect, useContext } from 'react';
import { ChevronRight, Loader2, AlertCircle, FolderOpen, X, ArrowRight } from 'lucide-react';
import { fetchProjects as loadProjects, type Project } from '../lib/projects';
import { AuthContext } from '../context/AuthContext';
import { savePaymentRequestContext, generateReferenceId } from '../lib/paymentContext';
import { navigate } from '../lib/navigation';

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
      tagBorder: '#818cf850',
      radialColor: '#818cf860',
      accentColor: '#818cf8',
    };
  }
  if (cat.includes('spacex') || cat.includes('aerospace')) {
    return {
      tag: category || 'SpaceX',
      tagBg: '#0284c730',
      tagColor: '#38bdf8',
      tagBorder: '#38bdf850',
      radialColor: '#38bdf860',
      accentColor: '#38bdf8',
    };
  }
  if (cat.includes('neuralink') || cat.includes('neuro')) {
    return {
      tag: category || 'Neuralink',
      tagBg: '#7c3aed30',
      tagColor: '#a78bfa',
      tagBorder: '#a78bfa50',
      radialColor: '#a78bfa60',
      accentColor: '#a78bfa',
    };
  }
  if (cat.includes('boring') || cat.includes('transit')) {
    return {
      tag: category || 'Boring Co.',
      tagBg: '#ea580c30',
      tagColor: '#fb923c',
      tagBorder: '#fb923c50',
      radialColor: '#fb923c60',
      accentColor: '#fb923c',
    };
  }
  return {
    tag: category || 'Tesla',
    tagBg: '#e8212730',
    tagColor: '#f87171',
    tagBorder: '#f8717150',
    radialColor: '#e8212760',
    accentColor: '#e82127',
  };
};

export const ProjectsPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Modal State
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('2500');

  useEffect(() => {
    let isMounted = true;
    async function getProjects() {
      try {
        setLoading(true);
        setError(null);

        const data: Project[] = await loadProjects();

        if (!isMounted) return;

        const formattedProjects: ProjectItem[] = data.map((p) => {
          const styles = getCategoryStyles(p.category);
          return {
            id: p.id,
            slug: p.slug,
            title: p.name,
            tag: styles.tag,
            tagBg: styles.tagBg,
            tagColor: styles.tagColor,
            tagBorder: styles.tagBorder,
            radialColor: styles.radialColor,
            accentColor: styles.accentColor,
            status: p.status === 'Open' ? 'Open for Allocation' : p.status || 'Active',
            imageUrl: p.image_url,
            description: p.description,
            displayMetric: p.display_metric,
            targetAmount: p.target_amount ? `$${(p.target_amount / 1000000).toFixed(0)}M Target` : null,
          };
        });

        setProjects(formattedProjects);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error in ProjectsPage component:', err);
        setError(err.message || 'An error occurred while loading projects.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const openProjectsCount = projects.filter(
    (p) => p.status.toLowerCase().includes('open') || p.status.toLowerCase().includes('active')
  ).length;

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenInvestModal = (project: ProjectItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/invest/login?redirect=/projects');
      return;
    }
    setSelectedProject(project);
    setInvestAmount('2500');
  };

  const handleConfirmInvestRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !user) return;

    const numAmount = parseFloat(investAmount) || 2500;
    const ref = generateReferenceId('investment');

    savePaymentRequestContext({
      request_type: 'investment',
      reference_id: ref,
      project_id: selectedProject.id,
      project_name: selectedProject.title,
      item_name: selectedProject.title,
      amount: numAmount,
      currency: 'USD',
      customer_email: user.email,
      is_submitted: false,
    });

    setSelectedProject(null);
    navigate(`/payment?ref=${ref}`);
  };

  return (
    <main className="min-h-screen bg-[#030304] text-white pt-24 font-sans selection:bg-red-500 selection:text-white">
      {/* Header / Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-16">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
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
            Direct exposure to technology platforms. Tiered entry, transparent yield structure, no lock-up minimums.
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
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
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
              There are currently no active investment opportunities listed.
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
                  <div>
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
                          onClick={(e) => handleOpenInvestModal(project, e)}
                          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer"
                          style={{ color: project.accentColor }}
                        >
                          Invest Now
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Investment Request Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">Project Allocation Request</span>
              <h3 className="text-xl font-black text-white uppercase mt-1">{selectedProject.title}</h3>
              <p className="text-xs text-white/50 font-light mt-1">
                Enter your requested allocation amount and proceed to the Payment Page.
              </p>
            </div>

            <form onSubmit={handleConfirmInvestRequest} className="space-y-4">
              <div>
                <label htmlFor="investAmountInput" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                  Requested Investment Amount (USD)
                </label>
                <input
                  id="investAmountInput"
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-red-500"
                />
                <p className="text-[10px] text-white/40 mt-1">Minimum entry: $1,000</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;
