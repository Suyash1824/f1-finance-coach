'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  getTransactions, detectRecurring, getBudgets, getSavingsGoals, getInsights,
  Transaction, RecurringExpense, Budget, SavingsGoal, InsightItem,
} from '@/lib/api';
import dynamic from 'next/dynamic';
import SummaryBar from '@/components/SummaryBar';
import RecurringCard from '@/components/RecurringCard';
import BudgetsSection from '@/components/BudgetsSection';
import SavingsGoalsSection from '@/components/SavingsGoalsSection';
import InsightsCard from '@/components/InsightsCard';
import CsvUpload from '@/components/CsvUpload';

// Dynamic import to avoid SSR issues with three.js
const SpendingGalaxy = dynamic(() => import('@/components/SpendingGalaxy'), { ssr: false });

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [recurringLoading, setRecurringLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [txns, buds, gls] = await Promise.all([
      getTransactions(),
      getBudgets(),
      getSavingsGoals(),
    ]);
    setTransactions(txns);
    setBudgets(buds);
    setGoals(gls);
  }, []);

  const loadRecurring = useCallback(async () => {
    setRecurringLoading(true);
    try {
      const r = await detectRecurring();
      setRecurring(r.details);
    } finally {
      setRecurringLoading(false);
    }
  }, []);

  const loadInsights = useCallback(async () => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const ins = await getInsights();
      setInsights(ins);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load insights';
      setInsightsError(msg);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    loadRecurring();
    loadInsights();
  }, [loadAll, loadRecurring, loadInsights]);

  const handleImported = () => {
    loadAll();
    loadRecurring();
    loadInsights();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏎️</span>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">F1 Finance Coach</h1>
              <p className="text-xs text-slate-400">Personal finance at race pace</p>
            </div>
          </div>
          <span className="hidden sm:block text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {transactions.length} transactions loaded
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* CSV Upload */}
        <CsvUpload onImported={handleImported} />

        {/* Summary */}
        <SummaryBar transactions={transactions} />

        {/* 3D Galaxy */}
        <SpendingGalaxy transactions={transactions} budgets={budgets} />

        {/* Three-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecurringCard data={recurring} loading={recurringLoading} />
          <div className="lg:col-span-2">
            <InsightsCard insights={insights} loading={insightsLoading} error={insightsError} />
          </div>
        </div>

        {/* Budgets + Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetsSection budgets={budgets} onRefresh={() => getBudgets().then(setBudgets)} />
          <SavingsGoalsSection goals={goals} onRefresh={() => getSavingsGoals().then(setGoals)} />
        </div>
      </main>
    </div>
  );
}
