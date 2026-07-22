'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FolderTree, 
  Receipt, 
  Tag, 
  MessageSquare,
  Image,
  ArrowLeft,
  Settings,
  Menu,
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        router.push('/login?redirect=dashboard');
      }
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4 bg-background font-sans">
        <div className="rounded-full bg-destructive/5 p-5 border border-destructive/20 text-destructive mb-6">
          <Settings className="h-12 w-12 animate-spin" />
        </div>
        <h1 className="text-3xl font-serif font-light text-foreground mb-2">403 Forbidden</h1>
        <p className="text-muted-foreground text-xs max-w-sm mb-8 leading-relaxed">
          Access Denied. You do not have permissions to access the administrator panel console.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xs bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> Return to Store
        </Link>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/dashboard/users', icon: Users },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'Categories', path: '/dashboard/categories', icon: FolderTree },
    { name: 'Orders', path: '/dashboard/orders', icon: Receipt },
    { name: 'Coupons', path: '/dashboard/coupons', icon: Tag },
    { name: 'Reviews', path: '/dashboard/reviews', icon: MessageSquare },
    { name: 'Hero Slides', path: '/dashboard/hero-slides', icon: Image },
    { name: 'Slider Settings', path: '/dashboard/slider-settings', icon: SlidersHorizontal }
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/40 bg-card text-card-foreground p-6 shrink-0">
        <div className="flex flex-col pb-6 border-b border-border/40 mb-6">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">ATELIER CORE</span>
          <span className="text-lg font-serif tracking-widest uppercase text-foreground">
            Aura Shop
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xs ${
                  active 
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.5]" /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/40 pt-5 mt-auto">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs"></div>
          <div className="relative w-64 bg-card border-r border-border p-5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
              <span className="text-sm font-serif tracking-widest uppercase text-foreground">
                Aura Shop Admin
              </span>
              <button onClick={() => setIsSidebarOpen(false)} className="rounded p-1.5 hover:bg-secondary text-muted-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xs ${
                      active 
                        ? 'bg-primary text-primary-foreground font-semibold' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 stroke-[1.5]" /> {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border pt-4 mt-auto">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between border-b border-border/40 bg-card px-4 py-3 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif tracking-widest uppercase text-sm text-foreground">Aura Admin</span>
          <div className="w-9"></div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
}
