import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/settings');
        setSettings(res.data.settings || {});
      } catch (err) {
        console.error('Failed to load store settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setSaving(true);

    try {
      await api.put('/settings', settings);
      setMsg({ type: 'success', text: 'Store settings saved and updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-xs font-bold text-[#6B4A3A]">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2A1B17] font-body pb-16">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
          Storefront &amp; Logistics Settings
        </h1>
        <p className="text-xs text-[#6B4A3A] mt-1">
          Configure nationwide delivery fees, threshold promotions, contact info, and announcement banner
        </p>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-md text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Logistics & Delivery Rates */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-lg font-bold text-[#351B38] pb-2 border-b border-[#E8DED2]">
            Shipping &amp; Delivery Logistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                name="delivery_fee"
                value={settings.delivery_fee || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none font-bold text-[#351B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Free Delivery Minimum Cart Threshold (PKR)</label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={settings.free_shipping_threshold || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none font-bold text-[#351B38]"
              />
            </div>
          </div>
        </div>

        {/* Brand Contact & Support */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-lg font-bold text-[#351B38] pb-2 border-b border-[#E8DED2]">
            Customer Support &amp; Storefront Brand Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Support Phone / WhatsApp</label>
              <input
                type="text"
                name="support_phone"
                value={settings.support_phone || ''}
                onChange={handleChange}
                placeholder="0302 5455448"
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Support Email</label>
              <input
                type="email"
                name="support_email"
                value={settings.support_email || ''}
                onChange={handleChange}
                placeholder="info@coffeebean.pk"
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Order Notification Email</label>
              <input
                type="email"
                name="order_notification_email"
                value={settings.order_notification_email || ''}
                onChange={handleChange}
                placeholder="orders@coffeebean.pk"
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global Announcement Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-lg font-bold text-[#351B38] pb-2 border-b border-[#E8DED2]">
            Top Navbar Announcement Marquee
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#2A1B17] mb-1">Announcement Message Text</label>
            <input
              type="text"
              name="announcement_text"
              value={settings.announcement_text || ''}
              onChange={handleChange}
              placeholder="Freshly roasted specialty coffees &amp; whole leaf teas • Free nationwide delivery on orders over Rs. 3,500"
              className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
