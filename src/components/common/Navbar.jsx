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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      setSearchOpen(false);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserDropdownOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled || !isHome
            ? "border-b border-border/40 bg-background/85 backdrop-blur-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo - Left */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-xl font-bold font-serif tracking-widest text-foreground uppercase">
              Aura <span className="text-accent">Shop</span>
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-foreground/80 hover:text-foreground transition-colors cursor-pointer py-2">
                Collections <ChevronDown className="h-3 w-3" />
              </button>

              {/* Mega Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-52 rounded-xs border border-border bg-card p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  href="/products"
                  className="block rounded-xs px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  All Perfumes
                </Link>
                {categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    className="block rounded-xs px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/products"
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-foreground ${
                pathname === "/products" ? "text-foreground border-b border-accent pb-0.5" : "text-foreground/80"
              }`}
            >
              Shop
            </Link>

            <Link
              href="/about"
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-foreground ${
                pathname === "/about" ? "text-foreground border-b border-accent pb-0.5" : "text-foreground/80"
              }`}
            >
              Our Story
            </Link>

            <Link
              href="/contact"
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-foreground ${
                pathname === "/contact" ? "text-foreground border-b border-accent pb-0.5" : "text-foreground/80"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* User Icons - Right */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-foreground/85 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="h-4.5 w-4.5 stroke-[1.5]" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-foreground/85 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              title="Theme Toggle"
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 stroke-[1.5]" />
              ) : (
                <Moon className="h-4.5 w-4.5 stroke-[1.5]" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative rounded-full p-2 text-foreground/85 hover:bg-secondary hover:text-foreground transition-colors"
              title="Wishlist"
            >
              <Heart className="h-4.5 w-4.5 stroke-[1.5]" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-foreground/85 hover:bg-secondary hover:text-foreground transition-colors"
              title="Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {cartTotals.itemCount}
                </span>
              )}
            </Link>

            {/* Account Settings */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 rounded-full hover:bg-secondary p-2 transition-colors cursor-pointer"
                  >
                    <User className="h-4.5 w-4.5 stroke-[1.5] text-foreground/85" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xs border border-border bg-card p-1 shadow-lg"
                      >
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            Logged in as
                          </p>
                          <p className="text-xs font-semibold truncate text-foreground">
                            {user?.name}
                          </p>
                        </div>

                        {user?.role === "admin" && (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-xs px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                          >
                            <LayoutDashboard className="h-3.5 w-3.5 stroke-[1.5]" /> Admin
                            Dashboard
                          </Link>
                        )}

                        <Link
                          href="/account"
                          className="flex items-center gap-2 rounded-xs px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                        >
                          <User className="h-3.5 w-3.5 stroke-[1.5]" /> Profile Setting
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-2 rounded-xs px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" /> My Orders
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-left rounded-xs px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5 stroke-[1.5]" /> Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/80 text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-colors text-foreground"
                >
                  <User className="h-3.5 w-3.5 stroke-[1.5]" /> <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full p-2 text-foreground/85 hover:bg-secondary hover:text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-card px-4 py-4 shadow-inner"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/products"
                  className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                >
                  Shop Catalog
                </Link>

                {categories && (
                  <div className="py-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Collections
                    </p>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat.slug}`}
                          className="py-1 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/about"
                  className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                >
                  Our Story
                </Link>

                <Link
                  href="/contact"
                  className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                >
                  Contact
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/account"
                      className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                    >
                      Account Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                    >
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard"
                        className="py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-accent border-b border-border/30 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-xs font-bold uppercase tracking-widest text-destructive transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xs bg-primary py-3 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/95 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Luxury Full-Screen Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 rounded-full border border-border p-2.5 hover:bg-secondary text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 stroke-[1.5]" />
            </button>

            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl text-center flex flex-col gap-6">
              <h2 className="text-3xl font-serif text-foreground font-light tracking-wide">
                What scent are you searching for?
              </h2>
              <div className="relative border-b border-foreground/30 focus-within:border-accent transition-colors py-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by notes, brands, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xl text-foreground placeholder:text-muted-foreground focus:outline-none pr-12 text-center"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground"
                >
                  <Search className="h-6 w-6 stroke-[1.5]" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Press Enter to search or click close to go back.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
