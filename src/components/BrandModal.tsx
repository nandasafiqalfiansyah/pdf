import React from 'react';
import { X, Check, Download, Sparkles, Copy, Layers } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export interface BrandOption {
  name: string;
  tagline: string;
  category: 'Global SaaS' | 'Indonesia Catchy' | 'Minimalist' | 'Power Suite';
  rationale: string;
  domains: string;
}

export const BRAND_RECOMMENDATIONS: BrandOption[] = [
  {
    name: 'DocuMorph',
    tagline: 'Transformasi & Kelola Dokumen Seketika',
    category: 'Global SaaS',
    rationale: 'Kombinasi "Document" dan "Morph". Menggambarkan kemampuan aplikasi untuk mengubah, membelah, menggabungkan, dan mentransformasi format dokumen dengan mudah dan fleksibel.',
    domains: 'documorph.com / documorph.app',
  },
  {
    name: 'Kertasin',
    tagline: 'Urus Semua Berkas Digital Tanpa Ribet',
    category: 'Indonesia Catchy',
    rationale: 'Sangat ramah di telinga pengguna Indonesia, mudah diingat, dan berkesan santai namun fungsional seperti istilah "Beresin" atau "Kelar-in".',
    domains: 'kertasin.id / kertasin.com',
  },
  {
    name: 'OmniPDF',
    tagline: 'Satu Platform untuk Semua Kebutuhan PDF',
    category: 'Power Suite',
    rationale: 'Awalan "Omni" mencerminkan kelengkapan utilitas serba bisa (12 alat dalam 1 tempat) dengan kredibilitas tinggi untuk profesional maupun pelajar.',
    domains: 'omnipdf.io / omnipdf.app',
  },
  {
    name: 'PDForge',
    tagline: 'Tempat Menempa & Merapikan Dokumen Digital',
    category: 'Minimalist',
    rationale: 'Berasal dari kata "Forge" (menempa). Menunjukkan keandalan kompilasi file yang kokoh, cepat, dan presisi.',
    domains: 'pdforge.dev / pdforge.co',
  },
  {
    name: 'SimpelPDF',
    tagline: 'Alat PDF Gratis & Bersih Tanpa Login',
    category: 'Indonesia Catchy',
    rationale: 'Menekankan proposisi nilai terkuat aplikasi: gratis, antarmuka bersih tanpa gangguan iklan popup, dan langsung pakai tanpa harus registrasi.',
    domains: 'simpelpdf.com / simpelpdf.id',
  },
  {
    name: 'PapyrX',
    tagline: 'Next-Gen In-Browser Document Engine',
    category: 'Global SaaS',
    rationale: 'Terinspirasi dari "Papyrus" (lembaran tulisan pertama dalam sejarah peradaban) dipadukan dengan aksen modern "X", berkesan futuristik dan canggih.',
    domains: 'papyrx.com / papyrx.app',
  },
  {
    name: 'SatuPDF',
    tagline: 'Satu Tempat untuk Semua Format Berkas',
    category: 'Indonesia Catchy',
    rationale: 'Mudah diucapkan, bersahabat, dan menegaskan integrasi 12 alat menjadi satu kesatuan solusi.',
    domains: 'satupdf.id / satupdf.com',
  },
];

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: string;
  onSelectBrand: (brandName: string) => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  currentBrand,
  onSelectBrand,
}) => {
  if (!isOpen) return null;

  const downloadSvgLogo = () => {
    const svgCode = `<svg width="512" height="512" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gMain" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="gFold" x1="28" y1="8" x2="40" y2="20" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="100%" stop-color="#fda4af" />
    </linearGradient>
    <linearGradient id="gBack" x1="12" y1="4" x2="44" y2="36" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.4" />
    </linearGradient>
  </defs>
  <path d="M14 6C14 4.89543 14.8954 4 16 4H34L44 14V34C44 35.1046 43.1046 36 42 36H16C14.8954 36 14 35.1046 14 34V6Z" fill="url(#gBack)" opacity="0.6"/>
  <path d="M8 12C8 9.79086 9.79086 8 12 8H28L40 20V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V12Z" fill="url(#gMain)"/>
  <path d="M28 8L40 20H32C29.7909 20 28 18.2091 28 16V8Z" fill="url(#gFold)" opacity="0.9"/>
  <rect x="14" y="24" width="12" height="2.5" rx="1.25" fill="#ffffff" fill-opacity="0.9"/>
  <rect x="14" y="29.5" width="18" height="2.5" rx="1.25" fill="#ffffff" fill-opacity="0.75"/>
  <rect x="14" y="35" width="15" height="2.5" rx="1.25" fill="#ffffff" fill-opacity="0.6"/>
  <circle cx="33" cy="35" r="2.5" fill="#ffffff"/>
</svg>`;

    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBrand.toLowerCase()}_logo.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identitas & Rekomendasi Nama Brand</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Logo & Rekomendasi Nama</h2>
            <p className="text-xs text-slate-400 mt-1">
              Pilih nama brand favorit Anda untuk langsung melihat penerapannya di seluruh antarmuka aplikasi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Official Logo Presentation */}
        <div className="mt-6 p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-4">
            DESAIN LOGO RESMI (VECTOR SVG):
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e121e] border border-slate-700/80 shadow-xl flex items-center justify-center">
                <BrandLogo size={64} />
              </div>
              <div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{currentBrand}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Official Vector
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Filosofi desain: Lembaran dokumen bertingkat dengan lipatan sudut dinamis dan titik transformasi, melambangkan konversi instan, modern, dan presisi.
                </p>
              </div>
            </div>

            <button
              onClick={downloadSvgLogo}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>Unduh File SVG Logo</span>
            </button>
          </div>
        </div>

        {/* Section 2: Name Recommendations Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              7 Rekomendasi Nama Pilihan
            </h3>
            <span className="text-xs text-slate-400">Klik untuk langsung mencoba nama</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {BRAND_RECOMMENDATIONS.map((b) => {
              const isSelected = currentBrand === b.name;
              return (
                <div
                  key={b.name}
                  onClick={() => onSelectBrand(b.name)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/50'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{b.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                        {b.category}
                      </span>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 hover:text-white">Pilih</span>
                    )}
                  </div>

                  <div className="text-xs font-medium text-rose-400 mb-1.5">{b.tagline}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                    {b.rationale}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <span>Ide Domain:</span>
                    <span className="text-slate-300 font-semibold">{b.domains}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Nama aktif saat ini: <strong className="text-white">{currentBrand}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
