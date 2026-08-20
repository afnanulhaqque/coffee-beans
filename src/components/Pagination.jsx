import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-10 font-body">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-md border border-[#E8DED2] bg-white text-[#2A1B17] hover:bg-[#F5F0E8] hover:border-[#4B274F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-md text-xs font-bold transition-all ${
            p === currentPage
              ? 'bg-[#4B274F] text-white shadow-xs'
              : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8] hover:text-[#4B274F]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-md border border-[#E8DED2] bg-white text-[#2A1B17] hover:bg-[#F5F0E8] hover:border-[#4B274F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
