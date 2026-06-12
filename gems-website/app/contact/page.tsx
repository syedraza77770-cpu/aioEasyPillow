'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Gem } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 10 AM–7:30 PM' },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'info@indiannaturalgems.com', sub: 'Reply within 24 hours' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: 'M.G. Road, Bangalore – 560001', sub: 'Karnataka, India' },
    { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: 'Mon–Sat: 10 AM – 7:30 PM', sub: 'Sunday: Closed' },
  ]

  const services = [
    { icon: '🔮', title: 'Gemstone Consultation', desc: 'Free astrology-based gemstone recommendation with Tausif Raza. Bring your birth details.' },
    { icon: '📜', title: 'Certification Queries', desc: 'Questions about your stone\'s certificate or lab report? We help you verify and understand.' },
    { icon: '💍', title: 'Custom Setting', desc: 'Need your gemstone set in gold or silver? We work with trusted craftsmen in Bangalore.' },
    { icon: '🔄', title: 'Stone Evaluation', desc: 'Have a stone you want appraised or evaluated? Bring it in for a professional assessment.' },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Get in Touch</span>
            <h1 className="font-serif text-5xl font-bold mt-3 mb-4">Contact Us</h1>
            <p className="text-amber-100/80 text-lg max-w-xl mx-auto">
              Whether you have a question about a gemstone, need help choosing the right stone, or want to visit our Bangalore store — we're here to help.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info Cards */}
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{info.label}</div>
                  <div className="font-bold text-stone-800 mt-0.5">{info.value}</div>
                  <div className="text-stone-400 text-sm">{info.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/919876543210"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl font-bold transition-all hover:scale-105 hover:shadow-lg"
            >
              <MessageSquare className="w-6 h-6" />
              <div>
                <div>Chat on WhatsApp</div>
                <div className="text-emerald-100 text-sm font-normal">Instant response during business hours</div>
              </div>
            </motion.a>

            {/* Services */}
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-serif font-bold text-stone-800 mb-4 text-lg">Consultation Services</h3>
              <div className="space-y-4">
                {services.map(s => (
                  <div key={s.title} className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{s.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-stone-700">{s.title}</div>
                      <div className="text-xs text-stone-500 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-stone-800 mb-3">Message Sent!</h3>
                <p className="text-stone-600 mb-2">Thank you for reaching out. Tausif Raza or a member of our team will respond within 24 hours.</p>
                <p className="text-amber-600 text-sm font-semibold">For urgent queries, please call or WhatsApp directly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-amber-600 hover:text-amber-500 font-semibold">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2">Send Us a Message</h2>
                <p className="text-stone-500 mb-6 text-sm">Fill in the form below and we'll get back to you within 24 hours. For gemstone consultations, please include your date, time, and place of birth.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Your Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">Phone Number</label>
                      <input
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800 cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option>Gemstone Consultation</option>
                      <option>Order Enquiry</option>
                      <option>Certification Query</option>
                      <option>Custom Jewellery Setting</option>
                      <option>Stone Evaluation / Appraisal</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-800 resize-none"
                      placeholder="Please describe what you're looking for or your question. For gemstone consultations, include your date of birth, time of birth, and place of birth..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-5 h-5" /> Send Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 bg-gradient-to-br from-stone-100 to-amber-50 rounded-3xl h-64 flex items-center justify-center border border-stone-200 overflow-hidden">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <p className="font-bold text-stone-700 text-lg">Indian Natural Gems & Jewellery</p>
            <p className="text-stone-500">M.G. Road, Bangalore – 560001, Karnataka</p>
            <a href="https://maps.google.com" className="mt-3 inline-block text-amber-600 hover:text-amber-500 font-semibold text-sm underline">
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
