import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { notification } = useCart();

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div
        className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
          isError
            ? 'bg-[#B71C1C] text-white border-red-700'
            : 'bg-[#3E2723] text-[#F5EFE6] border-[#C59B27]'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#C59B27] shrink-0" />
        )}
        <p className="text-sm font-semibold">{notification.msg}</p>
      </div>
    </div>
  );
}
