'use client';
import { useRef, useState } from 'react';
import { importCsv } from '@/lib/api';
import { UploadCloud } from 'lucide-react';

interface Props {
  onImported: () => void;
}

export default function CsvUpload({ onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) { setStatus('Please upload a .csv file'); return; }
    setLoading(true); setStatus(null);
    try {
      const result = await importCsv(file);
      setStatus(`✓ Imported ${result.total_imported} transactions (${result.categorized} categorized)`);
      onImported();
    } catch {
      setStatus('Import failed — check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition cursor-pointer
          ${dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <UploadCloud className={`w-8 h-8 ${loading ? 'animate-bounce text-cyan-400' : 'text-slate-400'}`} />
        <p className="text-sm text-slate-300 font-medium">
          {loading ? 'Importing…' : 'Drop your transactions CSV here or click to browse'}
        </p>
        <p className="text-xs text-slate-500">Columns: date, merchant, amount, type</p>
      </div>
      {status && (
        <p className={`mt-2 text-sm px-1 ${status.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>{status}</p>
      )}
    </div>
  );
}
