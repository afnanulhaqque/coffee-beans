import React, { useState } from 'react';
import { DownloadCloud, RefreshCw, CheckCircle2, AlertTriangle, AlertCircle, Clock, FileText, Check, Database, ExternalLink } from 'lucide-react';
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
    <div className="space-y-6 text-[#1C1714]">
      {/* Header */}
      <div className="border-b border-[#E5E5E0] pb-6">
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#24150F]">
          Product Catalog Importer
        </h1>
        <p className="text-xs text-[#756A62] mt-1">
          Automated extraction and sync engine connecting directly to live catalog from{' '}
          <a
            href="https://www.coffeebean.pk/shop/"
            target="_blank"
            rel="noreferrer"
            className="text-[#5A3825] underline font-bold inline-flex items-center gap-1"
          >
            coffeebean.pk/shop/ <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {/* Action Control Box */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E5E0] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E5E0]">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif-luxury text-lg font-bold text-[#24150F] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#B8895B]" /> Data Extraction &amp; Asset Sync
            </h2>
            <p className="text-xs text-[#5A3825] leading-relaxed">
              Crawls all 5 paginated shop catalog pages, extracts product names, descriptions, coffee roast subcategories, teas, prices, SKUs, and automatically downloads high-res images to the server's local media repository.
            </p>
            
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#24150F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceUpdate}
                  onChange={(e) => setForceUpdate(e.target.checked)}
                  className="w-4 h-4 accent-[#24150F]"
                />
                <span>Force overwrite manually modified products</span>
              </label>
              <span className="text-[10px] text-[#756A62] block ml-6">
                When unchecked, products with custom admin modifications are safely preserved.
              </span>
            </div>
          </div>

          <button
            onClick={handleStartImport}
            disabled={importing}
            className="px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shrink-0 self-start md:self-center"
          >
            {importing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#B8895B]" />
                Extracting &amp; Syncing...
              </>
            ) : (
              <>
                <DownloadCloud className="w-5 h-5 text-[#B8895B]" />
                Start Catalog Import
              </>
            )}
          </button>
        </div>

        {/* Informative Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F7F7F5] rounded-sm border border-[#E5E5E0]">
            <span className="font-bold text-[#24150F] block mb-1">Pagination Discovery</span>
            <p className="text-[#756A62] text-[11px]">Automatically crawls /shop/page/1 through page/5+ without hardcoded boundaries.</p>
          </div>
          <div className="p-4 bg-[#F7F7F5] rounded-sm border border-[#E5E5E0]">
            <span className="font-bold text-[#24150F] block mb-1">Local Asset Storage</span>
            <p className="text-[#756A62] text-[11px]">Downloads and stores real images in <code>/uploads/products/</code> with safe slugs.</p>
          </div>
          <div className="p-4 bg-[#F7F7F5] rounded-sm border border-[#E5E5E0]">
            <span className="font-bold text-[#24150F] block mb-1">Duplicate Prevention</span>
            <p className="text-[#756A62] text-[11px]">Checks source URLs &amp; slugs to update existing records rather than duplicating.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Summary & Logs */}
      {result && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-sm border border-[#E5E5E0] text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#756A62] block">Discovered</span>
              <span className="font-serif-luxury text-xl font-bold text-[#24150F]">
                {result.products_discovered}
              </span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-sm border border-emerald-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Imported</span>
              <span className="font-serif-luxury text-xl font-bold text-emerald-900">
                {result.products_imported}
              </span>
            </div>
            <div className="bg-blue-50 p-4 rounded-sm border border-blue-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Updated</span>
              <span className="font-serif-luxury text-xl font-bold text-blue-900">
                {result.products_updated}
              </span>
            </div>
            <div className="bg-amber-50 p-4 rounded-sm border border-amber-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Skipped</span>
              <span className="font-serif-luxury text-xl font-bold text-amber-900">
                {result.duplicates_skipped}
              </span>
            </div>
            <div className="bg-purple-50 p-4 rounded-sm border border-purple-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-purple-800 block">Images Saved</span>
              <span className="font-serif-luxury text-xl font-bold text-purple-900">
                {result.images_downloaded}
              </span>
            </div>
            <div className="bg-rose-50 p-4 rounded-sm border border-rose-200 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Errors</span>
              <span className="font-serif-luxury text-xl font-bold text-rose-900">
                {result.errors?.length || 0}
              </span>
            </div>
          </div>

          {/* Monospace Execution Log Terminal */}
          <div className="bg-[#24150F] text-[#F6F1E9] rounded-sm p-6 space-y-3 font-mono text-xs shadow-md border border-[#3E2723]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold flex items-center gap-2 text-white text-xs">
                <FileText className="w-4 h-4 text-[#B8895B]" /> Live Execution Transcript
              </span>
              <span className="text-[10px] text-[#EDE4D8]/60">
                Started: {new Date(result.started_at).toLocaleTimeString()} • Finished: {new Date(result.finished_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 pr-2 text-[11px] text-[#EDE4D8]/90">
              {result.log?.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-[#B8895B]">&gt;</span> {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
