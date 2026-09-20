'use client';
import { useState } from 'react';
import { SavingsGoal, createSavingsGoal, contributeToGoal, verifySavingsGoal } from '@/lib/api';
import { PlusCircle, Target, ShieldCheck } from 'lucide-react';

interface Props {
  goals: SavingsGoal[];
  onRefresh: () => void;
}

export default function SavingsGoalsSection({ goals, onRefresh }: Props) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [contributions, setContributions] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState<number | null>(null);

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

  const handleVerify = async (id: number) => {
    setVerifying(id);
    try {
      await verifySavingsGoal(id);
      onRefresh();
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-md hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
      </div>
      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">No goals yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {goals.map((g) => {
            const pct = Math.min((g.current_amount / g.target_amount) * 100, 100);
            return (
              <div key={g.id} className="rounded-xl bg-gray-50 dark:bg-slate-800/50 p-4 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{g.name}</span>
                    {g.onchain_tx_hash && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> Verified {g.onchain_tx_hash.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    ₹{g.current_amount.toLocaleString('en-IN')} / ₹{g.target_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700 mb-4 overflow-hidden">
                  <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-violet-400 border border-gray-200 dark:border-slate-700 transition-colors duration-300"
                    placeholder="Add ₹ amount" type="number"
                    value={contributions[g.id] ?? ''}
                    onChange={e => setContributions(p => ({ ...p, [g.id]: e.target.value }))}
                  />
                  <button onClick={() => handleContribute(g.id)}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    Contribute
                  </button>
                  {!g.onchain_tx_hash && (
                    <button onClick={() => handleVerify(g.id)} disabled={verifying === g.id}
                      className="rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Verify
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100 dark:border-slate-800">
        <input
          className="flex-1 min-w-[120px] rounded-xl bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-400 transition-colors duration-300"
          placeholder="Goal name" value={name} onChange={e => setName(e.target.value)}
        />
        <input
          className="w-32 rounded-xl bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 border border-gray-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-400 transition-colors duration-300"
          placeholder="₹ Target" type="number" value={target} onChange={e => setTarget(e.target.value)}
        />
        <button onClick={handleCreate} disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
          <PlusCircle className="w-4 h-4" /> Add Goal
        </button>
      </div>
    </div>
  );
}
