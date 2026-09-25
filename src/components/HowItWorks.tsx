import React from 'react';
import { Upload, SlidersHorizontal, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Upload,
      title: 'Pilih Dokumen Anda',
      desc: 'Tarik dan lepas atau pilih berkas dari komputer maupun ponsel Anda. Bisa mengunggah lebih dari satu berkas untuk penggabungan.',
    },
    {
      num: '02',
      icon: SlidersHorizontal,
      title: 'Atur & Proses Otomatis',
      desc: 'Sesuaikan urutan halaman, tentukan tingkat kompresi atau orientasi halaman. Mesin memproses dokumen secara instan di peramban.',
    },
    {
      num: '03',
      icon: DownloadCloud,
      title: 'Unduh Hasil Tanpa Batas',
      desc: 'Satu klik untuk mengunduh dokumen yang telah selesai. File langsung tersimpan di folder unduhan Anda tanpa watermark.',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-20 border-t border-slate-800/60 bg-[#0c0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
            Alur Kerja Sederhana
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Tiga Langkah Mudah
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tanpa perlu instalasi software berat ataupun proses registrasi yang membingungkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-2xl bg-slate-900/40 border border-slate-800/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-black text-rose-500/80">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
