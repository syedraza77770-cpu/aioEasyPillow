'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Award, Shield, Gem, MapPin, Phone, Star, CheckCircle, ArrowRight } from 'lucide-react'

function FadeIn({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const initial = direction === 'up' ? { opacity: 0, y: 40 } : direction === 'left' ? { opacity: 0, x: -40 } : { opacity: 0, x: 40 }
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, y: 0, x: 0 } : {}} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  )
}

const milestones = [
  { year: '1973', title: 'Founded in Bangalore', desc: 'The first gemstone counter opens on M.G. Road. The Raza family begins a lifelong journey in natural gemstones.' },
  { year: '1985', title: 'GII Affiliation', desc: 'Formal partnership with the Gemological Institute of India. Every stone sold comes with certified documentation.' },
  { year: '1998', title: 'Second Generation', desc: 'Tausif Raza joins the family business after completing his gemological certification from GII, Calcutta.' },
  { year: '2008', title: 'Online Presence', desc: 'Launching India\'s early online gemstone listings to serve customers across the country from our trusted Bangalore base.' },
  { year: '2015', title: 'International Sourcing', desc: 'Direct sourcing partnerships established in Sri Lanka, Myanmar, Colombia, and Zambia — ensuring top-quality gems without middlemen.' },
  { year: '2024', title: '51 Years & Thriving', desc: 'Over 10,000 certified gemstones sold. Thousands of happy customers across India and 40+ countries worldwide.' },
]

const credentials = [
  { title: 'Gemological Institute of India (GII)', desc: 'Certified Member and affiliated dealer. All certifications adhere to GII standards.' },
  { title: 'International Gemological Institute (IGI)', desc: 'Associate member enabling us to issue IGI-compatible documentation for premium stones.' },
  { title: 'Vedic Astrology Consultation', desc: 'Tausif Raza provides astrology-based gemstone recommendations drawing on 25+ years of experience.' },
  { title: 'Laboratory Verification', desc: 'Independent laboratory testing for all high-value gemstones. Reports available on request.' },
]

const teamValues = [
  { icon: <Shield className="w-6 h-6" />, title: 'Uncompromising Authenticity', desc: "We have turned away profitable sales rather than compromise on authenticity. If we can't verify a stone to our standard, we don't sell it." },
  { icon: <Gem className="w-6 h-6" />, title: 'Deep Gemological Knowledge', desc: 'Tausif Raza has personally examined and assessed over 50,000 gemstones in his career. That expertise cannot be replicated by a certificate alone.' },
  { icon: <Star className="w-6 h-6" />, title: 'Personalised Guidance', desc: 'Every customer receives time and attention. Whether you know exactly what you need or are starting fresh, we will guide you without pressure.' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'Transparent Pricing', desc: "Our prices reflect fair market value and genuine quality. We don't inflate prices to make discounts seem larger — what you see is what we believe the stone is worth." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute text-3xl opacity-5"
            style={{ left: `${(i * 9 + 4) % 95}%`, top: `${(i * 13 + 5) % 85}%` }}
            animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
            transition={{ duration: 5 + i % 3, repeat: Infinity, delay: i * 0.4 }}>
            💎
          </motion.div>
        ))}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Our Heritage</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-3 mb-6 leading-tight">
              51 Years of Authentic<br />
              <span className="text-amber-400">Gemstone Excellence</span>
            </h1>
            <p className="text-amber-100/80 text-xl max-w-2xl mx-auto leading-relaxed">
              What began as a small gemstone counter in the heart of Bangalore has grown into one of India's most trusted names in certified natural gemstones.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-50 to-stone-100 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-white rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                        💎
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-800">Tausif Raza</h3>
                        <p className="text-amber-700 font-semibold">GII-Certified Gemologist</p>
                        <p className="text-stone-500 text-sm">25+ Years in Gemology</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        'Gemological Institute of India (GII) Member',
                        'IGI Associate Member',
                        '25+ Years Active Gemological Practice',
                        'Vedic Astrology Gemstone Consultant',
                        'Direct Sourcing in 8 Countries',
                        '10,000+ Stones Personally Certified',
                      ].map(cred => (
                        <div key={cred} className="flex items-center gap-2 text-stone-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm">{cred}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <blockquote className="text-stone-600 italic text-sm leading-relaxed">
                        "My father taught me: a gemstone is not just a beautiful object. It carries the energy of millions of years of geological history. When you hold an authentic stone, you are holding something the Earth itself created. My responsibility is to ensure that energy reaches you — untampered, unaltered, and certified genuine."
                      </blockquote>
                      <p className="text-amber-700 text-sm font-semibold mt-2">— Tausif Raza</p>
                    </div>
                  </div>
                </div>

                <motion.div className="absolute -top-3 -right-3 bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  📜 GII Certified
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">The Raza Family Story</span>
                <h2 className="font-serif text-4xl font-bold text-stone-800 mt-3 mb-6">Three Generations of Gemological Passion</h2>

                <div className="space-y-5 text-stone-600 leading-relaxed">
                  <p>
                    In 1973, <strong className="text-stone-800">Mohammed Abdul Raza</strong> opened a modest gemstone counter on M.G. Road — Bangalore's commercial heartbeat. His vision was straightforward: sell only what you would be proud to wear yourself. Every stone, every certification, every customer interaction would reflect that principle.
                  </p>
                  <p>
                    For two decades, the shop built its reputation stone by stone, customer by customer. Word spread among Bangalore's astrologers, jewellers, and gem enthusiasts that the Raza family stocked stones that were genuinely what they claimed to be — a rarity in a trade notorious for misrepresentation.
                  </p>
                  <p>
                    When <strong className="text-stone-800">Tausif Raza</strong> completed his formal gemological training at the Gemological Institute of India in the late 1990s, he brought scientific rigour to a family tradition already grounded in integrity. He invested in professional gemmological equipment — refractometers, spectroscopes, polariscopes — and began producing the detailed certification documentation that now accompanies every stone we sell.
                  </p>
                  <p>
                    Today, Indian Natural Gems and Jewellery serves thousands of customers across India and internationally. But the approach remains exactly what it was in 1973: personal attention, honest assessment, and absolute commitment to authenticity.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-stone-800">Our Journey</h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-amber-200 -translate-x-1/2" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.1}>
                  <div className={`flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? 'pr-10 text-right' : 'pl-10'}`}>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 inline-block max-w-sm">
                        <div className="font-serif text-2xl font-bold text-amber-600 mb-1">{m.year}</div>
                        <h3 className="font-bold text-stone-800 mb-1">{m.title}</h3>
                        <p className="text-stone-500 text-sm">{m.desc}</p>
                      </div>
                    </div>
                    <div className="relative flex-none z-10">
                      <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-white font-bold text-xs text-center leading-tight">{m.year}</span>
                      </div>
                    </div>
                    <div className="md:hidden flex-1">
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                        <h3 className="font-bold text-stone-800 mb-1">{m.title}</h3>
                        <p className="text-stone-500 text-sm">{m.desc}</p>
                      </div>
                    </div>
                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? 'pl-10' : 'pr-10'}`} />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Verified Standards</span>
              <h2 className="font-serif text-4xl font-bold text-stone-800 mt-2">Certifications & Credentials</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {credentials.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl border border-amber-100">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 mb-1">{c.title}</h3>
                    <p className="text-stone-500 text-sm">{c.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">What We Stand For</span>
              <h2 className="font-serif text-4xl font-bold text-white mt-2">Our Core Values</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {teamValues.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all">
                  <div className="text-amber-400 flex-shrink-0 mt-1">{v.icon}</div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{v.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-3xl p-8 md:p-12 border border-amber-100">
              <MapPin className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-bold text-stone-800 mb-3">Visit Us in Bangalore</h2>
              <p className="text-stone-600 mb-2 text-lg">M.G. Road, Bangalore – 560001, Karnataka, India</p>
              <p className="text-stone-500 mb-6">Open Monday – Saturday: 10:00 AM – 7:30 PM</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold px-6 py-3 rounded-full hover:bg-amber-600 transition-all hover:scale-105">
                  <Phone className="w-4 h-4" /> Call Us
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-stone-800 text-white font-bold px-6 py-3 rounded-full hover:bg-stone-700 transition-all hover:scale-105">
                  <ArrowRight className="w-4 h-4" /> Get Directions
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
