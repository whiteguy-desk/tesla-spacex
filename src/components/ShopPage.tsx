import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, X, Shield, Zap, ArrowRight } from 'lucide-react';
import { fetchVehicles, type Vehicle } from '../lib/vehicles';
import { useAuth } from '../hooks/useAuth';
import { submitVehiclePurchaseRequest } from '../lib/paymentRequests';
import { PageTransition, Reveal, StaggerContainer, MotionCard } from './MotionSystem';

export interface ShopPageProps {
  initialVehicles?: Vehicle[];
}

export const ShopPage: React.FC<ShopPageProps> = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [orderingState, setOrderingState] = useState<{ id: string; mode: 'full' | 'part' } | null>(null);

  // Success Modal state
  const [successModalData, setSuccessModalData] = useState<{
    referenceId: string;
    vehicleName: string;
    paymentOption: 'full' | 'part';
    fullPrice: number;
    partPayment: number;
    balance: number;
  } | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    fetchVehicles().then((data) => {
      if (mounted) {
        setVehicles(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activeVehicle = vehicles[currentSlideIndex] || vehicles[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? vehicles.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === vehicles.length - 1 ? 0 : prev + 1));
  };

  const handleOrder = async (vehicle: Vehicle, paymentOption: 'full' | 'part', e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/invest/login';
      return;
    }

    setOrderingState({ id: vehicle.id, mode: paymentOption });

    const partPay = vehicle.part_payment_amount || 5000;
    const result = await submitVehiclePurchaseRequest({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      paymentOption,
      fullPrice: vehicle.full_price,
      partPaymentAmount: partPay,
      quantity: 1,
    });

    setOrderingState(null);

    if (!result.success) {
      alert(result.message || 'Unable to submit vehicle order request. Please try again.');
      return;
    }

    const refId = result.referenceId || result.requestId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const balance = paymentOption === 'full' ? 0 : Math.max(0, vehicle.full_price - partPay);

    setSuccessModalData({
      referenceId: refId,
      vehicleName: vehicle.name,
      paymentOption,
      fullPrice: vehicle.full_price,
      partPayment: paymentOption === 'full' ? vehicle.full_price : partPay,
      balance,
    });
  };

  if (loading) {
    return (
      <div className="bg-[#030304] text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <p className="text-xs uppercase tracking-widest font-mono text-white/50">Loading Vehicles Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="bg-[#030304] text-[#f4f4f6] min-h-screen selection:bg-red-600/30 selection:text-white">
      <main className="w-full min-h-screen pb-24">
        {/* IN-APP SUCCESS MODAL */}
        {successModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#08080a] text-white border border-white/15 rounded-2xl p-6 sm:p-10 max-w-lg w-full space-y-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setSuccessModalData(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest font-mono">
                  Status: Pending Review
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Vehicle Order Request Received</h2>
                <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                  Your reservation request for <strong>{successModalData.vehicleName}</strong> has been registered.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-2 max-w-sm mx-auto font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Reference:</span>
                  <span className="text-emerald-400 font-bold">{successModalData.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Order Choice:</span>
                  <span className="text-red-400 font-bold uppercase text-[10px]">
                    {successModalData.paymentOption === 'full' ? 'Pay In Full' : 'Part Payment'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Full Vehicle Price:</span>
                  <span className="text-white/80">${successModalData.fullPrice.toLocaleString()} USD</span>
                </div>
                {successModalData.paymentOption === 'part' && (
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase text-[10px]">Initial Part Payment:</span>
                    <span className="text-emerald-400 font-bold">${successModalData.partPayment.toLocaleString()} USD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Remaining Balance:</span>
                  <span className="text-white/80">${successModalData.balance.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white/40 uppercase text-[10px]">Registered Email:</span>
                  <span className="text-white/80 truncate max-w-[160px]">{user?.email}</span>
                </div>
              </div>

              <p className="text-xs text-white/50 text-center leading-relaxed max-w-sm mx-auto">
                Our team will review your request and contact you directly at <strong>{user?.email}</strong> with settlement instructions and delivery allocation schedule.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="/dashboard/orders"
                  className="flex-1 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-lg"
                >
                  View My Orders
                </a>
                <button
                  type="button"
                  onClick={() => setSuccessModalData(null)}
                  className="flex-1 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider text-center transition-colors border border-white/10 cursor-pointer"
                >
                  Continue Catalog
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HERO CAROUSEL SECTION */}
        {activeVehicle && (
          <section className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden group bg-[#030304]">
            <div className="absolute inset-0 w-full h-full select-none" draggable={false}>
              <div
                key={activeVehicle.id}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                style={{ backgroundImage: `url(${activeVehicle.image_url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#030304] via-[#030304]/50 to-black/60 pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pointer-events-none px-4">
              <Reveal direction="down">
                <div className="text-center max-w-3xl mx-auto">
                  <span className="px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-3 backdrop-blur-md">
                    <Zap className="w-3.5 h-3.5 text-red-500" />
                    Featured Electric Platform
                  </span>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg font-sans uppercase">
                    {activeVehicle.name}
                  </h1>
                  <p className="text-sm sm:text-base text-white/80 mt-3 font-light tracking-wide max-w-xl mx-auto leading-relaxed drop-shadow-md">
                    {activeVehicle.description}
                  </p>

                  <div className="mt-6 max-w-lg mx-auto p-4 rounded-2xl bg-[#08080a]/90 backdrop-blur-md border border-white/15 text-white shadow-2xl">
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div>
                        <span className="text-white/40 text-[9px] uppercase tracking-wider block">Vehicle Price</span>
                        <span className="font-bold text-white text-sm sm:text-base">${activeVehicle.full_price.toLocaleString()}</span>
                      </div>
                      <div className="border-x border-white/15 px-1">
                        <span className="text-emerald-400 text-[9px] uppercase tracking-wider block font-sans font-bold">Part Payment</span>
                        <span className="font-bold text-emerald-400 text-sm sm:text-base">${(activeVehicle.part_payment_amount || 5000).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] uppercase tracking-wider block">Balance</span>
                        <span className="font-bold text-white/90 text-sm sm:text-base">${Math.max(0, activeVehicle.full_price - (activeVehicle.part_payment_amount || 5000)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="absolute bottom-10 sm:bottom-14 left-0 right-0 z-10 flex flex-col items-center gap-6 w-full px-6">
              <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleOrder(activeVehicle, 'full', e)}
                  disabled={orderingState?.id === activeVehicle.id}
                  className="w-full sm:w-1/2 text-center bg-white text-black hover:bg-white/90 text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {orderingState?.id === activeVehicle.id && orderingState.mode === 'full'
                    ? 'Submitting...'
                    : `Order Full Price ($${activeVehicle.full_price.toLocaleString()})`}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOrder(activeVehicle, 'part', e)}
                  disabled={orderingState?.id === activeVehicle.id}
                  className="w-full sm:w-1/2 text-center bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-2xl cursor-pointer disabled:opacity-50 border border-red-400/40"
                >
                  {orderingState?.id === activeVehicle.id && orderingState.mode === 'part'
                    ? 'Submitting...'
                    : `Request Part Payment ($${(activeVehicle.part_payment_amount || 5000).toLocaleString()})`}
                </button>
              </div>

              {/* Carousel Navigation Controls */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-6 bottom-1/2 translate-y-1/2 sm:left-12 sm:top-[-35vh] z-20 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-6 bottom-1/2 translate-y-1/2 sm:right-12 sm:top-[-35vh] z-20 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {vehicles.map((v, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`relative h-1.5 rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 cursor-pointer ${
                        isActive ? 'w-16 bg-red-500/40' : 'w-3 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      {isActive && <div className="absolute inset-y-0 left-0 bg-red-500 w-full"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* VEHICLES CATALOG GRID SECTION */}
        <section id="vehicles" className="py-24 sm:py-32 w-full mx-auto bg-[#030304]">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-10">
            <Reveal>
              <div className="mb-16 text-center sm:text-left">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 block mb-2">
                  Vehicle Platform Catalog
                </span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
                  Vehicles
                </h2>
                <p className="text-sm text-white/60 mt-2 font-light max-w-2xl">
                  Select your preferred Tesla platform. Submit requests either via Full Payment Order or Initial Part Payment Reservation.
                </p>
              </div>
            </Reveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {vehicles.map((vehicle, index) => {
                const gridSpanClass = index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1';
                const aspectRatioClass = index % 3 === 0 ? 'aspect-video sm:aspect-[21/9]' : 'aspect-[4/3]';

                return (
                  <MotionCard key={vehicle.id} className={`${gridSpanClass}`}>
                    <div className="flex flex-col bg-[#08080a] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300">
                      <div className={`relative w-full overflow-hidden bg-black/60 ${aspectRatioClass}`}>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${vehicle.image_url})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent"></div>

                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                            {vehicle.type || 'Electric Vehicle'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                            Part Payment: ${(vehicle.part_payment_amount || 5000).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase">
                            {vehicle.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                            {vehicle.description}
                          </p>

                          {vehicle.range && (
                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 font-mono text-[11px] text-white/80">
                              <div>
                                <span className="text-white/40 text-[9px] block uppercase">Range</span>
                                <strong className="text-white">{vehicle.range}</strong>
                              </div>
                              <div>
                                <span className="text-white/40 text-[9px] block uppercase">Top Speed</span>
                                <strong className="text-white">{vehicle.top_speed || 'N/A'}</strong>
                              </div>
                              <div>
                                <span className="text-white/40 text-[9px] block uppercase">0-60 MPH</span>
                                <strong className="text-white">{vehicle.acceleration || 'N/A'}</strong>
                              </div>
                            </div>
                          )}

                          {vehicle.features && vehicle.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {vehicle.features.map((feat, fIdx) => (
                                <span key={fIdx} className="text-[10px] font-mono text-white/60 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                                  ✓ {feat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs grid grid-cols-3 gap-2 text-center">
                            <div>
                              <span className="text-white/40 text-[9px] uppercase tracking-wider block">Vehicle Price</span>
                              <span className="font-bold text-white">${vehicle.full_price.toLocaleString()}</span>
                            </div>
                            <div className="border-x border-white/10 px-1">
                              <span className="text-emerald-400 text-[9px] uppercase tracking-wider block font-sans font-bold">Part Payment</span>
                              <span className="font-bold text-emerald-400">${(vehicle.part_payment_amount || 5000).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-white/40 text-[9px] uppercase tracking-wider block">Remaining</span>
                              <span className="font-bold text-white/80">${Math.max(0, vehicle.full_price - (vehicle.part_payment_amount || 5000)).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleOrder(vehicle, 'full', e)}
                              disabled={orderingState?.id === vehicle.id}
                              className="flex-1 text-center text-xs font-bold tracking-wider uppercase py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {orderingState?.id === vehicle.id && orderingState.mode === 'full'
                                ? 'Submitting...'
                                : 'Pay In Full'}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleOrder(vehicle, 'part', e)}
                              disabled={orderingState?.id === vehicle.id}
                              className="flex-1 text-center text-xs font-bold tracking-wider uppercase py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
                            >
                              {orderingState?.id === vehicle.id && orderingState.mode === 'part'
                                ? 'Submitting...'
                                : `Part Payment ($${(vehicle.part_payment_amount || 5000).toLocaleString()})`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionCard>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="relative py-24 w-full flex flex-col items-center justify-center bg-[#08080a] border-t border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,33,39,0.08)_0%,transparent_70%)] pointer-events-none"></div>
          <Reveal>
            <div className="relative z-10 text-center px-8 max-w-2xl mx-auto space-y-6">
              <Shield className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
                Ready For Priority Allocation?
              </h2>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                Connect your investor profile to secure vehicle reservations and participate in exclusive technological allocations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="/invest/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center"
                >
                  Go To Dashboard
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </PageTransition>
  );
};

export default ShopPage;
