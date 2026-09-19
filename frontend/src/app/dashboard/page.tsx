'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
import MoneyFlowChart from '@/components/MoneyFlowChart';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, ArrowLeft, Activity, Flag } from 'lucide-react';

const SpendingGalaxy = dynamic(() => import('@/components/SpendingGalaxy'), { ssr: false });

export default function Dashboard() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [recurringLoading, setRecurringLoading] = useState(true);
  const [txnLoading, setTxnLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setTxnLoading(true);
    const [txns, buds, gls] = await Promise.all([
      getTransactions(), getBudgets(), getSavingsGoals(),
    ]);
    setTransactions(txns); setBudgets(buds); setGoals(gls);
    setTxnLoading(false);
  }, []);

  const loadRecurring = useCallback(async () => {
    setRecurringLoading(true);
    try { const r = await detectRecurring(); setRecurring(r.details); }
    finally { setRecurringLoading(false); }
  }, []);

  const loadInsights = useCallback(async () => {
    setInsightsLoading(true); setInsightsError(null);
    try { setInsights(await getInsights()); }
    catch (e: unknown) { setInsightsError(e instanceof Error ? e.message : 'Failed to load insights'); }
    finally { setInsightsLoading(false); }
  }, []);

  useEffect(() => { loadAll(); loadRecurring(); loadInsights(); }, [loadAll, loadRecurring, loadInsights]);

  const handleImported = () => { loadAll(); loadRecurring(); loadInsights(); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-gray-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">🏎️</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                  <span>F1 Finance Coach</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
                    PIT WALL LIVE
                  </span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400">Personal finance at championship velocity</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full transition-colors duration-300">
              <Activity className="w-3 h-3 text-emerald-500" />
              {transactions.length} telemetry points
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200 overflow-hidden"
            >
              <span
                className="absolute transition-all duration-300"
                style={{
                  opacity: isDark ? 1 : 0,
                  transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
                }}
              >
                <Moon className="w-4 h-4 text-slate-300" />
              </span>
              <span
                className="absolute transition-all duration-300"
                style={{
                  opacity: isDark ? 0 : 1,
                  transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
                }}
              >
                <Sun className="w-4 h-4 text-amber-500" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <CsvUpload onImported={handleImported} />
        <SummaryBar transactions={transactions} />
        <SpendingGalaxy transactions={transactions} budgets={budgets} loading={txnLoading} />
        
        {/* Money Flow Sankey Visualization */}
        <MoneyFlowChart transactions={transactions} budgets={budgets} loading={txnLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecurringCard data={recurring} loading={recurringLoading} />
          <div className="lg:col-span-2">
            <InsightsCard insights={insights} loading={insightsLoading} error={insightsError} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetsSection budgets={budgets} onRefresh={() => getBudgets().then(setBudgets)} />
          <SavingsGoalsSection goals={goals} onRefresh={() => getSavingsGoals().then(setGoals)} />
        </div>
      </main>
    </div>
  );
}
