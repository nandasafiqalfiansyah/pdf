import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ToolDef } from '../types';
import { ToolIcon } from './ToolIcon';

interface ToolCardProps {
  tool: ToolDef;
  index: number;
  onSelect: (tool: ToolDef) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index, onSelect }) => {
  // Category human name
  const categoryLabels: Record<string, string> = {
    'edit-manage': 'Edit & Kelola PDF',
    organize: 'Organisasi Dokumen',
    'convert-from': 'Konversi dari PDF',
    'convert-to': 'Konversi ke PDF',
    optimize: 'Optimalisasi',
  };

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between p-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
    >
      <div>
        {/* Top header row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${tool.accentColor}18`,
              border: `1px solid ${tool.accentColor}35`,
            }}
          >
            <ToolIcon name={tool.icon} className="w-6 h-6" color={tool.accentColor} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Clean unboxed metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>{categoryLabels[tool.category] || 'Alat PDF'}</span>
          <span aria-hidden="true">·</span>
          <span>Gratis</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-2">
          {tool.shortDesc}
        </p>
      </div>

      {/* Card action affordance */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-rose-400 transition-colors">
        <span>Gunakan alat</span>
        <span className="font-semibold text-slate-300 group-hover:text-white">Buka →</span>
      </div>
    </div>
  );
};
