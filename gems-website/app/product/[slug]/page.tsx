'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Shield, Award, Star, ChevronLeft, Check, Info, Sparkles, Globe, Gem, Truck, RefreshCcw } from 'lucide-react'
import { getProductBySlug, products } from '../../data/products'
import { useCart } from '../../context/CartContext'

export default function ProductPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? ''
  const product = getProductBySlug(slug)
  const { addToCart } = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'astro' | 'healing' | 'care'>('astro')

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-stone-50">
        <div className="text-6xl mb-4">💎</div>
        <h1 className="font-serif text-3xl font-bold text-stone-700 mb-2">Gemstone Not Found</h1>
        <p className="text-stone-500 mb-6">This gemstone may no longer be available.</p>
        <Link href="/shop" className="bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors">
          Browse Collection
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1, carat: parseFloat(product.carat) || undefined, category: product.category })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)

  const tabs = [
    { id: 'astro' as const, label: 'Astrological Benefits', icon: '⭐' },
    { id: 'healing' as const, label: 'Healing Properties', icon: '✨' },
    { id: 'care' as const, label: 'Care Instructions', icon: '💧' },
  ]

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-600 transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.categorySlug}`} className="hover:text-amber-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-stone-700 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Image Gallery ── */}
          <div>
            <motion.div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 aspect-square shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
                </motion.div>
              </AnimatePresence>

              {product.certification && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Shield className="w-3 h-3" /> GII Certified
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? 'border-amber-500 shadow-lg shadow-amber-200' : 'border-stone-200 hover:border-amber-300'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-amber-600 font-semibold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {product.category}
              </span>
              <button
                onClick={() => setInWishlist(w => !w)}
                className={`p-2 rounded-full transition-all ${inWishlist ? 'text-red-500 bg-red-50' : 'text-stone-400 bg-stone-100 hover:bg-red-50 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className={`w-4 h-4 ${s < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                ))}
              </div>
              <span className="font-bold text-stone-700">{product.rating}</span>
              <span className="text-stone-400 text-sm">({product.reviewCount} reviews)</span>
            </div>

            <p className="text-stone-600 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Price */}
            <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-4 mb-6 border border-amber-100">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl font-bold text-stone-800">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <span className="text-stone-400 line-through text-lg">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">Inclusive of all taxes · Free shipping above ₹5,000</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Weight', value: product.weight, icon: <Gem className="w-4 h-4" /> },
                { label: 'Carat', value: product.carat !== 'N/A' ? `${product.carat} ct` : product.carat, icon: '⚖️' },
                { label: 'Origin', value: product.origin, icon: <Globe className="w-4 h-4" /> },
                { label: 'Planet', value: product.planet, icon: '🪐' },
                { label: 'Certification', value: 'GII Certified', icon: <Shield className="w-4 h-4" /> },
                { label: 'Suitable For', value: product.suitableFor[0], icon: '♈' },
              ].map((spec) => (
                <div key={spec.label} className="bg-white rounded-xl p-3 border border-stone-100 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">
                    {typeof spec.icon === 'string' ? spec.icon : spec.icon}
                  </span>
                  <div>
                    <div className="text-xs text-stone-400 font-medium">{spec.label}</div>
                    <div className="text-sm font-semibold text-stone-700 leading-tight">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suitable For */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-stone-600 mb-2">Suitable Rashi / Zodiac:</div>
              <div className="flex flex-wrap gap-2">
                {product.suitableFor.map(rashi => (
                  <span key={rashi} className="text-sm bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 font-medium">{rashi}</span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 ${addedToCart ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
              >
                {addedToCart ? (
                  <><Check className="w-5 h-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </button>
              <Link
                href="/checkout"
                className="flex-1 flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-bold py-4 rounded-full text-lg transition-all duration-300 hover:scale-105"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: <Shield className="w-4 h-4" />, text: '100% Authentic' },
                { icon: <Truck className="w-4 h-4" />, text: 'Free Delivery' },
                { icon: <RefreshCcw className="w-4 h-4" />, text: '30-Day Return' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 rounded-xl p-2 border border-stone-100">
                  <span className="text-amber-500">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm">
          <div className="flex gap-2 border-b border-stone-100 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-amber-700 border-b-2 border-amber-500 -mb-px' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="prose max-w-none text-stone-600 leading-relaxed"
            >
              {activeTab === 'astro' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🔮</span>
                    <h3 className="font-serif text-xl font-bold text-stone-800 m-0">Astrological Significance</h3>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span>🪐</span>
                      <strong className="text-amber-800">Ruling Planet: {product.planet}</strong>
                    </div>
                  </div>
                  <p className="whitespace-pre-line">{product.astrologicalBenefits}</p>
                </div>
              )}
              {activeTab === 'healing' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💚</span>
                    <h3 className="font-serif text-xl font-bold text-stone-800 m-0">Healing Properties</h3>
                  </div>
                  <p>{product.healingProperties}</p>
                </div>
              )}
              {activeTab === 'care' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💧</span>
                    <h3 className="font-serif text-xl font-bold text-stone-800 m-0">Care &amp; Maintenance</h3>
                  </div>
                  <p>{product.careInstructions}</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 m-0">For personalised wearing guidance and energisation rituals, please contact our gemologist Tausif Raza.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">More in {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-36">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-stone-700 leading-tight line-clamp-2 mb-1">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700">₹{p.price.toLocaleString('en-IN')}</span>
                      <Link href={`/product/${p.slug}`} className="text-xs text-amber-600 hover:text-amber-500 font-semibold">View →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
