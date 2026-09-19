'use client';
import { InsightItem } from '@/lib/api';
import { Sparkles } from 'lucide-react';

interface Props {
  insights: InsightItem[];
  loading: boolean;
  error: string | null;
}

export default function InsightsCard({ insights, loading, error }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-fuchsia-400" />
        <h2 className="text-lg font-semibold text-white">AI Financial Insights</h2>
        <span className="ml-auto text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">Gemini</span>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-slate-700/40 animate-pulse" />
          ))}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-300 text-sm">
          {error}
        </div>
      )}
      {!loading && !error && insights.length === 0 && (
        <p className="text-slate-400 text-sm">No insights available yet — import some transactions first.</p>
      )}
      {!loading && !error && (
        <div className="space-y-4">
          {insights.map((ins, i) => (
            <div key={i} className="rounded-xl bg-slate-700/30 border-l-4 border-fuchsia-500 p-4">
              <p className="font-semibold text-white text-sm mb-1">{ins.title}</p>
              <p className="text-slate-300 text-sm mb-2">{ins.explanation}</p>
              <div className="flex items-start gap-2">
                <span className="text-fuchsia-400 text-xs mt-0.5">→</span>
                <p className="text-fuchsia-300 text-xs">{ins.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
