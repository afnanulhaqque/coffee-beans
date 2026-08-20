import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Admin authentication failed', err);
      setError(err.response?.data?.error || err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#351B38] flex items-center justify-center p-4 sm:p-6 font-body text-[#F5F0E8]">
      <div className="w-full max-w-md bg-[#2A1B17] border border-[#4B274F] rounded-md p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img
            src={logoImg}
            alt="The Coffee Bean"
            className="w-14 h-14 object-contain mx-auto bg-white rounded-full p-1"
          />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-white tracking-tight">
              Admin Portal
            </h1>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E8DED2] font-semibold">
              The Coffee Bean &amp; Tea Leaf
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-md flex items-start gap-2.5 font-normal">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#E8DED2] mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#E8DED2] absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@coffeebean.pk"
                className="w-full bg-[#351B38] border border-[#4B274F] rounded-md pl-10 pr-3.5 py-3 text-xs text-white placeholder:text-[#E8DED2]/50 focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E8DED2] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#E8DED2] absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#351B38] border border-[#4B274F] rounded-md pl-10 pr-3.5 py-3 text-xs text-white placeholder:text-[#E8DED2]/50 focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-md transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Secure Admin Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-[11px] text-[#E8DED2]/70 text-center pt-2 border-t border-white/10 font-normal">
          Authorized personnel only. Sessions are encrypted and monitored.
        </div>

      </div>
    </div>
  );
}
