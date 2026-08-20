import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Coffee,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import logoImg from '../assets/logo.png';

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
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-16 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          CUSTOMER CARE &amp; ROASTERY INQUIRIES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#24150F] tracking-tight">
          Write To Us
        </h1>
        <p className="text-sm sm:text-base text-[#756A62] font-normal leading-relaxed max-w-2xl mx-auto">
          Have a question regarding our freshly roasted single-origin coffees, whole leaf teas, order delivery, or cafe experiences? We’d love to hear from you.
        </p>
      </div>

      {/* 2-Column Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Inquiry Form (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-[#EDE4D8] rounded-sm p-8 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-[#EDE4D8] pb-4">
            <span className="text-[10px] uppercase tracking-widest font-medium text-[#B8895B] block">
              SEND A MESSAGE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              How Can We Help You?
            </h2>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#24150F] mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Asad Malik"
                  className="w-full bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F] font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24150F] mb-1">Contact Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="asad@example.com"
                  className="w-full bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F] font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#24150F] mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F] font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24150F] mb-1">Inquiry Type</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="General Inquiry">General Customer Inquiry</option>
                  <option value="Order & Delivery Tracking">Order &amp; Delivery Tracking</option>
                  <option value="Wholesale & Office Roasts">Wholesale &amp; Corporate Beans</option>
                  <option value="Cafe Experience Feedback">Cafe Dining Feedback</option>
                  <option value="Franchise & Partnerships">Franchise &amp; Partnerships</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24150F] mb-1">Your Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="How can our roasters and customer care assist you today?"
                className="w-full bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F] font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Submitting Message...'
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#B8895B]" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Contact Channels & Quick Information (Span 5) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          
          {/* Main Info Card */}
          <div className="bg-white border border-[#EDE4D8] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display text-xl text-[#24150F] border-b border-[#EDE4D8] pb-3">
              Roastery &amp; Customer Support
            </h3>

            <div className="space-y-4 text-xs text-[#5A3825]">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-[#F6F1E9] border border-[#EDE4D8] flex items-center justify-center shrink-0 text-[#B8895B]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Helpline / Phone</span>
                  <a href="tel:03025455448" className="font-semibold text-sm text-[#24150F] hover:text-[#B8895B] transition-colors font-mono">
                    0302 5455448
                  </a>
                  <p className="text-[11px] text-[#756A62] font-normal">Mon – Sun: 8:00 AM – Midnight</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-[#F6F1E9] border border-[#EDE4D8] flex items-center justify-center shrink-0 text-[#B8895B]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Email Support</span>
                  <a href="mailto:info@coffeebean.pk" className="font-semibold text-sm text-[#24150F] hover:text-[#B8895B] transition-colors">
                    info@coffeebean.pk
                  </a>
                  <p className="text-[11px] text-[#756A62] font-normal">Responses typically within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-sm bg-[#F6F1E9] border border-[#EDE4D8] flex items-center justify-center shrink-0 text-[#B8895B]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Head Office &amp; Roastery</span>
                  <p className="font-semibold text-sm text-[#24150F]">Plot 4-C, 10th Commercial Lane</p>
                  <p className="text-[11px] text-[#756A62] font-normal">Zamzama DHA Phase 5, Karachi, Pakistan</p>
                </div>
              </div>
            </div>

            {/* Store Locator Link Tile */}
            <div className="p-4 bg-[#EDE4D8]/60 border border-[#EDE4D8] rounded-sm space-y-2">
              <span className="text-[10px] uppercase font-semibold text-[#B8895B] block">Looking for a Cafe?</span>
              <p className="text-xs text-[#5A3825] font-normal">Find opening hours and directions to any of our lounges nationwide.</p>
              <Link
                to="/stores"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#B8895B] pt-1"
              >
                Explore Locations <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Quick FAQ Spotlight */}
          <div className="p-6 bg-[#24150F] text-[#F6F1E9] rounded-sm space-y-3 shadow-md">
            <h4 className="font-display text-lg text-white">Delivery Questions?</h4>
            <p className="text-xs text-[#EDE4D8] leading-relaxed font-normal">
              We offer free express delivery across Pakistan on orders above <strong>Rs. 3,500</strong> with full Cash on Delivery support.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
