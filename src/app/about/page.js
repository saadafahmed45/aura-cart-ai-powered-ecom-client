'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Compass, Flame } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans bg-background">
      
      {/* Editorial Title */}
      <div className="text-center mb-20 max-w-xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block animate-pulse">OUR HOUSE</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">The Story of Aura</h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Crafting olfactory memories that linger. Discover the heritage, philosophy, and precise craftsmanship behind our perfume house.
        </p>
      </div>

      {/* Grid 1 - Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop" 
            alt="Maceration bottles" 
            className="w-full rounded-xs aspect-[4/3] object-cover shadow-sm border border-border/40"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">HERITAGE</span>
          <h2 className="text-3xl font-serif font-light text-foreground tracking-wide">Our Story</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Aura Shop was founded in 2026 out of a singular obsession: to capture transient memories in liquid form. We believed that the market was filled with flashy, commercial perfumes that lacked depth and individuality. 
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            By returning to raw, traditional maceration and selecting organic materials directly from growers in Grasse, Tuscany, and India, our master perfumers created a library of inspired scents that capture the elegant simplicity of life.
          </p>
        </div>
      </section>

      {/* Grid 2 - Our Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div className="md:order-last">
          <img 
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop" 
            alt="Perfumer raw materials" 
            className="w-full rounded-xs aspect-[4/3] object-cover shadow-sm border border-border/40"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">IDENTITY</span>
          <h2 className="text-3xl font-serif font-light text-foreground tracking-wide">Our Philosophy</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            We follow a strictly minimal design ethos inspired by Apple, Le Labo, and Aesop. We do not use flashy color compounds or commercial packaging. The perfume itself is the statement.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each bottle is housed in heavy glass cylinders with sharp typography labeling. We believe that true luxury is quiet, confident, and timeless. Scent sillage should command a room silently.
          </p>
        </div>
      </section>

      {/* Craftsmanship Section (Three Column) */}
      <section className="py-16 border-t border-border/40 mb-20">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-2">THE PROCESS</span>
          <h2 className="text-3xl font-serif text-foreground font-light">Bespoke Craftsmanship</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <Compass className="h-6 w-6 stroke-[1.2] text-accent" />
            <h4 className="text-lg font-serif text-foreground">1. Ethically Sourced Base Oils</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our base solvents and absolute essential oils are extracted naturally. We source cardamoms from Malabar, vetiver from Haiti, and roses from Damascus.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Flame className="h-6 w-6 stroke-[1.2] text-accent" />
            <h4 className="text-lg font-serif text-foreground">2. 8-Week Maceration Period</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We do not accelerate sillage. Our extracts rest in sterile dark barrels for eight weeks to allow molecular bonds to bind, resulting in rich transitions.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Sparkles className="h-6 w-6 stroke-[1.2] text-accent" />
            <h4 className="text-lg font-serif text-foreground">3. Hand-Labelled Bottles</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every bottle of Aura is filled, capped, and custom-labelled by hand. This maintains individual inspection quality across every order.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="text-center py-16 bg-secondary/50 rounded-xs border border-border/40">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">DISCOVER YOUR SCENT</span>
        <h2 className="text-2xl font-serif font-light text-foreground mb-6">Find Your Signature Presence</h2>
        <Link href="/products" className="inline-flex justify-center rounded-xs bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300">
          Explore Scent Catalog
        </Link>
      </section>

    </div>
  );
}
