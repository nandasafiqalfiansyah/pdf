import React from 'react';
import { Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  currentBrand: string;
  onScrollToTools: () => void;
  onSelectToolById: (id: string) => void;
  onOpenBrandModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentBrand,
  onScrollToTools,
  onSelectToolById,
  onOpenBrandModal,
}) => {
  return (
    <footer className="border-t border-slate-800 bg-[#0a0d15] text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-base mb-3">
              <BrandLogo size={28} />
              <span>{currentBrand}</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Platform produktivitas dokumen PDF serba ada yang beroperasi 100% di browser pengguna tanpa login dan tanpa memungut biaya.
            </p>
            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privasi Terlindungi: Berkas Tidak Pernah Disimpan di Server</span>
            </div>
          </div>

          {/* Col 2: Popular Tools */}
          <div>
            <div className="text-slate-200 font-semibold mb-3">Alat Populer</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectToolById('merge-pdf')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('split-pdf')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('compress-pdf')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('pdf-to-word')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  PDF to Word
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Conversions & Brand Info */}
          <div>
            <div className="text-slate-200 font-semibold mb-3">Konversi Terfavorit</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectToolById('pdf-to-excel')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  PDF to Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('pdf-to-jpg')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  PDF to JPG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('jpg-to-pdf')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  JPG to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectToolById('html-to-pdf')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  HTML to PDF
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom hairline row */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} {currentBrand}. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenBrandModal}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Rekomendasi Nama Brand
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onScrollToTools}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              Katalog Lengkap
            </button>
            <span aria-hidden="true">·</span>
            <span>Bebas Akses Kapan Saja</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

