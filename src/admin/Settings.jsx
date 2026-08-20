import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto py-20 text-center text-xs font-bold text-gray-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3E2723]">
          Storefront &amp; Logistics Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure nationwide delivery fees, threshold promotions, contact info, and announcement banner
        </p>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBC8] shadow-xs space-y-4">
          <h2 className="font-serif-luxury text-base font-bold text-[#3E2723] pb-2 border-b border-gray-100">
            Shipping &amp; Delivery Logistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                name="delivery_fee"
                value={settings.delivery_fee || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-bold text-[#3E2723]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Default fee charged on orders below threshold.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                name="free_delivery_threshold"
                value={settings.free_delivery_threshold || ''}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-bold text-[#3E2723]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Orders equal to or exceeding this qualify for FREE delivery.</span>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBC8] shadow-xs space-y-4">
          <h2 className="font-serif-luxury text-base font-bold text-[#3E2723] pb-2 border-b border-gray-100">
            Top Announcement Bar
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Announcement Message</label>
            <input
              type="text"
              name="announcement_bar"
              value={settings.announcement_bar || ''}
              onChange={handleChange}
              placeholder="e.g. Free Express Delivery across Pakistan on all orders above Rs. 3,500! ☕"
              className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-semibold text-[#3E2723]"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBC8] shadow-xs space-y-4">
          <h2 className="font-serif-luxury text-base font-bold text-[#3E2723] pb-2 border-b border-gray-100">
            Store Contact &amp; Brand Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                name="store_name"
                value={settings.store_name || ''}
                onChange={handleChange}
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email || ''}
                onChange={handleChange}
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Helpline Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone || ''}
                onChange={handleChange}
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Support</label>
              <input
                type="text"
                name="support_whatsapp"
                value={settings.support_whatsapp || ''}
                onChange={handleChange}
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Store HQ Address</label>
            <input
              type="text"
              name="store_address"
              value={settings.store_address || ''}
              onChange={handleChange}
              className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
