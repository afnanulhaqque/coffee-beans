import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/customers');
        setCustomers(res.data.customers || []);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
          Customer Directory
        </h1>
        <p className="text-xs text-[#6B4A3A] mt-1">
          Registered customer accounts, lifetime order metrics, and contact info
        </p>
      </div>

      <div className="bg-white p-4 rounded-md border border-[#E8DED2] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-10 pr-4 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
          />
        </div>
      </div>

      <div className="bg-white rounded-md border border-[#E8DED2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-[#6B4A3A]">
            Loading customers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B4A3A]">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E8] text-[#351B38] font-bold uppercase text-[10px] border-b border-[#E8DED2]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spent</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED2]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4B274F] text-white flex items-center justify-center font-bold text-xs">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-[#2A1B17]">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[#2A1B17] font-semibold">{c.email}</div>
                      <div className="text-[#6B4A3A] text-[11px] font-mono">{c.phone || 'No phone recorded'}</div>
                    </td>
                    <td className="p-4 font-bold text-[#351B38]">
                      {c.total_orders || 0}
                    </td>
                    <td className="p-4 font-bold text-[#4B274F]">
                      Rs. {c.total_spent?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-[#6B4A3A]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        Active Account
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
