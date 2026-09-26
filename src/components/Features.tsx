import React from 'react';
import { ShieldCheck, UserX, Cpu, FileCheck2 } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Privasi Terjamin 100%',
      desc: 'Seluruh pemrosesan berkas dikerjakan langsung di dalam browser Anda. Dokumen sensitif tidak pernah diunggah atau disimpan di server luar.',
      color: '#10b981',
    },
    {
      icon: UserX,
      title: 'Bebas Tanpa Perlu Login',
      desc: 'Langsung gunakan seluruh 20 alat lengkap tanpa registrasi, tanpa email, dan tanpa batasan langganan berbayar.',
      color: '#f43f5e',
    },
    {
      icon: Cpu,
      title: 'Pemrosesan Cepat & Ringan',
      desc: 'Memanfaatkan performa mesin peramban modern untuk kompresi dan konversi instan tanpa antrean server.',
      color: '#3b82f6',
    },
    {
      icon: FileCheck2,
      title: 'Format Dokumen Standar',
      desc: 'Mendukung format resmi Microsoft Word (.docx), Excel (.xlsx), PowerPoint (.pptx), gambar resolusi tinggi, dan HTML.',
      color: '#f59e0b',
    },
  ];

  return (
    <section id="features-section" className="py-20 border-t border-slate-800/60 bg-[#0e121e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
            Mengapa Memilih Kami
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl" style={{ textWrap: 'balance' }}>
            Solusi Dokumen Modern yang Aman & Nyaman Digunakan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Didesain khusus untuk para profesional, mahasiswa, dan siapa saja yang membutuhkan pengelolaan dokumen tanpa repot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                    color: f.color,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
