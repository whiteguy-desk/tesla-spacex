import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ShopProduct {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  orderUrl: string;
  aspectRatioClass?: string;
  gridSpanClass?: string;
}

const INITIAL_PRODUCTS: ShopProduct[] = [
  {
    id: 'model-3',
    name: 'Model 3',
    tagline: 'Experience the Future.',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912143/shop_products/vjembb6zp8ymaabtyvtf.avif',
    orderUrl: 'https://www.teslaincorp.pro/dashboard/shop/model-3',
    aspectRatioClass: 'aspect-video sm:aspect-[21/9]',
    gridSpanClass: 'md:col-span-2',
  },
  {
    id: 'model-y',
    name: 'Model Y',
    tagline: 'Experience the Future.',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912441/shop_products/mrmi8lgluhgy3czb1bcd.avif',
    orderUrl: 'https://www.teslaincorp.pro/dashboard/shop/model-y',
    aspectRatioClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-1',
  },
  {
    id: 'cybertruck',
    name: 'Cybertruck',
    tagline: 'Experience the Future.',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912774/shop_products/fg6egsdynvtmhmnoftfo.avif',
    orderUrl: 'https://www.teslaincorp.pro/dashboard/shop/cybertruck',
    aspectRatioClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-1',
  },
  {
    id: 'model-s',
    name: 'Model S',
    tagline: 'Experience the Future.',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772907569/shop_products/aq36923m5clq2s9eb1kn.jpg',
    orderUrl: 'https://www.teslaincorp.pro/dashboard/shop/model-s',
    aspectRatioClass: 'aspect-video sm:aspect-[21/9]',
    gridSpanClass: 'md:col-span-2',
  },
  {
    id: 'model-x',
    name: 'Model X',
    tagline: 'Experience the Future.',
    imageUrl: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912600/shop_products/artqw7clgs2xkivyktel.avif',
    orderUrl: 'https://www.teslaincorp.pro/dashboard/shop/model-x',
    aspectRatioClass: 'aspect-[4/3]',
    gridSpanClass: 'md:col-span-1',
  },
];

export interface ShopPageProps {
  products?: ShopProduct[];
}

export const ShopPage: React.FC<ShopPageProps> = ({ products = INITIAL_PRODUCTS }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeProduct = products[currentSlideIndex] || products[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#F4F4F4] text-black min-h-screen">
      <main className="w-full min-h-screen pb-24">
        {/* HERO CAROUSEL SECTION */}
        <section className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden group bg-[#F4F4F4]">
          <div className="absolute inset-0 w-full h-full select-none" draggable={false}>
            <div
              key={activeProduct.id}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out scale-105 group-hover:scale-100"
              style={{ backgroundImage: `url(${activeProduct.imageUrl})` }}
            ></div>
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
          </div>

          <div className="relative z-10 w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pointer-events-none">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white tracking-tight drop-shadow-md font-sans">
                {activeProduct.name}
              </h1>
              <p className="text-base sm:text-lg text-white/90 mt-2 font-medium tracking-wider drop-shadow-sm max-w-lg mx-auto px-4">
                {activeProduct.tagline}
              </p>
            </div>
          </div>

          <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-10 flex flex-col items-center gap-6 w-full px-6">
            <div className="w-full max-w-sm mx-auto flex justify-center">
              <a
                className="w-full sm:w-[260px] text-center bg-white/90 backdrop-blur-md text-black text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                href={activeProduct.orderUrl}
              >
                Order Now
              </a>
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
              {products.map((p, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`relative h-1 rounded-full flex-shrink-0 overflow-hidden transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-16 bg-white/30'
                        : 'w-2 bg-white/50 hover:bg-white/80'
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

        <div className="sticky top-14 z-40 w-full border-b transition-all duration-300 bg-white border-black/5"></div>

        {/* VEHICLES GRID SECTION */}
        <section id="vehicles" className="py-24 sm:py-32 w-full mx-auto bg-[#F4F4F4] transition-colors duration-700">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-10">
            <div className="mb-16">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black font-sans">
                Vehicles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex flex-col group cursor-pointer ${product.gridSpanClass || ''}`}
                >
                  <div className={`relative w-full overflow-hidden bg-black/5 ${product.aspectRatioClass || 'aspect-video'}`}>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${product.imageUrl})` }}
                    ></div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="flex-1 max-w-2xl">
                      <h3 className="text-2xl sm:text-3xl font-semibold mb-2 text-black font-sans">
                        {product.name}
                      </h3>
                      <p className="text-sm sm:text-base font-medium leading-relaxed text-black/60">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <a
                        className="inline-block text-center text-xs font-bold tracking-[0.1em] uppercase px-8 py-3.5 rounded active:scale-95 transition-all duration-300 shadow-sm cursor-pointer bg-black text-white hover:bg-black/90"
                        href={product.orderUrl}
                      >
                        Order Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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
                href="/invest/register"
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
