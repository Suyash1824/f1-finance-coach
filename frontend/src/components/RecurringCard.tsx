'use client';
import { RecurringExpense } from '@/lib/api';
import { RefreshCw } from 'lucide-react';

interface Props {
  data: RecurringExpense[];
  loading: boolean;
}

export default function RecurringCard({ data, loading }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recurring Expenses</h2>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-slate-800/50 animate-pulse" />)}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">No recurring patterns detected yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.merchant} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700/50 px-4 py-3 transition-colors duration-300">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{r.merchant}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Every ~{r.interval_days} days · {r.occurrences}× seen</p>
              </div>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                ₹{r.average_amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
