import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Info,
  Loader2,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';
import { fetchProjects, type Project } from '../lib/projects';
import { useAuth } from '../hooks/useAuth';
import { savePaymentRequestContext, generateReferenceId } from '../lib/paymentContext';
import { navigate } from '../lib/navigation';

export const InvestPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Request Modal state
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
    <div className="bg-[#030304] text-white min-h-screen font-sans selection:bg-red-500 selection:text-white">
      {/* Background Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 w-full min-h-screen pb-24">
        {/* HERO HEADER */}
        <section className="relative pt-32 sm:pt-40 pb-16 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold uppercase tracking-widest text-red-400 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Institutional &amp; Private Equity Portal
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl text-white">
              Invest In The <span className="text-red-500">Future</span>
            </h1>

            <p className="text-sm sm:text-base text-white/60 font-light max-w-2xl leading-relaxed">
              Explore direct technology allocations across SpaceX, xAI, Tesla Gigafactories, and Neuralink. Secure your participation request for review.
            </p>
          </div>
        </section>

        {/* DEMO OPPORTUNITIES GRID */}
        <section className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold uppercase text-white font-mono">
                Open Opportunities ({projects.length})
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono uppercase">
              Minimum Entry: $1,000 USD
            </span>
          </div>

          {loadingProjects ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
              <p className="text-xs uppercase font-mono tracking-widest text-white/50">
                Loading Opportunities...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-[#08080a] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden bg-zinc-900">
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 border border-white/10">
                        {project.category || 'Technology'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-white/60 font-light mt-1.5 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs flex justify-between items-center">
                      <span className="text-white/40 uppercase text-[10px]">Target Return:</span>
                      <span className="text-emerald-400 font-bold">{project.display_metric || 'Variable Yield'}</span>
                    </div>

                    <div className="pt-2">
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
                    Allocation Request
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight pt-1">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-white/60 font-light">
                  Enter your requested allocation amount. You will review settlement details on the Payment Page.
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
                    Proceeding will forward your allocation parameters to the General Payment Page.
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
    </div>
  );
};

export default InvestPage;
