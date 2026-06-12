'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CreditCard, Truck, CheckCircle, ChevronRight, Lock, Phone, Gem } from 'lucide-react'
import { useCart } from '../context/CartContext'

type Step = 'address' | 'payment' | 'review' | 'success'

type AddressForm = {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; pincode: string; country: string
}

const INITIAL_ADDRESS: AddressForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: 'Karnataka', pincode: '', country: 'India'
}

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major Indian banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💰', desc: 'Pay when your order arrives' },
]

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [processing, setProcessing] = useState(false)
  const [orderNumber] = useState(() => `IGJ${Date.now().toString().slice(-8)}`)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 299
  const total = subtotal + shipping

  const steps: { id: Step; label: string }[] = [
    { id: 'address', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ]

  const handlePlaceOrder = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2500))
    setProcessing(false)
    clearCart()
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-20 bg-stone-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl border border-stone-100"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-stone-500 mb-4">Thank you for your purchase from Indian Natural Gems & Jewellery.</p>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-6">
            <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Order Number</div>
            <div className="font-mono font-bold text-stone-800 text-xl">{orderNumber}</div>
          </div>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Your GII-certified gemstone will be carefully packed and shipped within 24–48 hours. A confirmation email has been sent to <strong>{address.email || 'your email'}</strong>.
          </p>
          <p className="text-amber-600 text-sm font-medium mb-6">For any queries, contact us at +91 98765 43210 or WhatsApp</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105">
            <Gem className="w-5 h-5" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-stone-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-serif text-2xl font-bold text-stone-700 mb-3">Your cart is empty</h1>
        <Link href="/shop" className="bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors">Browse Gemstones</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const stepIndex = steps.findIndex(x => x.id === step)
            const done = i < stepIndex
            const active = s.id === step
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-semibold ${active ? 'text-amber-600' : done ? 'text-emerald-600' : 'text-stone-400'}`}>{s.label}</span>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-stone-300" />}
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 1: ADDRESS */}
              {step === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Delivery Address</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {([
                        ['firstName', 'First Name', 'text', ''],
                        ['lastName', 'Last Name', 'text', ''],
                        ['email', 'Email Address', 'email', 'col-span-2'],
                        ['phone', 'Phone Number', 'tel', ''],
                        ['address', 'Street Address', 'text', 'col-span-2'],
                        ['city', 'City', 'text', ''],
                        ['pincode', 'PIN Code', 'text', ''],
                        ['state', 'State', 'text', ''],
                        ['country', 'Country', 'text', ''],
                      ] as [keyof AddressForm, string, string, string][]).map(([field, label, type, className]) => (
                        <div key={field} className={className}>
                          <label className="block text-sm font-semibold text-stone-700 mb-1">{label}</label>
                          <input
                            type={type}
                            value={address[field]}
                            onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                            className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep('payment')}
                      className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-105"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Payment Method</h2>
                    <div className="space-y-3 mb-6">
                      {PAYMENT_METHODS.map(method => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-amber-500 bg-amber-50' : 'border-stone-100 hover:border-amber-200'}`}
                        >
                          <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="hidden" />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-amber-500' : 'border-stone-300'}`}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                          </div>
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-bold text-stone-800">{method.label}</div>
                            <div className="text-xs text-stone-500">{method.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-stone-700 mb-1">UPI ID</label>
                        <input
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                        <p className="text-amber-700 text-sm">Cash on Delivery is available for orders up to ₹50,000. A nominal COD handling charge of ₹49 applies.</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      Your payment is secured by 256-bit SSL encryption via Razorpay
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep('address')} className="flex-1 border-2 border-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-50 transition-colors">
                        ← Back
                      </button>
                      <button onClick={() => setStep('review')} className="flex-2 flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105">
                        Review Order →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REVIEW */}
              {step === 'review' && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Review Your Order</h2>

                    <div className="space-y-3 mb-5">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-stone-800 text-sm leading-tight line-clamp-1">{item.name}</div>
                            <div className="text-xs text-stone-400">Qty: {item.quantity}</div>
                          </div>
                          <div className="font-bold text-stone-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-4 mb-4 space-y-2">
                      <div className="text-sm text-stone-600 flex justify-between">
                        <span>Delivery to:</span>
                        <span className="font-medium">{address.firstName} {address.lastName}, {address.city}, {address.pincode}</span>
                      </div>
                      <div className="text-sm text-stone-600 flex justify-between">
                        <span>Payment:</span>
                        <span className="font-medium">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-105 disabled:opacity-60"
                    >
                      {processing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><CheckCircle className="w-5 h-5" /> Place Order — ₹{total.toLocaleString('en-IN')}</>
                      )}
                    </button>

                    <button onClick={() => setStep('payment')} className="w-full mt-2 text-stone-500 hover:text-stone-700 text-sm py-2 transition-colors">
                      ← Back to Payment
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm h-fit">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-stone-600 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate max-w-[70%]">{item.name} × {item.quantity}</span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-800 text-base border-t border-stone-100 pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {[<Shield key="s" className="w-3.5 h-3.5" />, <Truck key="t" className="w-3.5 h-3.5" />, <Phone key="p" className="w-3.5 h-3.5" />].map((Icon, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-stone-400">
                  <span className="text-amber-500">{Icon}</span>
                  {['GII certificate included', 'Insured delivery', 'Support: +91 98765 43210'][i]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
