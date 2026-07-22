'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import { useSliderConfig } from '../../hooks/useSliderConfig';

const LUXURY_SLIDES = [
  {
    _id: 'l1',
    title: 'Crafted Scents. Timeless Presence.',
    description: 'Discover our exclusive collection of signature inspired perfumes, handcrafted in micro-batches.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&auto=format&fit=crop',
    buttonText: 'Discover Perfumes',
    buttonLink: '/products'
  },
  {
    _id: 'l2',
    title: 'Bespoke Olfactory Creations',
    description: 'Design your own custom signature scent with premium bases curated by master perfumers.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1600&auto=format&fit=crop',
    buttonText: 'Custom Scent Kit',
    buttonLink: '/products?category=custom-perfumes'
  },
  {
    _id: 'l3',
    title: 'Timeless Gift Collections',
    description: 'Luxurious gift presentations curated for those who appreciate the finer notes of presence.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cf730227c7?w=1600&auto=format&fit=crop',
    buttonText: 'Shop Gift Sets',
    buttonLink: '/products?category=gift-sets'
  }
];

export default function HeroSlider() {
  const { getHeroSlidesQuery } = useHeroSlides();
  const { data: serverSlides, isLoading: slidesLoading } = getHeroSlidesQuery();

  const { getSliderConfigQuery } = useSliderConfig();
  const { data: sliderConfig, isLoading: configLoading } = getSliderConfigQuery();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = serverSlides && serverSlides.length > 0 ? serverSlides : LUXURY_SLIDES;
  const slideCount = slides.length;

  const cfg = sliderConfig || {};
  const sliderHeight = cfg.height || '85vh';
  const autoplayMs = cfg.autoplayInterval ?? 6000;
  const overlayOpacity = (cfg.overlayOpacity ?? 15) / 100;
  const overlayColor = cfg.overlayColor || '#000000';
  const objectFit = cfg.objectFit || 'cover';
  const contentMaxWidth = cfg.contentMaxWidth || 'max-w-7xl';
  const contentAlign = cfg.contentAlign || 'left';

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Auto-play
  useEffect(() => {
    if (slideCount <= 1 || !autoplayMs) return;
    const timer = setInterval(nextSlide, autoplayMs);
    return () => clearInterval(timer);
  }, [slideCount, autoplayMs, nextSlide]);

  if (slidesLoading || configLoading) {
    return (
      <section className="relative w-full bg-secondary animate-pulse flex items-center justify-center"
        style={{ height: sliderHeight }}
      >
        <div className="h-5 w-32 bg-border rounded-xs"></div>
      </section>
    );
  }

  const activeSlide = slides[current];

  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  return (
    <section className="relative w-full overflow-hidden bg-background select-none"
      style={{ height: sliderHeight }}
    >
      
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity
            }}
          />
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-center scale-103 transform"
            draggable={false}
            style={{ objectFit }}
          />

          {/* Luxury Floating Content */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className={`mx-auto ${contentMaxWidth} px-4 sm:px-6 lg:px-8 w-full`}>
              <div className={`max-w-2xl flex flex-col gap-6 text-white md:text-white/90 ${alignClasses[contentAlign] || alignClasses.left}`}>
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-[10px] font-bold uppercase tracking-widest text-accent text-amber-100"
                >
                  AURA HOUSE OF SCENTS
                </motion.span>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.15] tracking-wide"
                >
                  {activeSlide.title}
                </motion.h2>

                {activeSlide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm sm:text-base text-white/80 max-w-lg leading-relaxed font-sans"
                  >
                    {activeSlide.description}
                  </motion.p>
                )}

                {activeSlide.buttonText && activeSlide.buttonLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                    className="mt-4"
                  >
                    <Link
                      href={activeSlide.buttonLink}
                      className="inline-flex items-center justify-center rounded-xs bg-white text-slate-900 border border-transparent px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white hover:border-white transition-all duration-300 shadow-sm"
                    >
                      {activeSlide.buttonText}
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <div className="absolute bottom-10 right-10 flex gap-3 z-30">
          <button
            onClick={prevSlide}
            className="rounded-full border border-white/20 bg-black/10 backdrop-blur-xs p-3 text-white hover:bg-white hover:text-slate-950 transition-all duration-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="rounded-full border border-white/20 bg-black/10 backdrop-blur-xs p-3 text-white hover:bg-white hover:text-slate-950 transition-all duration-300 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {slideCount > 1 && (
        <div className={`absolute bottom-12 z-30 flex gap-2 ${contentAlign === 'center' ? 'left-1/2 -translate-x-1/2' : contentAlign === 'right' ? 'right-10' : 'left-10'}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-0.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === current ? 'w-8 bg-accent' : 'w-4 bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
