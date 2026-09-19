import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Shield, ArrowRight } from 'lucide-react';
import { fetchVehicles, type Vehicle } from '../lib/vehicles';
import { useAuth } from '../hooks/useAuth';
import { savePaymentRequestContext, generateReferenceId } from '../lib/paymentContext';
import { navigate } from '../lib/navigation';
import { PageTransition, Reveal, StaggerContainer, MotionCard } from './MotionSystem';

export interface ShopPageProps {
  initialVehicles?: Vehicle[];
}

export const ShopPage: React.FC<ShopPageProps> = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { user, profile } = useAuth();

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

  const handleOrder = (vehicle: Vehicle, paymentOption: 'full' | 'part', e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/invest/login?redirect=/shop');
      return;
    }

    const ref = generateReferenceId('vehicle_purchase');
    const partPay = vehicle.part_payment_amount || 5000;
    const isFull = paymentOption === 'full';
    const amount = isFull ? vehicle.full_price : partPay;
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'vehicle_purchase',
      reference_id: ref,
      vehicle_id: vehicle.id,
      vehicle_name: vehicle.name,
      item_name: vehicle.name,
      payment_option: paymentOption,
      full_price: vehicle.full_price,
      part_payment_amount: partPay,
      quantity: 1,
      amount,
      currency: 'USD',
      customer_name: customerName,
      customer_email: user.email,
      is_submitted: false,
    });

    navigate(`/payment?ref=${ref}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Vehicle Showroom...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold uppercase mb-2">No Vehicles Found</h2>
        <p className="text-xs text-white/50 mb-6">Unable to load vehicle telemetry at this time.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <main className="w-full">
        {/* HERO CAROUSEL SHOWROOM */}
        <section className="relative w-full h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105"
            style={{ backgroundImage: `url(${activeVehicle.image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>
          </div>

          <div className="relative z-10 max-w-[1800px] mx-auto h-full flex flex-col justify-between p-6 sm:p-12">
            <div className="pt-20">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold uppercase tracking-widest text-white mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Tesla Vehicle Fleet
                </div>
              </Reveal>
            </div>

            <div className="max-w-3xl pb-16 sm:pb-24">
              <Reveal>
                <div className="space-y-4">
                  <span className="text-xs sm:text-sm font-mono text-red-500 uppercase tracking-[0.2em] font-bold block">
                    {activeVehicle.type || 'Electric Platform'}
                  </span>

                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase font-sans leading-[0.9]">
                    {activeVehicle.name}
                  </h1>

                  <p className="text-sm sm:text-base text-white/80 max-w-xl font-light leading-relaxed">
                    {activeVehicle.description}
                  </p>

                  <div className="pt-2">
                    <div className="inline-grid grid-cols-3 gap-4 sm:gap-8 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 font-mono text-xs text-center">
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
                  className="w-full sm:w-1/2 text-center bg-white text-black hover:bg-white/90 text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  Order Full Price (${activeVehicle.full_price.toLocaleString()})
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOrder(activeVehicle, 'part', e)}
                  className="w-full sm:w-1/2 text-center bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-2xl cursor-pointer border border-red-400/40"
                >
                  Request Part Payment (${(activeVehicle.part_payment_amount || 5000).toLocaleString()})
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
            </div>
          </div>
        </section>

        {/* VEHICLE CATALOG GRID */}
        <section className="py-24 bg-[#030304] text-white">
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
                              className="flex-1 text-center text-xs font-bold tracking-wider uppercase py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                            >
                              Pay In Full
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleOrder(vehicle, 'part', e)}
                              className="flex-1 text-center text-xs font-bold tracking-wider uppercase py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all cursor-pointer"
                            >
                              Part Payment (${(vehicle.part_payment_amount || 5000).toLocaleString()})
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
