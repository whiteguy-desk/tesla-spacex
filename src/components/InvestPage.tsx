import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Info,
  Loader2,
  X,
  Sparkles,
  Filter,
} from 'lucide-react';
import { fetchProjects, type Project } from '../lib/projects';
import { useAuth } from '../hooks/useAuth';
import { savePaymentRequestContext, generateReferenceId } from '../lib/paymentContext';
import { navigate } from '../lib/navigation';
import { PageTransition, Reveal, StaggerContainer, MotionCard } from './MotionSystem';

const CATEGORIES = ['All', 'Space', 'Energy', 'Mobility', 'AI', 'Infrastructure', 'Connectivity'];

export const InvestPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Allocation Request Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [requestAmount, setRequestAmount] = useState<number>(5000);
  const [requestNotes, setRequestNotes] = useState<string>('');

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

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const handleOpenRequestModal = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/invest/login?redirect=/invest');
      return;
    }

    setSelectedProject(project);
    setRequestAmount(project.min_investment || 2500);
    setRequestNotes('');
  };

  const handleConfirmInvestmentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !user) return;

    const ref = generateReferenceId('investment');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'investment',
      reference_id: ref,
      project_id: selectedProject.id,
      project_name: selectedProject.name,
      item_name: selectedProject.name,
      amount: requestAmount,
      currency: 'USD',
      notes: requestNotes,
      customer_name: customerName,
      customer_email: user.email,
      is_submitted: false,
    });

    setSelectedProject(null);
    navigate(`/payment?ref=${ref}`);
  };

  return (
    <PageTransition className="bg-[#030304] text-white min-h-screen font-sans selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 w-full min-h-screen pb-24">
        {/* HERO HEADER */}
        <section className="relative pt-32 sm:pt-40 pb-12 px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold uppercase tracking-widest text-red-400 backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Capital &amp; Venture Direct Portal
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl text-white font-sans">
                Explore The <span className="text-[#e82127]">Future</span>
              </h1>

              <p className="text-xs sm:text-sm text-white/70 font-light max-w-2xl leading-relaxed">
                Discover next-generation technology participation opportunities across orbital space exploration, utility energy storage, AI compute clusters, and autonomous mobility.
              </p>
            </div>
          </Reveal>
        </section>

        {/* CATEGORY FILTERING & OPPORTUNITIES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          {/* CATEGORY NAV TABS */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono font-bold uppercase text-white/50 tracking-wider">
                Sectors:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#e82127] text-white shadow-[0_0_15px_rgba(232,33,39,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* OPPORTUNITIES GRID */}
          {loadingProjects ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
              <p className="text-xs uppercase font-mono tracking-widest text-white/50">
                Loading Investment Opportunities...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-[#08080a] rounded-2xl border border-white/10 p-6">
              <p className="text-sm text-white/50 font-mono">No opportunities found for sector "{activeCategory}".</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => {
                const isImgFailed = failedImages[project.id];

                return (
                  <MotionCard key={project.id}>
                    <div className="group rounded-2xl bg-[#08080a] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl h-full">
                      <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-900">
                        {!isImgFailed && project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.name}
                            onError={() => handleImageError(project.id)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-neutral-900 to-black flex items-center justify-center p-4">
                            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">{project.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 border border-white/10">
                            {project.category || 'Technology'}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 border border-white/10">
                            Available
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                        {/* FEATURE TAGS */}
                        {project.features && project.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.features.slice(0, 3).map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ILLUSTRATIVE METRIC */}
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs flex justify-between items-center">
                          <span className="text-white/40 uppercase text-[10px]">Scale Metric:</span>
                          <span className="text-emerald-400 font-bold">{project.display_metric || 'Variable Target'}</span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={(e) => handleOpenRequestModal(project, e)}
                            className="w-full py-3.5 px-4 rounded-xl bg-[#e82127] hover:bg-red-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(232,33,39,0.4)]"
                          >
                            <span>Request Order Allocation</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </MotionCard>
                );
              })}
            </StaggerContainer>
          )}
        </section>

        {/* ALLOCATION REQUEST MODAL */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#08080a] border border-white/20 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative my-8">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase font-mono">
                    Investment Order Request
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight pt-1">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-white/60 font-light">
                  Enter your requested investment allocation amount. You will review settlement details on the Payment Page.
                </p>
              </div>

              <form onSubmit={handleConfirmInvestmentRequest} className="space-y-4">
                <div>
                  <label htmlFor="requestAmountInput" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Requested Amount (USD)
                  </label>
                  <input
                    id="requestAmountInput"
                    type="number"
                    required
                    min={selectedProject.min_investment || 1000}
                    step={500}
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-[#e82127]"
                  />
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    Minimum suggested entry: ${(selectedProject.min_investment || 1000).toLocaleString()} USD
                  </p>
                </div>

                <div>
                  <label htmlFor="requestNotesInput" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Notes / Allocation Preferences (Optional)
                  </label>
                  <textarea
                    id="requestNotesInput"
                    rows={3}
                    placeholder="Specify allocation preferences or questions..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-[#e82127]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 leading-relaxed font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white/90">
                    <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    Notice
                  </div>
                  <p>
                    Proceeding will forward your allocation parameters to the General Payment Page (`/payment?ref=...`).
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-[#e82127] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
};

export default InvestPage;
