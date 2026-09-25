import React from 'react';
import { ToolDef } from '../types';
import { ToolCard } from './ToolCard';
import { AlertCircle } from 'lucide-react';

interface ToolGridProps {
  tools: ToolDef[];
  onSelectTool: (tool: ToolDef) => void;
  onResetFilter: () => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelectTool, onResetFilter }) => {
  return (
    <section id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Katalog Alat Dokumen
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Pilih alat yang Anda butuhkan untuk memproses dokumen secara instan
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono tabular-nums">
          Menampilkan <span className="text-rose-400 font-bold">{tools.length}</span> dari 20 alat
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">Tidak ada alat yang cocok</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
            Coba kata kunci pencarian lain atau tampilkan semua kategori alat.
          </p>
          <button
            onClick={onResetFilter}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            Tampilkan Semua Alat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool, idx) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={idx}
              onSelect={onSelectTool}
            />
          ))}
        </div>
      )}
    </section>
  );
};
