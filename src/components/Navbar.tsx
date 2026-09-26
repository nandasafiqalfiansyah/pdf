import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Shield,
  Search,
  ArrowUpRight,
  Layers,
  FileCheck,
  CheckCircle2,
  SlidersHorizontal,
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

// Badges and metadata for each tool
const TOOL_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  'edit-pdf': { label: 'Teks & Catatan', bg: 'bg-pink-500/15', text: 'text-pink-300' },
  'sign-pdf': { label: 'TTD Digital', bg: 'bg-indigo-500/15', text: 'text-indigo-300' },
  'watermark-pdf': { label: 'Cap Air', bg: 'bg-teal-500/15', text: 'text-teal-300' },
  'crop-pdf': { label: 'Margin Presisi', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  'merge-pdf': { label: 'Paling Dicari', bg: 'bg-blue-500/15', text: 'text-blue-300' },
  'split-pdf': { label: 'Pisah Berkas', bg: 'bg-purple-500/15', text: 'text-purple-300' },
  'rotate-pdf': { label: 'Rotasi 360°', bg: 'bg-amber-500/15', text: 'text-amber-300' },
  'organize-pdf': { label: 'Visual Urutan', bg: 'bg-purple-500/15', text: 'text-purple-300' },
  'remove-pages': { label: 'Hapus Halaman', bg: 'bg-rose-500/15', text: 'text-rose-300' },
  'extract-pages': { label: 'Ekstrak Berkas', bg: 'bg-sky-500/15', text: 'text-sky-300' },
  'pdf-to-word': { label: 'Ke DOCX', bg: 'bg-blue-500/15', text: 'text-blue-300' },
  'pdf-to-excel': { label: 'Ke XLSX', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  'pdf-to-powerpoint': { label: 'Ke PPTX', bg: 'bg-orange-500/15', text: 'text-orange-300' },
  'pdf-to-jpg': { label: 'Ekstrak Gambar', bg: 'bg-amber-500/15', text: 'text-amber-300' },
  'compress-pdf': { label: 'Kecilkan MB', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  'jpg-to-pdf': { label: 'Foto ke PDF', bg: 'bg-rose-500/15', text: 'text-rose-300' },
  'word-to-pdf': { label: 'DOCX ke PDF', bg: 'bg-sky-500/15', text: 'text-sky-300' },
  'powerpoint-to-pdf': { label: 'PPTX ke PDF', bg: 'bg-orange-500/15', text: 'text-orange-300' },
  'excel-to-pdf': { label: 'XLSX ke PDF', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  'html-to-pdf': { label: 'Web ke PDF', bg: 'bg-cyan-500/15', text: 'text-cyan-300' },
};

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
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [dropdownFilter, setDropdownFilter] = useState<'all' | 'edit' | 'organize' | 'from-pdf' | 'to-pdf'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileActiveCategory, setMobileActiveCategory] = useState<'all' | 'edit' | 'organize' | 'from-pdf' | 'to-pdf'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<any>(null);

  // Group definitions
  const editAndSignTools = useMemo(
    () => PDF_TOOLS.filter((t) => ['edit-pdf', 'sign-pdf', 'watermark-pdf', 'crop-pdf'].includes(t.id)),
    []
  );

  const organizeTools = useMemo(
    () => PDF_TOOLS.filter((t) => ['merge-pdf', 'split-pdf', 'rotate-pdf', 'organize-pdf', 'remove-pages', 'extract-pages'].includes(t.id)),
    []
  );

  const convertFromPdfTools = useMemo(
    () => PDF_TOOLS.filter((t) => ['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg', 'compress-pdf'].includes(t.id)),
    []
  );

  const convertToPdfTools = useMemo(
    () => PDF_TOOLS.filter((t) => ['jpg-to-pdf', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(t.id)),
    []
  );

  // Filtered tools for the dropdown search
  const filteredDropdownTools = useMemo(() => {
    const q = dropdownSearch.toLowerCase().trim();
    return PDF_TOOLS.filter((t) => {
      const matchText = !q || t.title.toLowerCase().includes(q) || t.shortDesc.toLowerCase().includes(q) || t.id.includes(q);
      if (!matchText) return false;

      if (dropdownFilter === 'all') return true;
      if (dropdownFilter === 'edit') return ['edit-pdf', 'sign-pdf', 'watermark-pdf', 'crop-pdf'].includes(t.id);
      if (dropdownFilter === 'organize') return ['merge-pdf', 'split-pdf', 'rotate-pdf', 'organize-pdf', 'remove-pages', 'extract-pages'].includes(t.id);
      if (dropdownFilter === 'from-pdf') return ['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg', 'compress-pdf'].includes(t.id);
      if (dropdownFilter === 'to-pdf') return ['jpg-to-pdf', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(t.id);
      return true;
    });
  }, [dropdownSearch, dropdownFilter]);

  // Close dropdown on click outside
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
    }, 250);
  };

  const handleToolClick = (toolId: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onSelectToolById(toolId);
  };

  // Filter for mobile
  const filteredMobileTools = useMemo(() => {
    const q = mobileSearch.toLowerCase().trim();
    return PDF_TOOLS.filter((t) => {
      const matchText = !q || t.title.toLowerCase().includes(q) || t.shortDesc.toLowerCase().includes(q);
      if (!matchText) return false;

      if (mobileActiveCategory === 'all') return true;
      if (mobileActiveCategory === 'edit') return ['edit-pdf', 'sign-pdf', 'watermark-pdf', 'crop-pdf'].includes(t.id);
      if (mobileActiveCategory === 'organize') return ['merge-pdf', 'split-pdf', 'rotate-pdf', 'organize-pdf', 'remove-pages', 'extract-pages'].includes(t.id);
      if (mobileActiveCategory === 'from-pdf') return ['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg', 'compress-pdf'].includes(t.id);
      if (mobileActiveCategory === 'to-pdf') return ['jpg-to-pdf', 'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(t.id);
      return true;
    });
  }, [mobileSearch, mobileActiveCategory]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0c0f17]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark with Brand Logo */}
        <div className="flex items-center min-w-0 shrink">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onScrollToTools();
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 group hover:text-rose-400 transition-colors min-w-0"
            title={`${currentBrand} - Platform PDF Tools`}
          >
            <BrandLogo size={30} className="shrink-0" />
            <span className="font-extrabold tracking-tight truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none text-white group-hover:text-rose-300 transition-colors">
              {currentBrand}
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links with Mega-Dropdown */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-slate-300">
          {/* Complete Feature Mega Dropdown Trigger */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isDropdownOpen
                  ? 'text-white bg-slate-800/90 shadow-inner'
                  : 'hover:text-white hover:bg-slate-850/60'
              }`}
            >
              <span className="font-semibold">Fitur PDF Lengkap</span>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
                className="fixed left-1/2 -translate-x-1/2 top-16 pt-3 w-[min(96vw,1040px)] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-[#0f1423]/98 border border-slate-750 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/95 backdrop-blur-2xl max-h-[82vh] overflow-y-auto">
                  {/* Top Bar inside Dropdown: Header, Search, & Category Pills */}
                  <div className="pb-4 mb-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          Katalog 20 Alat Dokumen PDF
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Semua fitur bebas digunakan tanpa akun & gratis selamanya
                        </div>
                      </div>
                    </div>

                    {/* Quick Search inside Dropdown */}
                    <div className="relative min-w-[240px] max-w-sm">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={dropdownSearch}
                        onChange={(e) => setDropdownSearch(e.target.value)}
                        placeholder="Cari alat (misal: word, tanda tangan)..."
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      {dropdownSearch && (
                        <button
                          onClick={() => setDropdownSearch('')}
                          className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-2 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                      Filter:
                    </span>
                    {[
                      { id: 'all', label: `Semua (${PDF_TOOLS.length})` },
                      { id: 'edit', label: `✏️ Edit & TTD (${editAndSignTools.length})` },
                      { id: 'organize', label: `📑 Organisasi (${organizeTools.length})` },
                      { id: 'from-pdf', label: `📤 Dari PDF (${convertFromPdfTools.length})` },
                      { id: 'to-pdf', label: `📥 Ke PDF (${convertToPdfTools.length})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setDropdownFilter(f.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          dropdownFilter === f.id
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Multi-Column Feature Catalog */}
                  {filteredDropdownTools.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 my-2">
                      <p className="text-xs text-slate-400">Tidak ada alat yang sesuai dengan kata kunci "{dropdownSearch}".</p>
                      <button
                        onClick={() => {
                          setDropdownSearch('');
                          setDropdownFilter('all');
                        }}
                        className="mt-2 text-xs text-rose-400 hover:underline"
                      >
                        Tampilkan Semua 20 Alat
                      </button>
                    </div>
                  ) : dropdownSearch ? (
                    // Flat search results grid
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                      {filteredDropdownTools.map((t) => {
                        const badge = TOOL_BADGES[t.id];
                        return (
                          <button
                            key={t.id}
                            onClick={() => handleToolClick(t.id)}
                            className="w-full text-left p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group flex items-start gap-2.5 cursor-pointer shadow-sm"
                          >
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                              style={{ backgroundColor: `${t.accentColor}20` }}
                            >
                              <ToolIcon name={t.icon} className="w-4 h-4" color={t.accentColor} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                                  {t.title}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                                {t.shortDesc}
                              </div>
                              {badge && (
                                <span className={`inline-block mt-1 text-[9px] font-medium px-1.5 py-0.2 rounded ${badge.bg} ${badge.text}`}>
                                  {badge.label}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Default Categorized 4-Column Layout
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Col 1: Edit & Tanda Tangan */}
                      {(dropdownFilter === 'all' || dropdownFilter === 'edit') && (
                        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                              <span>Edit & Anotasi</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">4 Alat</span>
                          </div>
                          <div className="space-y-1">
                            {editAndSignTools.map((t) => {
                              const badge = TOOL_BADGES[t.id];
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleToolClick(t.id)}
                                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors group flex items-start gap-2.5 cursor-pointer"
                                >
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ backgroundColor: `${t.accentColor}20` }}
                                  >
                                    <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                        {t.title}
                                      </span>
                                      {badge && (
                                        <span className={`text-[9px] px-1 rounded ${badge.bg} ${badge.text} shrink-0`}>
                                          {badge.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                      {t.shortDesc}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Col 2: Organisasi & Tata Letak */}
                      {(dropdownFilter === 'all' || dropdownFilter === 'organize') && (
                        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                              <span>Tata Letak Halaman</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">6 Alat</span>
                          </div>
                          <div className="space-y-1">
                            {organizeTools.map((t) => {
                              const badge = TOOL_BADGES[t.id];
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleToolClick(t.id)}
                                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors group flex items-start gap-2.5 cursor-pointer"
                                >
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ backgroundColor: `${t.accentColor}20` }}
                                  >
                                    <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                        {t.title}
                                      </span>
                                      {badge && (
                                        <span className={`text-[9px] px-1 rounded ${badge.bg} ${badge.text} shrink-0`}>
                                          {badge.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                      {t.shortDesc}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Col 3: Konversi Dari PDF */}
                      {(dropdownFilter === 'all' || dropdownFilter === 'from-pdf') && (
                        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              <span>Konversi Dari PDF</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">5 Alat</span>
                          </div>
                          <div className="space-y-1">
                            {convertFromPdfTools.map((t) => {
                              const badge = TOOL_BADGES[t.id];
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleToolClick(t.id)}
                                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors group flex items-start gap-2.5 cursor-pointer"
                                >
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ backgroundColor: `${t.accentColor}20` }}
                                  >
                                    <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                        {t.title}
                                      </span>
                                      {badge && (
                                        <span className={`text-[9px] px-1 rounded ${badge.bg} ${badge.text} shrink-0`}>
                                          {badge.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                      {t.shortDesc}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Col 4: Konversi Ke PDF */}
                      {(dropdownFilter === 'all' || dropdownFilter === 'to-pdf') && (
                        <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>Konversi Ke PDF</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">5 Alat</span>
                          </div>
                          <div className="space-y-1">
                            {convertToPdfTools.map((t) => {
                              const badge = TOOL_BADGES[t.id];
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleToolClick(t.id)}
                                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors group flex items-start gap-2.5 cursor-pointer"
                                >
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ backgroundColor: `${t.accentColor}20` }}
                                  >
                                    <ToolIcon name={t.icon} className="w-3.5 h-3.5" color={t.accentColor} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                                        {t.title}
                                      </span>
                                      {badge && (
                                        <span className={`text-[9px] px-1 rounded ${badge.bg} ${badge.text} shrink-0`}>
                                          {badge.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                      {t.shortDesc}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dropdown Footer Guarantee */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Privasi Terlindungi: Semua file diproses langsung di peramban tanpa pernah diunggah ke server</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onScrollToTools();
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Lihat Katalog Lengkap di Halaman</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onScrollToFeatures}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Keunggulan
          </button>
          <button
            onClick={onScrollToHowItWorks}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Cara Kerja
          </button>
          <button
            onClick={onScrollToFaq}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Tanya Jawab
          </button>
        </nav>

        {/* Zone 3: Actions + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenBrandModal}
            className="px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Lihat Rekomendasi Nama & Logo Resmi"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="hidden sm:inline">Rekomendasi Nama</span>
            <span className="sm:hidden text-[11px]">Brand</span>
          </button>

          <button
            onClick={onScrollToTools}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-950/40 flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <span>Mulai Gratis</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Backdrop Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/75 backdrop-blur-sm z-30 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0c0f17] border-b border-slate-800 max-h-[88vh] overflow-y-auto p-4 z-40 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Quick Search inside Mobile Menu */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Cari dari 20 alat (misal: sign, merge)..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-750 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 placeholder-slate-400"
              />
              {mobileSearch && (
                <button
                  onClick={() => setMobileSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills on Mobile */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'edit', label: 'Edit & TTD' },
                { id: 'organize', label: 'Organisasi' },
                { id: 'from-pdf', label: 'Dari PDF' },
                { id: 'to-pdf', label: 'Ke PDF' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setMobileActiveCategory(c.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    mobileActiveCategory === c.id
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Quick Tools Grid in Mobile */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Pilih Alat PDF ({filteredMobileTools.length})</span>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onScrollToTools();
                  }}
                  className="text-rose-400 hover:underline text-xs"
                >
                  Lihat di Halaman
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredMobileTools.map((t) => {
                  const badge = TOOL_BADGES[t.id];
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleToolClick(t.id)}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left flex items-center gap-2.5 hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${t.accentColor}20` }}
                      >
                        <ToolIcon name={t.icon} className="w-4 h-4" color={t.accentColor} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-slate-200 truncate">{t.title}</span>
                          {badge && (
                            <span className={`text-[9px] px-1 rounded ${badge.bg} ${badge.text} shrink-0`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{t.shortDesc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Section Links */}
            <div className="pt-3 border-t border-slate-800 space-y-1 text-xs font-semibold text-slate-300">
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
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBrandModal();
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-rose-400 font-semibold transition-colors flex items-center justify-between"
              >
                <span>Rekomendasi Nama & Logo Brand</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
