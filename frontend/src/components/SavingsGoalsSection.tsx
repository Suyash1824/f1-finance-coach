'use client';
import { useState } from 'react';
import { SavingsGoal, createSavingsGoal, contributeToGoal } from '@/lib/api';
import { PlusCircle, Target } from 'lucide-react';

interface Props {
  goals: SavingsGoal[];
  onRefresh: () => void;
}

export default function SavingsGoalsSection({ goals, onRefresh }: Props) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [contributions, setContributions] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || !target) return;
    setSaving(true);
    try {
      await createSavingsGoal(name, parseFloat(target));
      setName(''); setTarget('');
      onRefresh();
    } finally { setSaving(false); }
  };

  const handleContribute = async (id: number) => {
    const amt = parseFloat(contributions[id] || '0');
    if (!amt) return;
    await contributeToGoal(id, amt);
    setContributions(p => ({ ...p, [id]: '' }));
    onRefresh();
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
      </div>
      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">No goals yet.</p>
      ) : (
        <div className="space-y-5 mb-6">
          {goals.map((g) => {
            const pct = Math.min((g.current_amount / g.target_amount) * 100, 100);
            return (
              <div key={g.id} className="rounded-xl bg-gray-50 dark:bg-slate-700/40 p-4 transition-colors duration-300">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{g.name}</span>
                  <span className="text-gray-500 dark:text-slate-400">
                    ₹{g.current_amount.toLocaleString('en-IN')} / ₹{g.target_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-600 mb-3">
                  <div className="h-2 rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg bg-gray-100 dark:bg-slate-600 px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400 border border-gray-200 dark:border-transparent transition-colors duration-300"
                    placeholder="Add ₹ amount" type="number"
                    value={contributions[g.id] ?? ''}
                    onChange={e => setContributions(p => ({ ...p, [g.id]: e.target.value }))}
                  />
                  <button onClick={() => handleContribute(g.id)}
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-500 transition">
                    Contribute
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <input
          className="flex-1 min-w-[120px] rounded-lg bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-violet-400 transition-colors duration-300"
          placeholder="Goal name" value={name} onChange={e => setName(e.target.value)}
        />
        <input
          className="w-32 rounded-lg bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-violet-400 transition-colors duration-300"
          placeholder="₹ Target" type="number" value={target} onChange={e => setTarget(e.target.value)}
        />
        <button onClick={handleCreate} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition disabled:opacity-50">
          <PlusCircle className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}
