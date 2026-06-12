'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, ArrowLeft, Shield } from 'lucide-react'
import { getProductsByCategory, categories } from '../../data/products'
import { useCart } from '../../context/CartContext'

export default function CategoryPage() {
  const params = useParams()
  const slug = typeof params.category === 'string' ? params.category : params.category?.[0] ?? ''
  const category = categories.find(c => c.slug === slug)
  const catProducts = getProductsByCategory(slug)
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<string[]>([])

  if (!category) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-stone-50">
        <div className="text-6xl mb-4">💎</div>
        <h1 className="font-serif text-2xl font-bold text-stone-700 mb-2">Category Not Found</h1>
        <Link href="/shop" className="text-amber-600 font-semibold hover:underline">← Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/shop" className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Gems
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold">{category.name}</h1>
                <p className="text-amber-300 font-semibold">Planet: {category.planet}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="bg-amber-500/20 text-amber-300 text-sm font-semibold px-3 py-1 rounded-full border border-amber-500/30">
                {catProducts.length} stone{catProducts.length !== 1 ? 's' : ''} available
              </span>
              <span className="flex items-center gap-1 text-sm text-stone-400">
                <Shield className="w-4 h-4 text-amber-400" /> All GII Certified
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {catProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h2 className="font-serif text-2xl font-bold text-stone-700 mb-3">Coming Soon</h2>
            <p className="text-stone-500 mb-6">We're sourcing the finest {category.name} stones. Please check back soon or contact us for availability.</p>
            <Link href="/contact" className="bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors">
              Enquire Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {catProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-52 bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
                    {product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setWishlist(w => w.includes(product.id) ? w.filter(x => x !== product.id) : [...w, product.id])}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-400 hover:text-red-500'}`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif font-bold text-stone-800 mb-1 leading-tight hover:text-amber-700 transition-colors line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="text-xs text-stone-400 mb-2">{product.origin} · {product.carat} ct</div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-3 h-3 ${s < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                    ))}
                    <span className="text-xs text-stone-400 ml-1">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-stone-800">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1, carat: parseFloat(product.carat) || undefined, category: product.category })}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-full transition-all hover:scale-105"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
