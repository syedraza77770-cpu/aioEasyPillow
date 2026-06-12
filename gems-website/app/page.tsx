'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Star, Shield, Award, ChevronRight, Quote, Phone, Mail, MapPin, Gem, ArrowRight, CheckCircle } from 'lucide-react'
import { getFeaturedProducts, getNewProducts, categories } from './data/products'
import { useCart } from './context/CartContext'

const heroSlides = [
  {
    title: 'Certified Natural Gemstones',
    subtitle: 'Sourced from the Earth\'s Finest Deposits',
    cta: 'Explore Collection',
    bg: 'from-stone-900 via-amber-950 to-stone-900',
    accent: 'text-amber-400',
    gem: '💎',
  },
  {
    title: '51 Years of Gemological Trust',
    subtitle: 'Three Generations. One Passion. Authentic Stones.',
    cta: 'Our Story',
    bg: 'from-emerald-950 via-stone-900 to-emerald-950',
    accent: 'text-emerald-400',
    gem: '🌿',
  },
  {
    title: 'Astrological Gemstones',
    subtitle: 'GII-Certified. Tausif Raza, Expert Gemologist.',
    cta: 'Find Your Stone',
    bg: 'from-indigo-950 via-stone-900 to-indigo-950',
    accent: 'text-indigo-400',
    gem: '✨',
  },
]

const testimonials = [
  {
    name: 'Suresh Menon',
    location: 'Bangalore',
    rating: 5,
    text: 'I have been visiting Tausif bhai\'s shop for over 12 years now. The Blue Sapphire he recommended transformed my career. His knowledge is unparalleled — he explained every detail about the stone\'s quality, origin, and how to properly set and wear it. I won\'t trust anyone else with my gemstone purchases.',
    gem: 'Blue Sapphire',
  },
  {
    name: 'Priya Nair',
    location: 'Chennai',
    rating: 5,
    text: 'After getting cheated by a local dealer selling synthetic stones, a friend referred me to Indian Natural Gems. Tausif ji personally verified my stone under the loupe and even showed me how to identify genuine rubies from glass. The Ruby I purchased has brought remarkable positive changes. The certification gave me complete peace of mind.',
    gem: 'Ruby (Manik)',
  },
  {
    name: 'Rajiv Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'I ordered a Pukhraj (Yellow Sapphire) online and was initially nervous about buying a gemstone this way. But the product arrived exactly as described, with a detailed GII certificate and a handwritten note from Tausif ji explaining the stone\'s properties. The quality exceeded my expectations — I\'ve received compliments from both my jeweller and my astrologer!',
    gem: 'Yellow Sapphire',
  },
  {
    name: 'Deepa Krishnamurthy',
    location: 'Mysore',
    rating: 5,
    text: 'We purchased Rudraksha malas for our entire family from this shop. Tausif bhai took the time to understand each family member\'s birth chart and recommended the appropriate mukhi. Two years later, we are all experiencing the benefits. The authenticity certificates they provide are thorough and credible.',
    gem: 'Rudraksha',
  },
]

const trustBadges = [
  { icon: '🏆', title: '51 Years', desc: 'Family Legacy Since 1973' },
  { icon: '📜', title: 'GII Certified', desc: 'Gemological Institute of India' },
  { icon: '🔬', title: '100% Natural', desc: 'Lab-Verified Authentic Stones' },
  { icon: '🛡️', title: 'Secure Payment', desc: 'UPI, Cards & Cash on Delivery' },
  { icon: '🌍', title: 'Ship Worldwide', desc: 'Delivered to 40+ Countries' },
  { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-Free Return Policy' },
]

const planets = [
  { planet: 'Sun', stone: 'Ruby', color: 'from-red-600 to-orange-500', symbol: '☀️' },
  { planet: 'Moon', stone: 'Pearl', color: 'from-slate-300 to-blue-100', symbol: '🌙' },
  { planet: 'Mars', stone: 'Red Coral', color: 'from-red-700 to-rose-500', symbol: '♂️' },
  { planet: 'Mercury', stone: 'Emerald', color: 'from-emerald-600 to-green-400', symbol: '☿' },
  { planet: 'Jupiter', stone: 'Yellow Sapphire', color: 'from-yellow-500 to-amber-300', symbol: '♃' },
  { planet: 'Venus', stone: 'Diamond', color: 'from-blue-200 to-purple-100', symbol: '♀️' },
  { planet: 'Saturn', stone: 'Blue Sapphire', color: 'from-blue-800 to-indigo-600', symbol: '♄' },
  { planet: 'Rahu', stone: 'Hessonite', color: 'from-amber-800 to-brown-600', symbol: '☊' },
  { planet: 'Ketu', stone: "Cat's Eye", color: 'from-slate-600 to-gray-400', symbol: '☋' },
]

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const featured = getFeaturedProducts()
  const newArrivals = getNewProducts()
  const { addToCart } = useCart()

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((s) => (s + 1) % testimonials.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            className={`absolute inset-0 bg-gradient-to-br ${heroSlides[activeSlide].bg}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* Decorative gems */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-10"
              style={{ left: `${(i * 7 + 5) % 95}%`, top: `${(i * 11 + 3) % 90}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            >
              💎
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="inline-block text-6xl mb-4">{heroSlides[activeSlide].gem}</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={`font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${heroSlides[activeSlide].accent}`}>
                {heroSlides[activeSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-amber-100/80 mb-8 max-w-3xl mx-auto">
                {heroSlides[activeSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/shop" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50">
              <ShoppingBag className="w-5 h-5" />
              Shop Gemstones
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border-2 border-amber-400/60 text-amber-100 hover:bg-amber-400/10 px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105">
              <ArrowRight className="w-5 h-5" />
              Our Story
            </Link>
          </motion.div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-amber-400 w-8' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-400/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-stone-900 border-y border-amber-700/30 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {trustBadges.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <div className="font-bold text-amber-400 text-sm">{b.title}</div>
                  <div className="text-stone-400 text-xs">{b.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-stone-100 rounded-2xl p-8 border border-amber-200 shadow-xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      💎
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-800">Tausif Raza</h3>
                      <p className="text-amber-700 font-medium">GII-Certified Gemologist, Bangalore</p>
                    </div>
                  </div>
                  <blockquote className="text-stone-600 italic text-lg leading-relaxed border-l-4 border-amber-400 pl-4">
                    "Every gemstone carries the energy of the cosmos within it. My life's work is to help each person find the stone that resonates with their journey — not just a beautiful object, but a genuine connection to the natural world."
                  </blockquote>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['GII Certified', 'IGI Member', 'Vedic Astrology', '51 Years Experience'].map((tag) => (
                      <span key={tag} className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Floating gem decorations */}
                <motion.div
                  className="absolute -top-4 -right-4 text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 text-3xl"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  💎
                </motion.div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div>
                <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Our Heritage</span>
                <h2 className="font-serif text-4xl font-bold text-stone-800 mt-2 mb-6">
                  51 Years of Authentic Gemstones in Bangalore
                </h2>
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    What began in 1973 as a modest gemstone counter on M.G. Road has grown into one of Bangalore's most trusted names in certified natural gemstones and spiritual jewellery. Indian Natural Gems and Jewellery was founded on a single principle: <strong className="text-stone-800">every stone we sell must be exactly what we say it is.</strong>
                  </p>
                  <p>
                    Today, the second generation of the Raza family — led by gemologist <strong className="text-stone-800">Tausif Raza</strong>, a member of the Gemological Institute of India (GII) — continues this legacy. Tausif has spent over two decades studying the science of gems, travelling to mining regions from Myanmar's ruby valleys to Sri Lanka's sapphire fields, and developing the expertise to assess and certify stones to international standards.
                  </p>
                  <p>
                    Unlike dealers who rely on supplier certifications alone, Tausif personally examines every gemstone under professional gemmological equipment before it enters our inventory. We partner with GII and independent gemological labs to provide certification documentation you can verify independently.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { num: '51+', label: 'Years in Business' },
                    { num: '10K+', label: 'Stones Certified' },
                    { num: '4.9★', label: 'Customer Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center bg-white rounded-xl p-4 shadow-sm border border-amber-100">
                      <div className="font-serif text-2xl font-bold text-amber-600">{stat.num}</div>
                      <div className="text-stone-500 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <Link href="/about" className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                    Read Full Story <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-600 font-semibold px-6 py-3 rounded-full border-2 border-amber-300 hover:bg-amber-50 transition-all duration-300">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Nav Graha (9 Planets) Section ── */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">Vedic Astrology</span>
              <h2 className="font-serif text-4xl font-bold text-white mt-2 mb-4">
                Nav Graha Gemstones
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto">
                Each of the nine celestial bodies in Vedic astrology has a corresponding gemstone. Find the stone aligned with your planetary chart.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {planets.map((p, i) => (
              <motion.div
                key={p.planet}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className={`bg-gradient-to-br ${p.color} rounded-xl p-3 text-center cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-2xl mb-1">{p.symbol}</div>
                <div className="text-white font-bold text-xs">{p.planet}</div>
                <div className="text-white/70 text-xs mt-0.5 leading-tight">{p.stone}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Hand-Picked Selection</span>
                <h2 className="font-serif text-4xl font-bold text-stone-800 mt-2">Featured Gemstones</h2>
              </div>
              <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-600 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-md hover:shadow-2xl transition-all duration-400"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 h-52">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                    💎
                  </div>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {product.carat} ct
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs text-amber-600 font-semibold mb-1">{product.category}</div>
                  <h3 className="font-serif font-bold text-stone-800 mb-1 leading-tight line-clamp-2">{product.name}</h3>
                  <div className="text-xs text-stone-500 mb-3">{product.origin}</div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-3 h-3 ${s < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`} />
                    ))}
                    <span className="text-xs text-stone-500 ml-1">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-stone-800">₹{product.price.toLocaleString('en-IN')}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-full font-semibold transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1, carat: parseFloat(product.carat) || undefined, category: product.category })}
                        className="text-xs bg-stone-800 hover:bg-stone-700 text-white px-3 py-2 rounded-full font-semibold transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105">
              <Gem className="w-5 h-5" />
              Browse All Gemstones
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Complete Range</span>
              <h2 className="font-serif text-4xl font-bold text-stone-800 mt-2 mb-4">Shop by Category</h2>
              <p className="text-stone-500 max-w-xl mx-auto">40+ categories of natural gemstones, each certified and sourced from authentic origins across the world.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={`/shop/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-stone-100 hover:border-amber-300 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
                  <span className="text-xs font-semibold text-stone-700 leading-tight">{cat.name}</span>
                  <span className="text-xs text-amber-600">{cat.planet}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 bg-stone-900">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">Fresh Stock</span>
                  <h2 className="font-serif text-3xl font-bold text-white mt-1">New Arrivals</h2>
                </div>
                <Link href="/shop?filter=new" className="text-amber-400 text-sm font-semibold hover:text-amber-300 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeInSection>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-none w-56 bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  <div className="relative h-40 bg-gradient-to-br from-amber-900 to-stone-800">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-80" />
                    <div className="absolute top-2 left-2">
                      <span className="bg-amber-500 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-amber-400 mb-1">{product.category}</div>
                    <div className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-2">{product.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-amber-400 font-bold">₹{product.price.toLocaleString('en-IN')}</div>
                      <Link href={`/product/${product.slug}`} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">View →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Customer Stories</span>
            <h2 className="font-serif text-4xl font-bold text-white mt-2 mb-12">What Our Clients Say</h2>
          </FadeInSection>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 md:p-12"
            >
              <Quote className="w-10 h-10 text-amber-400 mx-auto mb-6 opacity-60" />
              <p className="text-amber-50 text-lg md:text-xl leading-relaxed mb-8 italic">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, s) => (
                    <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="text-white font-bold">{testimonials[activeTestimonial].name}</div>
                <div className="text-amber-400 text-sm">{testimonials[activeTestimonial].location} · Purchased: {testimonials[activeTestimonial].gem}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-amber-400 w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Our Commitment</span>
              <h2 className="font-serif text-4xl font-bold text-stone-800 mt-2 mb-4">Why Choose Indian Natural Gems</h2>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-8 h-8" />, title: 'GII-Certified Authenticity', desc: 'Every gemstone is personally assessed by Tausif Raza and accompanied by a Gemological Institute of India certification you can verify independently.' },
              { icon: <Award className="w-8 h-8" />, title: '51 Years of Expertise', desc: 'Our family has been in the gemstone business since 1973. That depth of experience means we know exactly what to look for — and what to reject.' },
              { icon: <Gem className="w-8 h-8" />, title: 'Direct Source Procurement', desc: "We travel to mining regions and buy directly from trusted miners and cutters. No middlemen means better quality at honest prices." },
              { icon: <CheckCircle className="w-8 h-8" />, title: 'Astrological Consultation', desc: 'Unsure which gemstone you need? We offer free consultation with Tausif Raza to align your gemstone choice with your birth chart.' },
              { icon: <Star className="w-8 h-8" />, title: 'Personalised Service', desc: 'Whether you are buying a ₹1,500 citrine or a ₹95,000 diamond, you receive the same careful attention and detailed explanation of your purchase.' },
              { icon: <MapPin className="w-8 h-8" />, title: 'Bangalore\'s Trusted Name', desc: 'Located on M.G. Road, the heart of Bangalore\'s jewellery district. Thousands of customers from Bangalore, across India, and internationally trust us.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-300"
              >
                <div className="text-amber-500 flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Choosing Your Gemstone?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
              Every gemstone journey is unique. Contact Tausif Raza for a personalised consultation — free of charge, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-amber-50 transition-all duration-300 hover:scale-105">
                <Phone className="w-5 h-5" />
                Get Free Consultation
              </Link>
              <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <ShoppingBag className="w-5 h-5" />
                Browse Collection
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </main>
  )
}
