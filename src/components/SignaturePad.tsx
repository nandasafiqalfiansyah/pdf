import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Upload } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#0f172a'); // Black ink
  const [lineWidth, setLineWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI crisp canvas setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSignatureChange(canvas.toDataURL('image/png'));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSignatureChange(result);
        setHasDrawn(true);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-xs">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mode === 'draw' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gambar TTD
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mode === 'upload' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Unggah Gambar
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-2">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Tinta:</span>
              {[
                { label: 'Hitam', color: '#0f172a' },
                { label: 'Biru Tua', color: '#1e3a8a' },
                { label: 'Merah', color: '#b91c1c' },
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setPenColor(c.color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    penColor === c.color ? 'scale-110 border-white' : 'border-slate-700'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ketebalan:</span>
              {[2, 3, 5].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setLineWidth(w)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                    lineWidth === w ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {w}px
                </button>
              ))}

              <button
                type="button"
                onClick={clearCanvas}
                className="ml-2 px-2.5 py-1 text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                title="Hapus gambar tanda tangan"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative rounded-xl border border-slate-700 bg-white/95 overflow-hidden shadow-inner touch-none">
            <canvas
              ref={canvasRef}
              width={500}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                <span>Tulis atau gambar tanda tangan Anda di sini</span>
                <span className="text-[10px] text-slate-300 mt-1">(Mendukung mouse, touchpad, dan layar sentuh)</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <div className="text-xs text-slate-300 font-medium">Unggah file paraf / tanda tangan</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Format PNG transparan sangat disarankan</div>
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
          >
            Pilih Gambar
          </button>
        </div>
      )}
    </div>
  );
};
