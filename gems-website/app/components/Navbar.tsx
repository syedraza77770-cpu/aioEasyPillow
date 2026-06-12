'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Gem,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

/* ─── Gem category data ─────────────────────────────────────────────────── */
interface GemCategory {
  name: string;
  hindi: string;
  slug: string;
  color: string;
}

const GEM_CATEGORIES: GemCategory[] = [
  { name: 'Ruby',          hindi: 'Manik',     slug: 'ruby',           color: '#9B1B30' },
  { name: 'Emerald',       hindi: 'Panna',     slug: 'emerald',        color: '#046307' },
  { name: 'Blue Sapphire', hindi: 'Neelam',    slug: 'blue-sapphire',  color: '#0F52BA' },
  { name: 'Yellow Sapphire',hindi:'Pukhraj',   slug: 'yellow-sapphire',color: '#D4AF37' },
  { name: 'Diamond',       hindi: 'Heera',     slug: 'diamond',        color: '#A8C8D8' },
  { name: 'Pearl',         hindi: 'Moti',      slug: 'pearl',          color: '#F8F4F0' },
  { name: 'Red Coral',     hindi: 'Moonga',    slug: 'red-coral',      color: '#C84B31' },
  { name: 'Hessonite',     hindi: 'Gomed',     slug: 'hessonite',      color: '#7B3F00' },
  { name: "Cat's Eye",     hindi: 'Lahsuniya', slug: 'cats-eye',       color: '#8B7355' },
  { name: 'Rudraksha',     hindi: '',          slug: 'rudraksha',      color: '#8B4513' },
];

/* ─── Nav link data ─────────────────────────────────────────────────────── */
interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home',       href: '/' },
  { label: 'About Us',   href: '/about' },
  { label: 'Shop',       href: '/shop', hasDropdown: true },
  { label: 'Contact Us', href: '/contact' },
];

/* ─── Framer-motion variants ────────────────────────────────────────────── */
const dropdownVariants = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' as any },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15, ease: 'easeIn' as any },
  },
};

const drawerVariants = {
  hidden:  { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 28, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.25, ease: 'easeIn' as any },
  },
};

const searchBarVariants = {
  hidden:  { width: 0, opacity: 0 },
  visible: {
    width: '240px',
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as any },
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as any },
  },
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [isScrolled,         setIsScrolled]         = useState(false);
  const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);
  const [isSearchOpen,       setIsSearchOpen]       = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const { itemCount } = useCart();
  const { query, setQuery, openSearch, closeSearch } = useSearch();

  const searchInputRef  = useRef<HTMLInputElement>(null);
  const dropdownRef     = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  /* Focus search input when it opens */
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      openSearch();
    } else {
      closeSearch();
    }
  }, [isSearchOpen, openSearch, closeSearch]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setIsShopDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setIsShopDropdownOpen(false), 150);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg border-b border-[#D4AF37]/30'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── Logo ────────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex flex-col leading-tight group shrink-0"
              aria-label="Indian Natural Gems and Jewellery – Home"
            >
              <span
                className="text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase text-[#6B7280] group-hover:text-[#A07B1E] transition-colors duration-200"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Indian Natural
              </span>
              <span
                className="text-base sm:text-xl font-bold tracking-wide text-[#D4AF37] group-hover:text-[#A07B1E] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Gems &amp; Jewellery
              </span>
            </Link>

            {/* ── Desktop Navigation ──────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  /* Shop link with mega-dropdown */
                  <div
                    key={link.label}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => setIsShopDropdownOpen((p) => !p)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isShopDropdownOpen
                          ? 'text-[#D4AF37]'
                          : 'text-[#1A1A2E] hover:text-[#D4AF37]'
                      }`}
                      aria-expanded={isShopDropdownOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: isShopDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>

                    {/* Mega dropdown */}
                    <AnimatePresence>
                      {isShopDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-white rounded-xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden z-50"
                          onMouseEnter={handleDropdownEnter}
                          onMouseLeave={handleDropdownLeave}
                        >
                          {/* Dropdown header */}
                          <div className="bg-gradient-to-r from-[#1A1A2E] to-[#0A0A2E] px-6 py-3 flex items-center gap-2">
                            <Gem size={16} className="text-[#D4AF37]" />
                            <span
                              className="text-[#D4AF37] text-sm font-semibold tracking-wide"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              Shop by Gemstone
                            </span>
                          </div>

                          {/* Gem grid */}
                          <div className="grid grid-cols-2 gap-px bg-gray-100 p-px">
                            {GEM_CATEGORIES.map((gem) => (
                              <Link
                                key={gem.slug}
                                href={`/shop/${gem.slug}`}
                                onClick={() => setIsShopDropdownOpen(false)}
                                className="flex items-center gap-3 bg-white px-4 py-3 hover:bg-[#FAFAF7] group transition-colors duration-150"
                              >
                                {/* Color dot */}
                                <span
                                  className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/10"
                                  style={{ backgroundColor: gem.color }}
                                />
                                <span className="flex flex-col min-w-0">
                                  <span className="text-sm font-medium text-[#1A1A2E] group-hover:text-[#D4AF37] transition-colors duration-150 truncate">
                                    {gem.name}
                                  </span>
                                  {gem.hindi && (
                                    <span className="text-xs text-[#6B7280]">{gem.hindi}</span>
                                  )}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* View all link */}
                          <div className="px-6 py-3 bg-[#FAFAF7] border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-[#6B7280]">All certified natural gemstones</span>
                            <Link
                              href="/shop"
                              onClick={() => setIsShopDropdownOpen(false)}
                              className="text-xs font-semibold text-[#D4AF37] hover:text-[#A07B1E] transition-colors duration-150 flex items-center gap-1"
                            >
                              View All
                              <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-[#1A1A2E] hover:text-[#D4AF37] rounded-md transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* ── Right actions ────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              <div className="flex items-center gap-1">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      variants={searchBarVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search gemstones…"
                        className="w-full px-3 py-1.5 text-sm border border-[#D4AF37]/50 rounded-md focus:outline-none focus:border-[#D4AF37] bg-white text-[#1A1A2E] placeholder:text-[#6B7280]"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setIsSearchOpen(false);
                        }}
                        aria-label="Search"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsSearchOpen((p) => !p)}
                  className="p-2 text-[#1A1A2E] hover:text-[#D4AF37] rounded-md transition-colors duration-200"
                  aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Wishlist */}
              <button
                className="hidden sm:flex p-2 text-[#1A1A2E] hover:text-[#9B1B30] rounded-md transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-[#1A1A2E] hover:text-[#D4AF37] rounded-md transition-colors duration-200"
                aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-1 leading-none"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-[#1A1A2E] hover:text-[#D4AF37] rounded-md transition-colors duration-200 ml-1"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gold accent line (visible when scrolled) */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="h-[2px] w-full origin-left"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, #FFE974, #D4AF37, transparent)',
              }}
            />
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col lg:hidden"
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1A1A2E] to-[#0A0A2E]">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest text-[#D4AF37]/70 uppercase">
                    Indian Natural
                  </span>
                  <span
                    className="text-base font-bold text-[#D4AF37]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Gems &amp; Jewellery
                  </span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto py-4">
                {/* Main links */}
                <nav className="px-3 space-y-0.5" aria-label="Mobile navigation links">
                  {NAV_LINKS.filter((l) => !l.hasDropdown).map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-sm font-medium text-[#1A1A2E] hover:text-[#D4AF37] hover:bg-[#FAFAF7] rounded-lg transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Shop section */}
                <div className="mt-4 px-3">
                  <div className="flex items-center gap-2 px-4 py-2 mb-2">
                    <Gem size={14} className="text-[#D4AF37]" />
                    <span
                      className="text-xs font-semibold text-[#D4AF37] tracking-wider uppercase"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Shop by Gemstone
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {GEM_CATEGORIES.map((gem) => (
                      <Link
                        key={gem.slug}
                        href={`/shop/${gem.slug}`}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E] hover:text-[#D4AF37] hover:bg-[#FAFAF7] rounded-lg transition-colors duration-150 group"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10"
                          style={{ backgroundColor: gem.color }}
                        />
                        <span className="font-medium">{gem.name}</span>
                        {gem.hindi && (
                          <span className="text-xs text-[#6B7280] ml-auto">{gem.hindi}</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/shop"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 mt-3 px-4 py-2.5 text-sm font-semibold text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors duration-200"
                  >
                    View All Gemstones
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-[#FAFAF7] flex items-center gap-4">
                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-sm font-medium text-[#1A1A2E] hover:text-[#D4AF37] transition-colors"
                >
                  <ShoppingCart size={16} />
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-1">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-sm font-medium text-[#1A1A2E] hover:text-[#9B1B30] transition-colors"
                >
                  <Heart size={16} />
                  Wishlist
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
