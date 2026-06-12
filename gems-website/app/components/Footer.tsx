'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Star,
  Shield,
  Award,
  Gem,
} from 'lucide-react';

/* ─── Inline SVG brand icons ────────────────────────────────────────────── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="#0A0A2E" points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" />
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────────────────── */
const TRUST_BADGES = [
  { icon: Star,   label: '51 Years of Trust',    sub: 'Est. 1973' },
  { icon: Award,  label: 'GII Certified',         sub: 'Gemological Institute' },
  { icon: Gem,    label: '100% Natural Stones',   sub: 'Authenticity Guaranteed' },
  { icon: Shield, label: 'Secure Payment',        sub: 'Safe & Encrypted' },
];

const QUICK_LINKS = [
  { label: 'Home',              href: '/' },
  { label: 'About Us',          href: '/about' },
  { label: 'Shop',              href: '/shop' },
  { label: 'Contact Us',        href: '/contact' },
  { label: 'Blog',              href: '/blog' },
  { label: 'Gem Guide',         href: '/gem-guide' },
  { label: 'Astrological Gems', href: '/astrological-gems' },
  { label: 'Certification',     href: '/certification' },
  { label: 'FAQ',               href: '/faq' },
  { label: 'Returns Policy',    href: '/returns' },
];

const SHOP_CATEGORIES = [
  { label: 'Ruby (Manik)',           href: '/shop/ruby' },
  { label: 'Emerald (Panna)',        href: '/shop/emerald' },
  { label: 'Blue Sapphire (Neelam)',  href: '/shop/blue-sapphire' },
  { label: 'Yellow Sapphire (Pukhraj)', href: '/shop/yellow-sapphire' },
  { label: 'Diamond (Heera)',        href: '/shop/diamond' },
  { label: 'Pearl (Moti)',           href: '/shop/pearl' },
  { label: 'Red Coral (Moonga)',     href: '/shop/red-coral' },
  { label: 'Hessonite (Gomed)',      href: '/shop/hessonite' },
  { label: "Cat's Eye (Lahsuniya)",  href: '/shop/cats-eye' },
  { label: 'Rudraksha Beads',        href: '/shop/rudraksha' },
];

/* ─── Framer-motion variants ────────────────────────────────────────────── */
const fadeInUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as any } },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1A2E] text-white">

      {/* ── Trust badges ──────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A2E] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <motion.div
                key={label}
                variants={fadeInUp}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#D4AF37]/20 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                  <Icon size={20} className="text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-[#D4AF37]/70 mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Main footer grid ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >

          {/* Column 1 — Company info */}
          <motion.div variants={fadeInUp} className="space-y-5">
            {/* Logo */}
            <div>
              <p
                className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37]/60 font-light"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Indian Natural
              </p>
              <p
                className="text-xl font-bold text-[#D4AF37] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Gems &amp; Jewellery
              </p>
            </div>

            {/* Tagline */}
            <p className="text-sm text-gray-400 leading-relaxed">
              Bringing Earth&apos;s Finest Gems to You Since 1973. Trusted by
              thousands across India for certified natural astrological gemstones.
            </p>

            {/* Contact details */}
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 group">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D4AF37]/70 group-hover:text-[#D4AF37]" />
                <span>M.G. Road, Bangalore – 560001,<br />Karnataka, India</span>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 group"
                >
                  <Phone size={14} className="shrink-0 text-[#D4AF37]/70 group-hover:text-[#D4AF37]" />
                  +91-XXXXXXXXXX
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@indiannaturalgems.com"
                  className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 group"
                >
                  <Mail size={14} className="shrink-0 text-[#D4AF37]/70 group-hover:text-[#D4AF37]" />
                  info@indiannaturalgems.com
                </a>
              </li>
            </ul>

            {/* Social media icons */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { Icon: FacebookIcon,  href: 'https://facebook.com/indiannaturalgems',  label: 'Facebook' },
                { Icon: InstagramIcon, href: 'https://instagram.com/indiannaturalgems', label: 'Instagram' },
                { Icon: TwitterIcon,   href: 'https://twitter.com/indiannaturalgems',   label: 'Twitter / X' },
                { Icon: YoutubeIcon,   href: 'https://youtube.com/@indiannaturalgems',  label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 — Quick links */}
          <motion.div variants={fadeInUp}>
            <h3
              className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] transition-colors duration-200 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Shop categories */}
          <motion.div variants={fadeInUp}>
            <h3
              className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shop Categories
            </h3>
            <ul className="space-y-2">
              {SHOP_CATEGORIES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] transition-colors duration-200 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 — Newsletter */}
          <motion.div variants={fadeInUp} className="space-y-5">
            <div>
              <h3
                className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stay Updated
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Get exclusive offers, gem guides, and astrological insights delivered
                straight to your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                <Heart size={14} className="text-[#D4AF37] shrink-0" fill="currentColor" />
                <p className="text-sm text-[#D4AF37] font-medium">
                  Thank you for subscribing!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5" noValidate>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2.5 text-sm bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/60 focus:bg-white/12 transition-all duration-200"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-[#D4AF37] text-[#0A0A2E] hover:bg-[#F5D06B] active:bg-[#A07B1E] transition-colors duration-200 tracking-wide"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Shield size={11} className="text-gray-600 shrink-0" />
              No spam, unsubscribe anytime.
            </p>

            {/* Opening hours */}
            <div className="pt-2 border-t border-white/8">
              <p
                className="text-xs text-[#D4AF37]/80 font-medium mb-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Store Hours
              </p>
              <p className="text-xs text-gray-500">Mon – Sat: 10:00 AM – 8:00 PM</p>
              <p className="text-xs text-gray-500">Sunday: Closed</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#0A0A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            {/* Copyright */}
            <p>
              &copy; {new Date().getFullYear()} Indian Natural Gems and Jewellery. All rights reserved.
            </p>

            {/* Made with love */}
            <p className="flex items-center gap-1">
              Made with{' '}
              <Heart
                size={11}
                className="text-[#9B1B30]"
                fill="currentColor"
                aria-label="love"
              />{' '}
              in Bangalore
            </p>

            {/* Legal links */}
            <nav className="flex items-center gap-4" aria-label="Legal links">
              <Link
                href="/privacy"
                className="hover:text-[#D4AF37] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20" aria-hidden="true">|</span>
              <Link
                href="/terms"
                className="hover:text-[#D4AF37] transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>

    </footer>
  );
}
