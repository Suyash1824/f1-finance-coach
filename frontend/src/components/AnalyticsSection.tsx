'use client';
import { useMemo } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { Transaction } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { BarChart3 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#f59e0b',
  'Housing': '#6366f1',
  'Transport': '#3b82f6',
  'Utilities': '#06b6d4',
  'Entertainment': '#ec4899',
  'Shopping': '#8b5cf6',
  'Health': '#10b981',
  'Subscriptions': '#f43f5e',
  'Income': '#10b981',
  'Savings & Surplus': '#22c55e',
  'Reserves': '#a855f7',
  'Uncategorized': '#64748b',
};

export default function AnalyticsSection({ transactions, loading }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const cat = t.category || 'Uncategorized';
        map[cat] = (map[cat] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  const incomeVsExpense = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return [
      { name: 'Income', value: inc, fill: '#10b981' },
      { name: 'Expenses', value: exp, fill: '#f43f5e' }
    ];
  }, [transactions]);

  const trendData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        map[t.date] = (map[t.date] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([date, amount]) => ({ date, amount })).sort((a,b) => a.date.localeCompare(b.date));
  }, [transactions]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-md animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="h-64 bg-gray-100 dark:bg-slate-800/50 rounded-xl"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-md text-center">
        <p className="text-gray-500 dark:text-slate-400">Upload transactions to see analytics</p>
      </div>
    );
  }

  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 or slate-500
  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 or slate-200
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '8px'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle} className="p-3 shadow-lg text-sm font-medium">
          {label && <div className="mb-1 text-gray-500 dark:text-gray-400">{label}</div>}
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ color: entry.color || entry.fill }}>
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-md hover:scale-[1.01] transition-all duration-200">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PIE CHART */}
        <div className="flex flex-col h-72">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 text-center">Spending by Category</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Uncategorized']} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="flex flex-col h-72">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 text-center">Income vs Expenses</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpense} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 'dataMax + 10000']} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {incomeVsExpense.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="flex flex-col h-72">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2 text-center">Spending Trend Over Time</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  stroke={textColor} 
                  tick={{ fill: textColor, fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                  }}
                />
                <YAxis 
                  stroke={textColor} 
                  tick={{ fill: textColor, fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Spent"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
