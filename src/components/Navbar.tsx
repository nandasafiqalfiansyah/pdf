import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Shield,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PDF_TOOLS } from '../data/tools';
import { ToolDef } from '../types';
import { ToolIcon } from './ToolIcon';

interface NavbarProps {
  currentBrand: string;
  onOpenBrandModal: () => void;
  onScrollToTools: () => void;
  onScrollToFeatures: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToFaq: () => void;
  onSelectToolById: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBrand,
  onOpenBrandModal,
  onScrollToTools,
  onScrollToFeatures,
  onScrollToHowItWorks,
  onScrollToFaq,
  onSelectToolById,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<any>(null);

  // Group tools into 4 logical columns for the mega menu
  const editAndSignTools = PDF_TOOLS.filter((t) =>
    ['edit-pdf', 'sign-pdf', 'watermark-pdf', 'rotate-pdf', 'crop-pdf'].includes(t.id)
  );

  const organizeTools = PDF_TOOLS.filter((t) =>
    ['merge-pdf', 'split-pdf', 'organize-pdf', 'remove-pages', 'extract-pages'].includes(t.id)
  );

  const convertFromPdfTools = PDF_TOOLS.filter((t) =>
    ['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg', 'compress-pdf'].includes(t.id)
  );

  const convertToPdfTools = PDF_TOOLS.filter((t) =>
    ['jpg-to-pdf', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(t.id)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleToolClick = (toolId: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onSelectToolById(toolId);
  };

  // Filter for mobile search
  const filteredMobileTools = PDF_TOOLS.filter(
    (t) =>
      !mobileSearch ||
      t.title.toLowerCase().includes(mobileSearch.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(mobileSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0c0f17]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with Brand Logo */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5 group hover:text-rose-400 transition-colors"
        >
          <BrandLogo size={32} />
          <span className="font-extrabold tracking-tight">{currentBrand}</span>
        </a>

        {/* Zone 2: Navigation Links with Comprehensive Feature Mega-Dropdown */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {/* Feature Dropdown Trigger */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              className={`flex items-center gap-1.5 py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${
                isDropdownOpen ? 'text-white bg-slate-800/80' : 'hover:text-white'
              }`}
            >
              <span>Fitur PDF</span>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                20 Alat
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-rose-400' : ''
                }`}
              />
            </button>

            {/* Comprehensive Mega-Dropdown Panel */}
            {isDropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[880px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
                  {/* Top Bar inside Dropdown */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Katalog 20 Alat PDF Lengkap & Gratis</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onScrollToTools();
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Lihat Tampilan Grid Lengkap</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4 Multi-Column Tool Groups */}
                  <div className="grid grid-cols-4 gap-5">
                    {/* Col 1: Edit & Tanda Tangan */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                        <span>Edit & Tanda Tangan</span>
                      </div>
                      <div className="space-y-1">
                        {editAndSignTools.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleToolClick(t.id)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-800/70 transition-colors group flex items-start gap-2.5 cursor-pointer"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: `${t.accentColor}18` }}
                            >
                              <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate leading-tight">
                                {t.shortDesc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Col 2: Organisasi & Pisah */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>Organisasi Lembar</span>
                      </div>
                      <div className="space-y-1">
                        {organizeTools.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleToolClick(t.id)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-800/70 transition-colors group flex items-start gap-2.5 cursor-pointer"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: `${t.accentColor}18` }}
                            >
                              <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate leading-tight">
                                {t.shortDesc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Col 3: Konversi Dari PDF */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Konversi Dari PDF</span>
                      </div>
                      <div className="space-y-1">
                        {convertFromPdfTools.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleToolClick(t.id)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-800/70 transition-colors group flex items-start gap-2.5 cursor-pointer"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: `${t.accentColor}18` }}
                            >
                              <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate leading-tight">
                                {t.shortDesc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Col 4: Konversi Ke PDF */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Konversi Ke PDF</span>
                      </div>
                      <div className="space-y-1">
                        {convertToPdfTools.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleToolClick(t.id)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-800/70 transition-colors group flex items-start gap-2.5 cursor-pointer"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ backgroundColor: `${t.accentColor}18` }}
                            >
                              <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate leading-tight">
                                {t.shortDesc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Footer Guarantee */}
                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Privasi Terjamin: Berkas diproses 100% lokal di browser tanpa antrean server</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">100% Gratis · Tanpa Login</span>
                  </div>
                </div>
              </div>
            )}
          </div>

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

        {/* Zone 3: Actions + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenBrandModal}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Lihat Rekomendasi Nama & Logo"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Rekomendasi Nama</span>
          </button>

          <button
            onClick={onScrollToTools}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-md shadow-rose-900/30 flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <span>Mulai Gratis</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0c0f17] border-b border-slate-800 max-h-[85vh] overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Quick Search inside Mobile Menu */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Cari dari 20 alat PDF..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Quick Tools Grid in Mobile */}
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Pilih Alat ({filteredMobileTools.length})</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onScrollToTools();
                }}
                className="text-rose-400 hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredMobileTools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleToolClick(t.id)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-left flex items-center gap-2 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${t.accentColor}20` }}
                  >
                    <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate">{t.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-semibold text-slate-300">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToFeatures();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
            >
              Keunggulan Layanan
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToHowItWorks();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToFaq();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
            >
              Tanya Jawab (FAQ)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
