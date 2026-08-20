import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      setSuccessMsg(res.data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit inquiry. Please try again or reach us via phone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-16 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          CUSTOMER CARE &amp; ROASTERY INQUIRIES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight">
          Write To Us
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A3A] font-normal leading-relaxed max-w-2xl mx-auto">
          Have a question regarding our freshly roasted single-origin coffees, whole leaf teas, order delivery, or cafe experiences? We’d love to hear from you.
        </p>
      </div>

      {/* 2-Column Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Inquiry Form (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#E8DED2] rounded-md p-8 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-[#E8DED2] pb-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#4B274F] block">
              SEND A MESSAGE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#351B38]">
              How Can We Help You?
            </h2>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-md flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2A1B17]">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tariq Khan"
                  className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2A1B17]">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tariq@example.com"
                  className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2A1B17]">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300 1234567"
                  className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2A1B17]">Inquiry Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Online Order Delivery">Online Order Delivery</option>
                  <option value="Whole Bean Coffee Quality">Whole Bean Coffee Quality</option>
                  <option value="Store Experience / Feedback">Store Experience / Feedback</option>
                  <option value="Corporate / Bulk Orders">Corporate / Bulk Orders</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2A1B17]">Your Message *</label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we assist you with our coffees, teas, or store service?"
                className="w-full p-4 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#4B274F] hover:bg-[#351B38] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Direct Contact Details & Brand Info (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8DED2] rounded-md p-8 shadow-xs space-y-6">
            <h3 className="font-display text-2xl text-[#351B38]">
              Contact Details
            </h3>

            <div className="space-y-4 text-xs text-[#2A1B17]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#351B38]">Email Support</span>
                  <a href="mailto:info@coffeebean.pk" className="hover:text-[#4B274F] transition-colors">
                    info@coffeebean.pk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#351B38]">Phone / WhatsApp</span>
                  <a href="tel:03025455448" className="hover:text-[#4B274F] transition-colors font-mono">
                    0302 5455448
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-[#351B38]">Head Office &amp; Operations</span>
                  <p className="text-[#6B4A3A] leading-relaxed">
                    The Coffee Bean &amp; Tea Leaf Pakistan<br />
                    Operated by Ab Brands Pvt Ltd
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E8DED2]/40 border border-[#E8DED2] rounded-md p-8 shadow-xs space-y-3">
            <h4 className="font-display text-xl text-[#351B38]">
              Looking for a Cafe?
            </h4>
            <p className="text-xs text-[#6B4A3A] leading-relaxed">
              Find addresses, operating hours, and Google Maps directions for our lounges nationwide.
            </p>
            <div className="pt-2">
              <a
                href="/stores"
                className="inline-block px-5 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
              >
                Store Locator
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
