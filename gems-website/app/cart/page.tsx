'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Shield, Truck, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal > 5000 ? 0 : 299
  const total = subtotal - discount + shipping

  const handleCoupon = () => {
    if (coupon.toUpperCase() === 'GEMS10') setCouponApplied(true)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-stone-50 flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="font-serif text-3xl font-bold text-stone-700 mb-3">Your Cart is Empty</h1>
          <p className="text-stone-500 mb-8 max-w-sm mx-auto">Explore our collection of certified natural gemstones and find the stone that resonates with you.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            <ShoppingBag className="w-5 h-5" />
            Browse Gemstones
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-7 h-7 text-amber-500" />
            <h1 className="font-serif text-3xl font-bold text-stone-800">Your Cart</h1>
            <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full">{items.length} item{items.length > 1 ? 's' : ''}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-amber-600 font-semibold mb-0.5">{item.category}</div>
                    <h3 className="font-serif font-bold text-stone-800 leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    {item.carat && <div className="text-xs text-stone-400 mb-2">{item.carat} carats</div>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-stone-600" />
                        </button>
                        <span className="font-bold text-stone-800 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-stone-600" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <div className="text-xs text-stone-400">₹{item.price.toLocaleString('en-IN')} each</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors flex-shrink-0 self-start mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <Link href="/shop" className="text-amber-600 hover:text-amber-500 font-semibold text-sm flex items-center gap-1">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-stone-400 hover:text-red-500 text-sm transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon (GEMS10)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-amber-600">Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
                )}
                <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-800 text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Coupon code (try GEMS10)"
                    className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleCoupon}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && <p className="text-xs text-emerald-600 mt-1">✓ Coupon applied — 10% off!</p>}
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-105 mb-3"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="space-y-2">
                {[
                  { icon: <Shield className="w-4 h-4" />, text: 'Secure SSL checkout' },
                  { icon: <Truck className="w-4 h-4" />, text: 'Insured delivery included' },
                  { icon: <Tag className="w-4 h-4" />, text: 'GII certificate with every stone' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-stone-500 text-xs">
                    <span className="text-amber-500">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-wide">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                  <span key={method} className="text-xs bg-stone-50 border border-stone-200 text-stone-600 px-2 py-1 rounded-lg font-medium">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
