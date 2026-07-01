'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              AuraCart
            </span>
            <p className="text-sm text-muted-foreground">
              A premium, extensible e-commerce template designed to offer a state-of-the-art shopping experience. Build your dream business today.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/products?category=beauty-personal-care" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Beauty & Skincare
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">FAQ & Contact</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for exclusive offers, updates, and styling advice.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-md border border-input bg-background/50 px-3 py-1.5 text-sm focus:border-ring focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AuraCart, Inc. All rights reserved. Built as a high-performance production template.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold">COD ACTIVE</span>
            <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold opacity-50">STRIPE READY</span>
            <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold opacity-50">SSLCOMMERZ READY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
