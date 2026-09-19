'use client';
import { Transaction } from '@/lib/api';

interface Props {
  transactions: Transaction[];
}

export default function SummaryBar({ transactions }: Props) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Total Income', value: fmt(income), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
        { label: 'Total Expenses', value: fmt(expenses), color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
        { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
      ].map(({ label, value, color, bg }) => (
        <div key={label} className={`rounded-2xl border p-6 ${bg} backdrop-blur-sm`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
