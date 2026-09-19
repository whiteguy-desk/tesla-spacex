import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Loader2,
  AlertCircle,
  FolderOpen,
  X,
  ArrowRight,
  Sparkles,
  Info,
  MapPin,
  Layers,
  Calendar,
} from 'lucide-react';
import { fetchProjects, type Project } from '../lib/projects';
import { useAuth } from '../hooks/useAuth';
import { savePaymentRequestContext, generateReferenceId } from '../lib/paymentContext';
import { navigate } from '../lib/navigation';
import { PageTransition, Reveal, StaggerContainer, MotionCard } from './MotionSystem';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Active detail modal project
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);

  // Allocation Request Modal state
  const [requestingProject, setRequestingProject] = useState<Project | null>(null);
  const [allocAmount, setAllocAmount] = useState<number>(2500);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProjects();
        if (!isMounted) return;
        setProjects(data);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error in ProjectsPage component:', err);
        setError(err.message || 'An error occurred while loading projects.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenDetailModal = (project: Project) => {
    setActiveDetailProject(project);
  };

  const handleOpenAllocationModal = (project: Project, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      navigate('/invest/login?redirect=/projects');
      return;
    }

    // Close detail modal if open
    setActiveDetailProject(null);
    setRequestingProject(project);
    setAllocAmount(project.min_investment || 2500);
  };

  const handleConfirmAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestingProject || !user) return;

    const ref = generateReferenceId('investment');

    savePaymentRequestContext({
      request_type: 'investment',
      reference_id: ref,
      project_id: requestingProject.id,
      project_name: requestingProject.name,
      item_name: requestingProject.name,
      amount: allocAmount,
      currency: 'USD',
      customer_email: user.email,
      is_submitted: false,
    });

    setRequestingProject(null);
    navigate(`/payment?ref=${ref}`);
  };

  const minDemoEntry = projects.length > 0
    ? Math.min(...projects.map((p) => p.min_investment || 1000))
    : 1000;

  return (
    <PageTransition className="min-h-screen bg-[#030304] text-white pt-24 pb-28 font-sans selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* HERO SECTION */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-14 border-b border-white/10">
          <Reveal>
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-mono font-bold uppercase tracking-widest text-red-400 backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Technology Portfolio Initiatives
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white">
                Project Discovery <span className="text-white/30">&amp; Allocations</span>
              </h1>

              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-2xl">
                Explore frontier technology initiatives across orbital launch infrastructure, utility battery storage, high-bandwidth satellite networks, and AI supercomputing clusters.
              </p>

              {/* HERO STATS BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-2xl font-bold font-mono text-white">{projects.length}</p>
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-1">Active Projects</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-2xl font-bold font-mono text-emerald-400">
                    ${minDemoEntry.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-1">Min Entry</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-2xl font-bold font-mono text-white">6</p>
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-1">Tech Sectors</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-2xl font-bold font-mono text-red-400">2026-2030</p>
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mt-1">Timeline Scope</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* MAIN PROJECTS LISTING */}
        <section className="pt-12 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
              <p className="text-xs uppercase font-mono tracking-widest text-white/50">
                Fetching Project Telemetry...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-red-950/20 border border-red-500/30 text-center space-y-4 max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold uppercase text-white">Error Loading Projects</h3>
              <p className="text-xs text-white/60 font-mono">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-16 rounded-2xl bg-[#08080a] border border-white/10 text-center space-y-4 max-w-md mx-auto my-12">
              <FolderOpen className="w-12 h-12 text-white/20 mx-auto" />
              <h3 className="text-lg font-bold uppercase text-white">No Projects Available</h3>
              <p className="text-xs text-white/50">Project data is currently empty or unavailable.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project) => {
                const isImgFailed = failedImages[project.id];

                return (
                  <MotionCard key={project.id}>
                    <div
                      onClick={() => handleOpenDetailModal(project)}
                      className="group rounded-2xl bg-[#08080a] border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between cursor-pointer h-full"
                    >
                      {/* CARD IMAGE CONTAINER */}
                      <div className="relative h-52 sm:h-60 overflow-hidden bg-zinc-900">
                        {!isImgFailed && project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.name}
                            onError={() => handleImageError(project.id)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-neutral-900 to-black flex items-center justify-center p-4">
                            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">{project.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent" />

                        {/* BADGES */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 border border-white/15">
                            {project.category || 'Technology'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                            {project.status || 'Active Round'}
                          </span>
                        </div>

                        {/* OVERLAY METRIC */}
                        {project.display_metric && (
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-xs text-white/80">
                            <span className="text-[10px] text-white/50 uppercase">Scale Target</span>
                            <span className="font-bold text-emerald-400">{project.display_metric}</span>
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold uppercase text-white group-hover:text-red-400 transition-colors">
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
                                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white/70"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CARD FOOTER & ACTION */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-mono text-white/40 uppercase block">Min Request Entry</span>
                            <span className="text-sm font-bold font-mono text-emerald-400">
                              ${(project.min_investment || 1000).toLocaleString()} USD
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleOpenAllocationModal(project, e)}
                            className="px-4 py-2.5 rounded-xl bg-[#e82127] hover:bg-red-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                          >
                            <span>Request Allocation</span>
                            <ChevronRight className="w-3.5 h-3.5" />
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

        {/* PROJECT DETAIL MODAL */}
        {activeDetailProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#08080a] border border-white/20 rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8 text-white">
              <button
                type="button"
                onClick={() => setActiveDetailProject(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close detail modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase font-mono">
                    {activeDetailProject.category || 'Technology Opportunity'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">
                    {activeDetailProject.status}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {activeDetailProject.name}
                </h2>
              </div>

              {activeDetailProject.image_url && !failedImages[activeDetailProject.id] && (
                <div className="h-56 sm:h-64 rounded-xl overflow-hidden bg-zinc-900 relative">
                  <img
                    src={activeDetailProject.image_url}
                    alt={activeDetailProject.name}
                    onError={() => handleImageError(activeDetailProject.id)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">
                    Overview
                  </h3>
                  <p className="text-sm text-white/80 font-light leading-relaxed">
                    {activeDetailProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  {activeDetailProject.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-white/40 block uppercase">Location</span>
                        <span className="text-white font-semibold">{activeDetailProject.location}</span>
                      </div>
                    </div>
                  )}
                  {activeDetailProject.sector && (
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-white/40 block uppercase">Sector</span>
                        <span className="text-white font-semibold">{activeDetailProject.sector}</span>
                      </div>
                    </div>
                  )}
                  {activeDetailProject.timeline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-white/40 block uppercase">Timeline</span>
                        <span className="text-white font-semibold">{activeDetailProject.timeline}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase">Min Entry Allocation</span>
                    <span className="text-emerald-400 font-bold">${(activeDetailProject.min_investment || 1000).toLocaleString()} USD</span>
                  </div>
                </div>

                {activeDetailProject.features && activeDetailProject.features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                      Key Technology Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDetailProject.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailProject(null)}
                  className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => handleOpenAllocationModal(activeDetailProject, e)}
                  className="flex-1 py-3.5 rounded-xl bg-[#e82127] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Allocation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALLOCATION REQUEST FORM MODAL */}
        {requestingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#08080a] border border-white/20 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative my-8 text-white">
              <button
                type="button"
                onClick={() => setRequestingProject(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase font-mono">
                  Allocation Request
                </span>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight pt-1">
                  {requestingProject.name}
                </h2>
                <p className="text-xs text-white/60 font-light">
                  Select your requested allocation amount. You will be redirected to the Payment Page to finalize the request context.
                </p>
              </div>

              <form onSubmit={handleConfirmAllocation} className="space-y-4">
                <div>
                  <label htmlFor="allocAmountInput" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Allocation Amount (USD)
                  </label>
                  <input
                    id="allocAmountInput"
                    type="number"
                    required
                    min={requestingProject.min_investment || 1000}
                    step={500}
                    value={allocAmount}
                    onChange={(e) => setAllocAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-[#e82127]"
                  />
                  <p className="text-[10px] text-white/40 mt-1 font-mono">
                    Minimum suggested entry: ${(requestingProject.min_investment || 1000).toLocaleString()} USD
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white/90">
                    <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    Notice
                  </div>
                  <p>
                    Submitting this form stores your request parameters in local session context and redirects to the central payment request route (`/payment?ref=...`).
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestingProject(null)}
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
      </div>
    </PageTransition>
  );
};

export default ProjectsPage;
