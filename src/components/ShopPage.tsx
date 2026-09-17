import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { fetchVehicles, type Vehicle } from '../lib/vehicles';
import { useAuth } from '../hooks/useAuth';
import { createVehicleOrder } from '../lib/dashboard';
import { buildVehicleOrderTelegramUrl } from '../lib/telegram';

export interface ShopPageProps {
  initialVehicles?: Vehicle[];
}

export const ShopPage: React.FC<ShopPageProps> = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [orderingVehicleId, setOrderingVehicleId] = useState<string | null>(null);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

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

  const handleOrderNow = async (vehicle: Vehicle, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/invest/login';
      return;
    }

    setOrderingVehicleId(vehicle.id);
    setOrderSuccessMessage(null);

    const customerName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user.email?.split('@')[0] || 'Customer';
    const customerEmail = user.email || '';

    const { order, error } = await createVehicleOrder(
      user.id,
      vehicle,
      1,
      customerName,
      customerEmail
    );

    setOrderingVehicleId(null);

    if (error) {
      console.error('Error recording order:', error);
    }

    const orderId = order?.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const telegramUrl = buildVehicleOrderTelegramUrl({
      orderId,
      vehicleName: vehicle.name,
      vehicleId: vehicle.id,
      quantity: 1,
      fullPrice: vehicle.full_price,
      partPayment: vehicle.part_payment_amount || 5000,
      customerName,
      customerEmail,
    });

    setOrderSuccessMessage(`Order #${orderId.slice(0, 8)} created. Redirecting to Telegram...`);

    setTimeout(() => {
      window.location.href = telegramUrl;
    }, 1200);
  };

  if (loading) {
    return (
      <div className="bg-[#F4F4F4] text-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black/60" />
          <p className="text-xs uppercase tracking-widest font-mono text-black/60">Loading Vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F4F4] text-black min-h-screen">
      <main className="w-full min-h-screen pb-24">
        {orderSuccessMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 animate-bounce text-xs font-bold tracking-wider uppercase">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {orderSuccessMessage}
          </div>
        )}

        {/* HERO CAROUSEL SECTION */}
        {activeVehicle && (
          <section className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden group bg-[#F4F4F4]">
            <div className="absolute inset-0 w-full h-full select-none" draggable={false}>
              <div
                key={activeVehicle.id}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                style={{ backgroundImage: `url(${activeVehicle.image_url})` }}
              ></div>
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"></div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pointer-events-none">
              <div className="text-center px-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight drop-shadow-md font-sans">
                  {activeVehicle.name}
                </h1>
                <p className="text-base sm:text-lg text-white/90 mt-2 font-medium tracking-wider drop-shadow-sm max-w-lg mx-auto">
                  {activeVehicle.description}
                </p>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-white/90 tracking-widest uppercase">
                  <span>Full Price: ${activeVehicle.full_price.toLocaleString()}</span>
                  <span>•</span>
                  <span className="text-emerald-300">Part Payment: ${(activeVehicle.part_payment_amount || 5000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-10 flex flex-col items-center gap-6 w-full px-6">
              <div className="w-full max-w-sm mx-auto flex justify-center">
                <button
                  type="button"
                  onClick={(e) => handleOrderNow(activeVehicle, e)}
                  disabled={orderingVehicleId === activeVehicle.id}
                  className="w-full sm:w-[260px] text-center bg-white/90 backdrop-blur-md text-black text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {orderingVehicleId === activeVehicle.id ? 'Processing...' : 'Order Now'}
                </button>
              </div>

              {/* Carousel Navigation Buttons */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-6 bottom-1/2 translate-y-1/2 sm:left-12 sm:top-[-40vh] z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-6 bottom-1/2 translate-y-1/2 sm:right-12 sm:top-[-40vh] z-20 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/30 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hidden sm:block shadow-lg cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {vehicles.map((v, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`relative h-1 rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 cursor-pointer ${
                        isActive ? 'w-16 bg-white/30' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      {isActive && <div className="absolute inset-y-0 left-0 bg-white w-full"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="sticky top-14 z-40 w-full border-b transition-all duration-300 bg-white border-black/5"></div>

        {/* VEHICLES GRID SECTION */}
        <section id="vehicles" className="py-24 sm:py-32 w-full mx-auto bg-[#F4F4F4] transition-colors duration-700">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-10">
            <div className="mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black font-sans">
                Vehicles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {vehicles.map((vehicle, index) => {
                const gridSpanClass = index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1';
                const aspectRatioClass = index % 3 === 0 ? 'aspect-video sm:aspect-[21/9]' : 'aspect-[4/3]';

                return (
                  <div
                    key={vehicle.id}
                    className={`flex flex-col group ${gridSpanClass}`}
                  >
                    <div className={`relative w-full overflow-hidden bg-black/5 rounded-lg ${aspectRatioClass}`}>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${vehicle.image_url})` }}
                      ></div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-6 rounded-xl border border-black/5 shadow-sm">
                      <div className="flex-1 max-w-2xl">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/40">
                            {vehicle.type || 'Electric Vehicle'}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Part Payment: ${(vehicle.part_payment_amount || 5000).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-black font-sans mb-1">
                          {vehicle.name}
                        </h3>
                        <p className="text-sm text-black/60 font-medium mb-3">
                          {vehicle.description}
                        </p>
                        {vehicle.range && (
                          <div className="flex flex-wrap gap-4 text-xs font-mono text-black/70">
                            <span>Range: <strong>{vehicle.range}</strong></span>
                            <span>Top Speed: <strong>{vehicle.top_speed}</strong></span>
                            <span>0-60: <strong>{vehicle.acceleration}</strong></span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <span className="text-lg font-black text-black">
                          ${vehicle.full_price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleOrderNow(vehicle, e)}
                          disabled={orderingVehicleId === vehicle.id}
                          className="w-full sm:w-auto inline-block text-center text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded active:scale-95 transition-all duration-300 shadow-sm cursor-pointer bg-black text-white hover:bg-black/90 disabled:opacity-50"
                        >
                          {orderingVehicleId === vehicle.id ? 'Processing...' : 'Order Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="relative h-[60vh] sm:h-[80vh] w-full flex flex-col items-center justify-center bg-[#F4F4F4] overflow-hidden border-t border-black/[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]"></div>
          <div className="relative z-10 text-center px-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight mb-4 drop-shadow-sm font-sans">
              Experience the Future
            </h2>
            <p className="text-base sm:text-lg text-black/60 mb-10 max-w-lg mx-auto font-medium">
              Sustainable energy, premium engineering, uncompromised performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/invest/signup"
                className="w-full sm:w-[220px] text-center bg-black text-white text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md"
              >
                Create Account
              </a>
              <a
                href="/dashboard"
                className="w-full sm:w-[220px] text-center bg-transparent border-2 border-black/70 text-black text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-black/5 hover:border-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm backdrop-blur-sm"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShopPage;
