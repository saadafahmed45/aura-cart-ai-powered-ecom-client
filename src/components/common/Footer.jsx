'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground font-sans">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1 - Brand info */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold tracking-widest font-serif text-foreground uppercase">
              AURA SHOP
            </span>
            <p className="text-xs tracking-wider uppercase text-accent font-bold">
              Crafted Scents. Timeless Presence.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-xs">
              Redefining luxury perfumes through meticulously crafted inspired fragrance formulas, bespoke scent creations, and luxurious gift collections.
            </p>
          </div>

          {/* Column 2 - Collections */}
          <div>
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-5">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/products?category=inspired-perfumes" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Inspired Perfumes
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom-perfumes" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Custom Perfumes
                </Link>
              </li>
              <li>
                <Link href="/products?category=gift-sets" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=luxury-collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Luxury Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Our House */}
          <div>
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-5">Our House</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Customer Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">Newsletter</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Subscribe to receive updates on limited product drops, perfume releases, and private catalog events.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-1">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full rounded-xs border border-border bg-background px-3.5 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/60 transition-colors"
              />
              <button
                type="submit"
                className="rounded-xs bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground tracking-wide font-medium">
            &copy; {new Date().getFullYear()} AURA SHOP. All rights reserved. Designed for exquisite olfactory presence.
          </p>
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-bold tracking-wider">
            <span className="px-2.5 py-1 rounded-xs bg-secondary text-foreground/80">COD GUARANTEE</span>
            <span className="px-2.5 py-1 rounded-xs bg-secondary text-foreground/40">ONLINE PAYMENT COMING SOON</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
