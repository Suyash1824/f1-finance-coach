'use client';
import { useState } from 'react';
import { Budget, createBudget } from '@/lib/api';
import { PlusCircle, Wallet } from 'lucide-react';

interface Props {
  budgets: Budget[];
  onRefresh: () => void;
}

export default function BudgetsSection({ budgets, onRefresh }: Props) {
  const [catName, setCatName] = useState('');
  const [limit, setLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!catName || !limit) return;
    setSaving(true);
    try {
      await createBudget(catName, parseFloat(limit));
      setCatName(''); setLimit('');
      onRefresh();
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budgets</h2>
      </div>
      {budgets.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">No budgets yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {budgets.map((b) => {
            const pct = Math.min((b.spent / b.monthly_limit) * 100, 100);
            const over = b.spent > b.monthly_limit;
            const near = pct >= 80 && !over;
            const barColor = over ? 'bg-rose-500' : near ? 'bg-amber-400' : 'bg-emerald-500';
            return (
              <div key={b.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-900 dark:text-white font-medium">{b.category}</span>
                  <span className={`${over ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-slate-400'}`}>
                    ₹{b.spent.toLocaleString('en-IN')} / ₹{b.monthly_limit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                  <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <input
          className="flex-1 min-w-[120px] rounded-lg bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-300"
          placeholder="Category name" value={catName} onChange={e => setCatName(e.target.value)}
        />
        <input
          className="w-28 rounded-lg bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-300"
          placeholder="₹ Limit" type="number" value={limit} onChange={e => setLimit(e.target.value)}
        />
        <button onClick={handleAdd} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition disabled:opacity-50">
          <PlusCircle className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}
