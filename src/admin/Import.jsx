import React, { useState } from 'react';
import { DownloadCloud, RefreshCw, Database, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function Import() {
  const [importing, setImporting] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleStartImport = async () => {
    setImporting(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/admin/import', { force_update: forceUpdate });
      setResult(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Import failed to complete.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      {/* Header */}
      <div className="border-b border-[#E8DED2] pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
          Product Catalog Importer
        </h1>
        <p className="text-xs text-[#6B4A3A] mt-1">
          Automated extraction and sync engine connecting directly to live catalog from{' '}
          <a
            href="https://www.coffeebean.pk/shop/"
            target="_blank"
            rel="noreferrer"
            className="text-[#4B274F] underline font-bold inline-flex items-center gap-1"
          >
            coffeebean.pk/shop/ <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Action Control Box */}
      <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8DED2]">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-display text-lg font-bold text-[#351B38] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4B274F]" /> Data Extraction &amp; Asset Sync
            </h2>
            <p className="text-xs text-[#6B4A3A] leading-relaxed">
              Crawls all 5 paginated shop catalog pages, extracts product names, descriptions, coffee roast subcategories, teas, prices, SKUs, and automatically downloads high-res images to the server's local media repository.
            </p>
            
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceUpdate}
                  onChange={(e) => setForceUpdate(e.target.checked)}
                  className="w-4 h-4 accent-[#4B274F]"
                />
                <span>Force overwrite manually modified products</span>
              </label>
              <span className="text-[10px] text-[#6B4A3A] block ml-6">
                When unchecked, products with custom admin modifications are safely preserved.
              </span>
            </div>
          </div>

          <button
            onClick={handleStartImport}
            disabled={importing}
            className="px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shrink-0 self-start md:self-center"
          >
            {importing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Extracting &amp; Syncing...
              </>
            ) : (
              <>
                <DownloadCloud className="w-5 h-5 text-white" />
                Start Catalog Import
              </>
            )}
          </button>
        </div>

        {/* Informative Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F5F0E8] rounded-md border border-[#E8DED2]">
            <span className="font-bold text-[#351B38] block mb-1">Pagination Discovery</span>
            <p className="text-[#6B4A3A] text-[11px]">Automatically crawls /shop/page/1 through page/5+ without hardcoded boundaries.</p>
          </div>
          <div className="p-4 bg-[#F5F0E8] rounded-md border border-[#E8DED2]">
            <span className="font-bold text-[#351B38] block mb-1">Local Asset Storage</span>
            <p className="text-[#6B4A3A] text-[11px]">Downloads and stores real images in <code>/uploads/products/</code> with safe slugs.</p>
          </div>
          <div className="p-4 bg-[#F5F0E8] rounded-md border border-[#E8DED2]">
            <span className="font-bold text-[#351B38] block mb-1">DB Schema Compliance</span>
            <p className="text-[#6B4A3A] text-[11px]">Categorizes automatically into Dark Roasts, Medium Roasts, Light Roasts, Teas, and Merch.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-xs">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 space-y-2 text-xs">
            <h4 className="font-bold text-sm">Sync Complete!</h4>
            <p>Discovered {result.discovered} items • Created {result.created} new products • Updated {result.updated} existing items • Downloaded {result.images_downloaded} product images.</p>
          </div>
        )}
      </div>
    </div>
  );
}
