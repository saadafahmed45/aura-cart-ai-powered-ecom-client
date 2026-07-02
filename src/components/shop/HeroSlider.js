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
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides?.length || 0;

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

  const goToSlide = useCallback((index) => {
    if (slideCount === 0) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current, slideCount]);

  // Handle swipe / drag end
  const handleDragEnd = (e, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  // Auto-play
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slideCount, nextSlide]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative w-full h-[420px] lg:h-[520px] bg-muted animate-pulse">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              Shopping Experience
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Discover curated aesthetics, elite tech, fashion essentials, and luxury items.
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

  const activeSlide = slides[current];

  return (
    <section
      className="relative w-full h-[420px] lg:h-[520px] overflow-hidden bg-slate-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Background Image */}
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl flex flex-col gap-3">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight"
                >
                  {activeSlide.title}
                </motion.h2>

                {activeSlide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="text-sm sm:text-base text-white/75 max-w-md"
                  >
                    {activeSlide.description}
                  </motion.p>
                )}

                {activeSlide.buttonText && activeSlide.buttonLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="mt-2"
                  >
                    <Link
                      href={activeSlide.buttonLink}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-white/90 transition-colors"
                    >
                      {activeSlide.buttonText}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left / Right Arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/15 backdrop-blur-sm p-2 text-white hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/15 backdrop-blur-sm p-2 text-white hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slideCount > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === current
                  ? 'w-7 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
