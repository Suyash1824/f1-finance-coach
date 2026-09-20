'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  getTransactions, detectRecurring, getBudgets, getSavingsGoals, getInsights,
  Transaction, RecurringExpense, Budget, SavingsGoal, InsightItem,
} from '@/lib/api';
import RecurringCard from '@/components/RecurringCard';
import BudgetsSection from '@/components/BudgetsSection';
import SavingsGoalsSection from '@/components/SavingsGoalsSection';
import InsightsCard from '@/components/InsightsCard';
import CsvUpload from '@/components/CsvUpload';
import MoneyFlowChart from '@/components/MoneyFlowChart';
import AnalyticsSection from '@/components/AnalyticsSection';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Upload, Sparkles, LayoutDashboard, Receipt, Wallet, Target, CreditCard, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txnLoading, setTxnLoading] = useState(true);
  
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [recurringLoading, setRecurringLoading] = useState(true);
  
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const [showImportModal, setShowImportModal] = useState(false);

  const fetchData = async () => {
    setTxnLoading(true);
    try {
      const txns = await getTransactions();
      setTransactions(txns);
    } catch (e) {
      console.error(e);
    } finally {
      setTxnLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    getBudgets().then(setBudgets).catch(console.error);
    getSavingsGoals().then(setGoals).catch(console.error);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      setRecurringLoading(true);
      detectRecurring().then(r => setRecurring(r.details || [])).catch(console.error).finally(() => setRecurringLoading(false));
      
      setInsightsLoading(true);
      setInsightsError(null);
      getInsights()
        .then(res => setInsights(res || []))
        .catch(err => setInsightsError("Failed to fetch insights. Check backend logs."))
        .finally(() => setInsightsLoading(false));
    }
  }, [transactions]);

  const stats = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    const totalSavings = goals.reduce((sum, g) => sum + g.current_amount, 0);
    return { 
      totalIncome: inc, 
      totalExpense: exp, 
      balance: inc - exp,
      totalSavings 
    };
  }, [transactions, goals]);

  const recentTransactions = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const scrollToInsights = () => {
    document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans flex ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      
      {/* LEFT SIDEBAR */}
      <aside className={`w-20 lg:w-64 fixed h-full flex flex-col border-r transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} z-30`}>
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-inherit">
          <span className="text-2xl">🏎️</span>
          <span className="hidden lg:block ml-3 font-extrabold text-lg tracking-tight">F1 Finance</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          <a href="#dashboard-top" onClick={(e) => scrollTo('dashboard-top', e)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </a>
          <a href="#transactions" onClick={(e) => scrollTo('transactions', e)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Receipt className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Transactions</span>
          </a>
          <a href="#budgets" onClick={(e) => scrollTo('budgets', e)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Wallet className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Budgets</span>
          </a>
          <a href="#goals" onClick={(e) => scrollTo('goals', e)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Target className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Goals</span>
          </a>
        </nav>

        <div className="p-4 border-t border-inherit flex justify-center lg:justify-start">
          <button
            onClick={toggle}
            className={`flex items-center gap-3 w-full p-2 lg:px-3 lg:py-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            {isDark ? <Sun className="w-5 h-5 mx-auto lg:mx-0" /> : <Moon className="w-5 h-5 mx-auto lg:mx-0" />}
            <span className="hidden lg:block font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 relative">
        
        {/* HEADER */}
        <div id="dashboard-top" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pt-2">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {greeting()}, Suyash
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Track your finances, monitor growth, and stay in control.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={scrollToInsights} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'}`}>
              <Sparkles className="w-4 h-4 text-fuchsia-500" /> View Insights
            </button>
            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Import Transactions
            </button>
          </div>
        </div>

        {/* TOP ROW: STATS & MOCKUP CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Balance</div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{stats.balance.toLocaleString('en-IN')}</div>
            </div>
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Income</div>
              <div className="text-2xl font-bold text-emerald-500">₹{stats.totalIncome.toLocaleString('en-IN')}</div>
            </div>
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Expenses</div>
              <div className="text-2xl font-bold text-rose-500">₹{stats.totalExpense.toLocaleString('en-IN')}</div>
            </div>
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Your Savings</div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{stats.totalSavings.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="relative w-full h-full min-h-[120px] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-center relative z-10">
                <span className="text-white font-bold tracking-widest text-sm">F1 CARD</span>
                <div className="w-8 h-5 rounded bg-white/20" />
              </div>
              <div className="relative z-10 mt-6">
                <div className="text-slate-400 text-xs mb-1">CARDHOLDER</div>
                <div className="text-white font-medium tracking-widest">SUYASH</div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY TABLE */}
        <div id="transactions" className={`mb-8 rounded-2xl border transition-colors overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm pt-2 mt-[-8px]'}`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'} flex justify-between items-center`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
            <button className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-500 bg-slate-900/50' : 'text-gray-500 bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3">Merchant</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions yet.</td>
                  </tr>
                ) : (
                  recentTransactions.map((t) => (
                    <tr key={t.id} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5`}>
                      <td className={`px-6 py-4 font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{t.merchant}</td>
                      <td className={`px-6 py-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t.category || 'Uncategorized'}</td>
                      <td className={`px-6 py-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t.date}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-emerald-500' : (isDark ? 'text-white' : 'text-gray-900')}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>Recorded</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* REST OF DASHBOARD SECTIONS */}
        <div className="space-y-8">
          <AnalyticsSection transactions={transactions} loading={txnLoading} />
          <MoneyFlowChart transactions={transactions} budgets={budgets} loading={txnLoading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecurringCard data={recurring} loading={recurringLoading} />
            <div className="lg:col-span-2" id="insights-section">
              <InsightsCard insights={insights} loading={insightsLoading} error={insightsError} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="budgets" className="pt-2"><BudgetsSection budgets={budgets} onRefresh={() => getBudgets().then(setBudgets)} /></div>
            <div id="goals" className="pt-2"><SavingsGoalsSection goals={goals} onRefresh={() => getSavingsGoals().then(setGoals)} /></div>
          </div>
        </div>

      </main>

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Import Transactions</h3>
              <button onClick={() => setShowImportModal(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <ChevronRight className="w-5 h-5 rotate-180 hidden" /> 
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <CsvUpload onImported={() => {
              setShowImportModal(false);
              fetchData();
            }} />
          </div>
        </div>
      )}

    </div>
  );
}
