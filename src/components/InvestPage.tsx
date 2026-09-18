import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  ShieldAlert,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';
import { fetchProjects, type Project } from '../lib/projects';
import { useAuth } from '../hooks/useAuth';
import { submitInvestmentRequest } from '../lib/paymentRequests';
import { navigate } from '../lib/navigation';

export const InvestPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Request Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [requestAmount, setRequestAmount] = useState<number>(5000);
  const [requestNotes, setRequestNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal state
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    projectName: string;
    amount: number;
  } | null>(null);

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

  const handleOpenRequestModal = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();

    // Unauthenticated visitors are routed to login with redirect context
    if (!user) {
      navigate('/invest/login?redirect=/invest');
      return;
    }

    setSelectedProject(project);
    setRequestAmount(project.min_investment || 2500);
    setRequestNotes('');
  };

  const handleConfirmInvestmentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !user) return;

    setIsSubmitting(true);

    const result = await submitInvestmentRequest({
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      amount: requestAmount,
      currency: 'USD',
      notes: requestNotes,
    });

    setIsSubmitting(false);

    if (!result.success) {
      alert(result.message || 'Unable to submit investment request. Please try again.');
      return;
    }

    const refId =
      result.referenceId ||
      result.requestId ||
      `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const pName = selectedProject.name;
    const reqAmt = requestAmount;

    setSelectedProject(null);

    setSuccessData({
      referenceId: refId,
      projectName: pName,
      amount: reqAmt,
    });
  };

  return (
    <div className="bg-[#030304] text-white min-h-screen font-sans selection:bg-red-500 selection:text-white">
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 w-full min-h-screen pb-24">
        {/* HERO HEADER */}
        <section className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-xs uppercase tracking-[0.2em] font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#e82127]" />
            Independent Mobility &amp; Aerospace Technology Showcase
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-5xl mx-auto drop-shadow-md">
            Next-Generation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Technology Portfolio
            </span>{' '}
            <span className="text-[#e82127] font-semibold">Allocations</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Explore 10 curated private technology initiatives across clean energy, battery architecture, orbital transport, and artificial intelligence. Select a demo opportunity to request allocation details.
          </p>

          {/* GLOBAL MANDATORY DEMO DISCLOSURE */}
          <div className="mt-8 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left text-xs sm:text-sm text-amber-200/90 leading-relaxed space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mandatory Demo Disclosure &amp; Independent Project Notice</span>
            </div>
            <p>
              This page displays <strong>fictional mock opportunities</strong> designed solely for website demo and preview purposes. This website is an independent initiative and is <strong>not affiliated with, endorsed by, or representing official investment products of Tesla, Inc. or SpaceX</strong>.
            </p>
            <p className="text-amber-300/70 text-[11px] sm:text-xs">
              All metrics, projected returns, timelines, and target amounts shown are <strong>illustrative demo figures</strong>. No real securities, guaranteed returns, or official financial advisory products are offered on this page.
            </p>
          </div>
        </section>

        {/* OPPORTUNITIES GRID SECTION */}
        <section id="opportunities" className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#e82127]">
                Featured Portfolio
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                Active Demo Opportunities <span className="text-white/40">({projects.length})</span>
              </h2>
            </div>
            <div className="text-xs font-mono text-white/50">
              Showing exactly {projects.length} mock initiatives
            </div>
          </div>

          {loadingProjects ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-8 h-8 text-[#e82127] animate-spin mb-3" />
              <p className="text-xs font-mono uppercase tracking-widest text-white/50">
                Loading Demo Opportunities...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-2xl bg-[#08080a] border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 shadow-xl"
                >
                  {/* Card Header Media */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={project.image_url}
                      alt={`${project.name} (Demo Opportunity)`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-black/40" />

                    {/* DEMO / MOCK BADGES */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                        MOCK OPPORTUNITY
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      <Globe className="w-3 h-3 text-[#e82127]" />
                      <span>{project.location || 'Global'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold uppercase text-white tracking-wide leading-tight group-hover:text-red-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Min. Demo Entry</span>
                        <span className="text-white font-bold">
                          ${(project.min_investment || 2500).toLocaleString()} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase block">Target Demo Amount</span>
                        <span className="text-white font-bold">
                          ${((project.target_amount || 50000000) / 1000000).toFixed(0)}M USD
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-[10px] text-white/40 uppercase">Illustrative Demo Range</span>
                        <span className="text-emerald-400 font-bold text-[11px]">
                          {project.display_metric || 'Illustrative Only'}
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    {project.features && project.features.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                          Highlights
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-white/70 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action CTA Button */}
                    <div className="pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={(e) => handleOpenRequestModal(project, e)}
                        className="w-full py-3 px-4 rounded-xl bg-[#e82127] hover:bg-red-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(232,33,39,0.4)]"
                      >
                        <span>Request Investment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* REQUEST MODAL FOR AUTHENTICATED USER */}
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
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase font-mono">
                    Demo Allocation Request
                  </span>
                  <span className="text-[10px] text-white/50 font-mono uppercase">
                    ID: {selectedProject.id}
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight pt-1">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-white/60 font-light">
                  Submit an allocation request for this demo opportunity. Request details will be reviewed and sent to your registered email address.
                </p>
              </div>

              <form onSubmit={handleConfirmInvestmentRequest} className="space-y-4">
                <div>
                  <label htmlFor="requestAmountInput" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Requested Demo Amount (USD)
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
                    Minimum suggested demo entry: ${(selectedProject.min_investment || 1000).toLocaleString()} USD
                  </p>
                </div>

                <div>
                  <label htmlFor="requestNotesInput" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Notes / Allocation Preferences (Optional)
                  </label>
                  <textarea
                    id="requestNotesInput"
                    rows={3}
                    placeholder="Specify liquidity horizon preferences or questions..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-[#e82127]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Notice
                  </div>
                  <p>
                    Submitting this form records an official demo request in your dashboard and sends an email notification to <strong>{user?.email}</strong>.
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
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-xl bg-[#e82127] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* IN-APP SUCCESS MODAL */}
        {successData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#08080a] text-white border border-white/20 rounded-2xl p-6 sm:p-10 max-w-lg w-full space-y-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest font-mono">
                  Status: Pending Review
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  Investment Request Received
                </h2>
                <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                  Your request for <strong>{successData.projectName}</strong> has been logged.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-2 max-w-sm mx-auto font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Reference:</span>
                  <span className="text-emerald-400 font-bold">{successData.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Requested Amount:</span>
                  <span className="text-white font-bold">${successData.amount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Registered Email:</span>
                  <span className="text-white/80">{user?.email}</span>
                </div>
              </div>

              <p className="text-xs text-white/50 text-center leading-relaxed max-w-sm mx-auto">
                Further communication regarding your request will happen through your registered email address (<strong>{user?.email}</strong>).
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="/dashboard/projects"
                  className="flex-1 py-3.5 rounded-full bg-[#e82127] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-lg"
                >
                  View My Requests
                </a>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="flex-1 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider text-center transition-colors border border-white/10 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InvestPage;
