"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuth } from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const { getTotals } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartTotals = getTotals();

  const { getCategoriesQuery } = useCategories();
  const { data: categories } = getCategoriesQuery();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoriesDropdownOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black tracking-tight text-foreground transition-colors">
            Aura<span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Cart</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Categories <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {categoriesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 rounded-md border border-border bg-card p-1 shadow-lg"
                >
                  <Link
                    href="/products"
                    className="block rounded-sm px-4 py-2 text-sm text-card-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    All Products
                  </Link>
                  {categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat.slug}`}
                      className="block rounded-sm px-4 py-2 text-sm text-card-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/products"
            className={`text-sm font-medium transition-colors ${
              pathname === '/products'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Shop
          </Link>
        </nav>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex relative w-80 max-w-xs"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-input bg-background/50 px-4 py-1.5 pr-10 text-sm focus:border-ring focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartTotals.itemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 rounded-full hover:bg-secondary p-2 transition-colors cursor-pointer"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-lg"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground">
                          Logged in as
                        </p>
                        <p className="text-sm font-semibold truncate text-foreground">
                          {user?.name}
                        </p>
                      </div>

                      {user?.role === "admin" && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Admin
                          Dashboard
                        </Link>
                      )}

                      <Link
                        href="/account"
                        className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                      >
                        <User className="h-4 w-4" /> Account Settings
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm text-card-foreground hover:bg-secondary transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" /> My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-left rounded-sm px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card px-4 py-4 shadow-inner"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative mb-4 w-full"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-input bg-background/50 px-4 py-2 pr-10 text-sm focus:border-ring focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="py-2 text-sm font-medium text-card-foreground border-b border-border/50 hover:text-primary transition-colors"
              >
                Shop All Products
              </Link>

              {categories && (
                <div className="py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        className="py-1 text-sm text-card-foreground hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="py-2 text-sm font-medium text-card-foreground border-b border-border/50 hover:text-primary transition-colors"
                  >
                    Account Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="py-2 text-sm font-medium text-card-foreground border-b border-border/50 hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/dashboard"
                      className="py-2 text-sm font-medium text-card-foreground border-b border-border/50 hover:text-primary transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-sm font-medium text-destructive transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
