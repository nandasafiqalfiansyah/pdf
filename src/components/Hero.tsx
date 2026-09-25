import React from 'react';
import { Search, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/tools';
import { ToolCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onSelectPopularTool: (toolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectPopularTool,
}) => {
  return (
    <section className="relative pt-12 pb-14 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-[#101423] via-[#0c0f17] to-[#0c0f17]">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[260px] bg-indigo-600/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle unboxed metadata kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 tracking-wide uppercase mb-3">
          <span>Solusi Dokumen Lengkap</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>100% Gratis</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Privasi Terjaga di Peramban</span>
        </div>

        {/* Marquee Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
          Kelola, Gabung, & Konversi Dokumen PDF Tanpa Batas
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed" style={{ textWrap: 'balance' }}>
          Platform 20 alat PDF lengkap tanpa perlu login atau langganan. Semua proses berjalan secara aman dan instan langsung di komputer atau ponsel Anda.
        </p>

        {/* Quick search input */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg shadow-black/40 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari alat (misal: Edit, Sign, Watermark, Merge, Word, Rotate)..."
              className="w-full py-3.5 px-3 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="mr-3 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Quick shortcuts / popular picks */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Paling Sering Digunakan:</span>
          {[
            { id: 'edit-pdf', label: 'Edit PDF' },
            { id: 'sign-pdf', label: 'Sign PDF' },
            { id: 'watermark-pdf', label: 'Watermark' },
            { id: 'merge-pdf', label: 'Merge PDF' },
            { id: 'rotate-pdf', label: 'Rotate PDF' },
            { id: 'compress-pdf', label: 'Compress' },
            { id: 'pdf-to-word', label: 'PDF to Word' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectPopularTool(item.id)}
              className="hover:text-rose-400 hover:underline transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Segmented Control */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800 rounded-xl max-w-3xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as ToolCategory)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Trust markers */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/50 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Privasi Terjaga</div>
              <div className="text-xs text-slate-400">File diproses lokal di browser</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">100% Gratis</div>
              <div className="text-xs text-slate-400">Tanpa akun & tanpa watermark</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Proses Kilat</div>
              <div className="text-xs text-slate-400">Tanpa antrean server</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
