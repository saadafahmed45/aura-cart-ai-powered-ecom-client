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
  X
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4 bg-background">
        <div className="rounded-full bg-rose-500/10 p-4 border border-rose-500/25 text-rose-500 mb-6">
          <Settings className="h-12 w-12 animate-spin text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">403 Forbidden</h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          Access Denied. You do not have permissions to access the administrator panel console.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors">
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
    { name: 'Hero Slides', path: '/dashboard/hero-slides', icon: Image }
  ];

  return (
    <div className="flex min-h-screen bg-background/50">
      
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card text-card-foreground p-5 shrink-0">
        <div className="flex items-center gap-2 pb-6 border-b border-border/60 mb-6">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            AuraCart Admin
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-150 hover:translate-x-0.5 ${
                  active 
                    ? 'bg-secondary/80 text-foreground font-semibold border-l-2 border-primary rounded-r-lg rounded-l-none' 
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 pt-4 mt-auto">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
          </Link>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs"></div>
          <div className="relative w-64 bg-card border-r border-border p-5 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                AuraCart Admin
              </span>
              <button onClick={() => setIsSidebarOpen(false)} className="rounded p-1 hover:bg-secondary text-muted-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      active 
                        ? 'bg-secondary/80 text-foreground font-semibold border-l-2 border-primary rounded-r-lg rounded-l-none' 
                        : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border pt-4 mt-auto">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm text-foreground">Admin Console</span>
          <div className="w-9"></div>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
}
