'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, ShoppingCart, Heart, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { products, categories, Product } from '../data/products'
import { useCart } from '../context/CartContext'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
]

export default function ShopPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { addToCart } = useCart()

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategory !== 'all') result = result.filter(p => p.categorySlug === selectedCategory)
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
      case 'featured': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }
    return result
  }, [search, selectedCategory, priceRange, sortBy])

  const toggleWishlist = (id: string) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Our Gemstone Collection</h1>
            <p className="text-amber-200 text-lg max-w-2xl">
              Over 40 categories of certified natural gemstones. Each stone personally inspected by Tausif Raza, GII-certified gemologist.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className="text-amber-400 text-sm font-semibold">{products.length} stones available</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400 text-sm">All GII Certified</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search gemstones, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-xl hover:border-amber-400 transition-colors font-medium text-stone-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer font-medium text-stone-700"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Price Range (₹)</label>
                    <div className="flex items-center gap-3">
                      <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                        className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="Min" />
                      <span className="text-stone-400">–</span>
                      <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                        className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="Max" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[[0, 5000], [5000, 20000], [20000, 50000], [50000, 200000]].map(([min, max]) => (
                        <button key={min} onClick={() => setPriceRange([min, max])}
                          className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full hover:bg-amber-100 border border-amber-200 transition-colors">
                          ₹{min > 0 ? `${min/1000}k` : '0'}–{max === 200000 ? '2L+' : `${max/1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Planet</label>
                    <div className="flex flex-wrap gap-2">
                      {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map(planet => (
                        <button key={planet} className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded-full hover:bg-amber-100 hover:text-amber-700 border border-stone-200 hover:border-amber-300 transition-colors">
                          {planet}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-none text-sm font-semibold px-4 py-2 rounded-full transition-all ${selectedCategory === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300'}`}
          >
            All Gems
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-none text-sm font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap ${selectedCategory === cat.slug ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-stone-500 text-sm">
            Showing <strong className="text-stone-700">{filtered.length}</strong> gemstones
            {selectedCategory !== 'all' && <span className="text-amber-600"> in {categories.find(c => c.slug === selectedCategory)?.name}</span>}
          </p>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl font-bold text-stone-700 mb-2">No gemstones found</h3>
            <p className="text-stone-500">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setSelectedCategory('all'); setPriceRange([0, 200000]) }}
              className="mt-4 text-amber-600 hover:text-amber-500 font-semibold">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                inWishlist={wishlist.includes(product.id)}
                onWishlist={() => toggleWishlist(product.id)}
                onAddToCart={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1, carat: parseFloat(product.carat) || undefined, category: product.category })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, index, inWishlist, onWishlist, onAddToCart }: {
  product: Product; index: number; inWishlist: boolean; onWishlist: () => void; onAddToCart: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-52 bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
          {product.originalPrice > product.price && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        <button
          onClick={onWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-500 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{product.carat} ct</span>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-amber-600 font-semibold mb-1">{product.category}</div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif font-bold text-stone-800 mb-1 leading-tight hover:text-amber-700 transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="text-xs text-stone-400 mb-2">{product.origin} · {product.planet}</div>

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
            onClick={onAddToCart}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-full transition-all hover:scale-105"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}
