import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Apakah dokumen saya aman dan tidak diintip pihak lain?',
      a: 'Sangat aman. Platform ini memproses file sepenuhnya di dalam browser Anda menggunakan teknologi WebAssembly dan JavaScript. Berkas tidak pernah diunggah atau disimpan di server mana pun, sehingga kerahasiaan dan privasi dokumen Anda 100% terjaga.',
    },
    {
      q: 'Apakah benar-benar gratis tanpa perlu login?',
      a: 'Ya, seluruh 20 alat lengkap dapat digunakan tanpa biaya, tanpa perlu mendaftar akun, dan tanpa batas langganan seumur hidup. Kami percaya alat utilitas dokumen dasar harus dapat diakses dengan mudah oleh semua orang.',
    },
    {
      q: 'Bagaimana cara menambahkan tanda tangan elektronik (Sign PDF)?',
      a: 'Anda dapat langsung menggambar tanda tangan basah di kanvas layar menggunakan kursor mouse, touchpad laptop, atau layar sentuh smartphone, atau mengunggah berkas gambar paraf transparan (PNG). Tanda tangan dapat ditempatkan di halaman dan sudut mana pun yang Anda tentukan.',
    },
    {
      q: 'Apakah ada watermark pada dokumen yang dihasilkan?',
      a: 'Tidak sama sekali. Semua dokumen hasil gabungan, pemisahan, maupun konversi bersih dari watermark, stempel, atau logo promosi.',
    },
    {
      q: 'Bagaimana cara kerja kompresi PDF?',
      a: 'Alat kompresi menghapus metadata berlebih, mengoptimalkan tabel objek internal, dan menyeimbangkan resolusi gambar tertanam agar ukuran file berkurang drastis tanpa merusak keterbacaan teks.',
    },
    {
      q: 'Apakah bisa digunakan di smartphone (Android / iPhone)?',
      a: 'Tentu saja. Antarmuka PDF Tools dirancang sepenuhnya responsif dan dapat dioperasikan langsung dari browser seluler Anda seperti Chrome, Safari, atau Firefox.',
    },
  ];

  return (
    <section id="faq-section" className="py-20 border-t border-slate-800/60 bg-[#0e121e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
            Pertanyaan Umum
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Tanya Jawab Seputar Layanan
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Informasi lengkap seputar privasi, kompatibilitas, dan keamanan penggunaan.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
