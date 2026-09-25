import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentBrand: string;
  onOpenBrandModal: () => void;
  onScrollToTools: () => void;
  onScrollToFeatures: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToFaq: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBrand,
  onOpenBrandModal,
  onScrollToTools,
  onScrollToFeatures,
  onScrollToHowItWorks,
  onScrollToFaq,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0c0f17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with Brand Logo */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 group hover:text-rose-400 transition-colors"
        >
          <BrandLogo size={32} />
          <span className="font-extrabold tracking-tight">{currentBrand}</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={onScrollToTools}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Semua Fitur
          </button>
          <button
            onClick={onScrollToFeatures}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Keunggulan
          </button>
          <button
            onClick={onScrollToHowItWorks}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Cara Kerja
          </button>
          <button
            onClick={onScrollToFaq}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Tanya Jawab
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBrandModal}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Lihat Rekomendasi Nama & Logo"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Rekomendasi Nama</span>
          </button>

          <button
            onClick={onScrollToTools}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-md shadow-rose-900/30 flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <span>Mulai Gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

