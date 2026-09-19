'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
import AnimatedCard from '@/components/AnimatedCard';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, ArrowLeft, Upload, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react';

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
  
  const [showUpload, setShowUpload] = useState(false);

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

  const handleImported = () => { 
    setShowUpload(false);
    loadAll(); 
    loadRecurring(); 
    loadInsights(); 
  };

  // Compute greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpenses += t.amount;
    });
    const totalBalance = totalIncome - totalExpenses;
    const totalSavings = goals.reduce((acc, g) => acc + g.current_amount, 0);

    return { totalIncome, totalExpenses, totalBalance, totalSavings };
  }, [transactions, goals]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Import Transactions
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Dynamic Greeting & Dashboard Header Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {greeting}, Suyash
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Track your finances, monitor growth, and stay in control.
              </p>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-semibold mb-2">
                  <Wallet className="w-4 h-4 text-indigo-500" />
                  TOTAL BALANCE
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalBalance.toLocaleString('en-IN')}
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-semibold mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  TOTAL INCOME
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalIncome.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-semibold mb-2">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  TOTAL EXPENSES
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalExpenses.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-semibold mb-2">
                  <PiggyBank className="w-4 h-4 text-amber-500" />
                  YOUR SAVINGS
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalSavings.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Smaller Animated Card embedded in header */}
          <div className="hidden md:flex shrink-0 w-80 lg:w-96 justify-center items-center">
             <div className="scale-75 origin-top-right lg:scale-90 lg:origin-center">
               <AnimatedCard interactive={false} />
             </div>
          </div>
        </div>

        {/* Upload Section (Toggleable) */}
        {showUpload && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <CsvUpload onImported={handleImported} />
          </div>
        )}

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
