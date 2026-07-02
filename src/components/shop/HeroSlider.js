'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '../../hooks/useHeroSlides';

export default function HeroSlider() {
  const { getHeroSlidesQuery } = useHeroSlides();
  const { data: slides, isLoading } = getHeroSlidesQuery();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides?.length || 0;

  const goToSlide = useCallback((index) => {
    if (slideCount === 0) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current, slideCount]);

  const nextSlide = useCallback(() => {
    if (slideCount === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slideCount, nextSlide]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative w-full h-[500px] lg:h-[600px] bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </section>
    );
  }

  // Fallback static hero if no slides
  if (!slides || slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden dark:bg-slate-950 bg-gradient-to-br from-slate-100 to-slate-200 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-slate-900/10 dark:bg-slate-100/10 px-3 py-1 text-xs font-semibold tracking-wider text-slate-800 dark:text-slate-200">
            PREMIUM COLLECTION 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              Shopping Experience
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Discover curated aesthetics, elite tech, fashion essentials, and luxury items with lightning-fast delivery options.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
          >
            Shop Now <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const activeSlide = slides[current];

  return (
    <section
      className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images with Animation */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl flex flex-col gap-4"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                  {activeSlide.title}
                </h2>

                {activeSlide.description && (
                  <p className="text-base sm:text-lg text-white/80 max-w-md leading-relaxed drop-shadow-md">
                    {activeSlide.description}
                  </p>
                )}

                {activeSlide.buttonText && activeSlide.buttonLink && (
                  <div className="mt-2">
                    <Link
                      href={activeSlide.buttonLink}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {activeSlide.buttonText}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 text-white hover:bg-white/25 transition-all cursor-pointer group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 text-white hover:bg-white/25 transition-all cursor-pointer group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === current
                  ? 'w-8 h-2.5 bg-white shadow-lg'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slideCount > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <motion.div
            key={current}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-white/50"
          />
        </div>
      )}
    </section>
  );
}
