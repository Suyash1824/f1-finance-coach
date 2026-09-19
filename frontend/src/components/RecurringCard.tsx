'use client';
import { RecurringExpense } from '@/lib/api';
import { RefreshCw } from 'lucide-react';

interface Props {
  data: RecurringExpense[];
  loading: boolean;
}

export default function RecurringCard({ data, loading }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <RefreshCw className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Recurring Expenses</h2>
      </div>
      {loading ? (
        <p className="text-slate-400 text-sm">Detecting patterns…</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400 text-sm">No recurring patterns detected yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.merchant} className="flex items-center justify-between rounded-xl bg-slate-700/40 px-4 py-3">
              <div>
                <p className="font-medium text-white text-sm">{r.merchant}</p>
                <p className="text-xs text-slate-400">Every ~{r.interval_days} days · {r.occurrences}× seen</p>
              </div>
              <span className="text-cyan-300 font-semibold text-sm">
                ₹{r.average_amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
