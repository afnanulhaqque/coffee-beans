import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { notification } = useCart();

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm font-body">
      <div
        className={`px-4 py-3 rounded-md shadow-2xl flex items-center gap-3 border ${
          isError
            ? 'bg-red-900 text-white border-red-700'
            : 'bg-[#351B38] text-[#F5F0E8] border-[#4B274F]'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
        )}
        <p className="text-sm font-semibold">{notification.msg}</p>
      </div>
    </div>
  );
}
