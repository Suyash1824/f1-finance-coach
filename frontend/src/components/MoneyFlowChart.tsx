'use client';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Transaction, Budget } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { GitMerge, ArrowRight, Wallet, TrendingUp, PiggyBank } from 'lucide-react';

interface MoneyFlowProps {
  transactions: Transaction[];
  budgets?: Budget[];
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

const INCOME_COLORS = ['#10b981', '#14b8a6', '#059669', '#34d399', '#0d9488'];

interface SankeyNodePayload {
  name: string;
  color: string;
  value?: number;
  depth?: number;
}

interface CustomNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: SankeyNodePayload;
  containerWidth?: number;
  isDark?: boolean;
}

function CustomSankeyNode({
  x = 0,
  y = 0,
  width = 16,
  height = 20,
  payload,
  containerWidth = 800,
  isDark = true,
}: CustomNodeProps) {
  if (!payload || height <= 0) return null;

  const isOutflow = x > containerWidth / 2;
  const isCenter = Math.abs(x - containerWidth / 2) < 80;
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 4)}
        fill={payload.color || '#6366f1'}
        rx={4}
        className="transition-all duration-300 hover:brightness-110"
        style={{
          filter: isDark ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
        }}
      />
      <text
        x={isOutflow ? x + width + 8 : isCenter ? x + width / 2 : x - 8}
        y={isCenter ? y - 8 : y + height / 2 - 2}
        textAnchor={isOutflow ? 'start' : isCenter ? 'middle' : 'end'}
        fill={textColor}
        fontSize={11}
        fontWeight={700}
        className="select-none pointer-events-none"
      >
        {payload.name}
      </text>
      {payload.value !== undefined && !isCenter && (
        <text
          x={isOutflow ? x + width + 8 : x - 8}
          y={y + height / 2 + 12}
          textAnchor={isOutflow ? 'start' : 'end'}
          fill={subColor}
          fontSize={10}
          className="select-none pointer-events-none"
        >
          ₹{payload.value.toLocaleString('en-IN')}
        </text>
      )}
    </g>
  );
}

interface CustomLinkProps {
  sourceX?: number;
  targetX?: number;
  sourceY?: number;
  targetY?: number;
  sourceControlX?: number;
  targetControlX?: number;
  linkWidth?: number;
  payload?: {
    source?: SankeyNodePayload;
    target?: SankeyNodePayload;
    value?: number;
  };
  isDark?: boolean;
}

function CustomSankeyLink({
  sourceX = 0,
  targetX = 0,
  sourceY = 0,
  targetY = 0,
  linkWidth = 10,
  payload,
  isDark = true,
}: CustomLinkProps) {
  if (linkWidth <= 0) return null;

  const color = payload?.target?.color || payload?.source?.color || '#6366f1';
  const deltaX = targetX - sourceX;
  const curvature = 0.5;
  const xi1 = sourceX + deltaX * curvature;
  const xi2 = targetX - deltaX * curvature;

  const path = `M ${sourceX},${sourceY}
    C ${xi1},${sourceY} ${xi2},${targetY} ${targetX},${targetY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={Math.max(linkWidth, 2)}
      strokeOpacity={isDark ? 0.38 : 0.45}
      className="transition-all duration-300 hover:stroke-opacity-80"
    />
  );
}

interface TooltipPayloadItem {
  payload?: {
    source?: SankeyNodePayload;
    target?: SankeyNodePayload;
    value?: number;
  };
}

function CustomSankeyTooltip({
  active,
  payload,
  isDark,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  isDark: boolean;
}) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data || !data.source || !data.target) return null;

  return (
    <div
      className={`px-3 py-2 rounded-xl text-xs shadow-2xl border transition-colors ${
        isDark
          ? 'bg-slate-900/95 border-slate-700 text-white'
          : 'bg-white/95 border-gray-200 text-gray-900'
      }`}
    >
      <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
        <span style={{ color: data.source.color }}>{data.source.name}</span>
        <ArrowRight className="w-3 h-3 text-gray-400" />
        <span style={{ color: data.target.color }}>{data.target.name}</span>
      </div>
      <div className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
        ₹{data.value?.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export default function MoneyFlowChart({ transactions, loading }: MoneyFlowProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sankeyData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { nodes: [], links: [] };
    }

    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'income') {
        const src = t.merchant || 'Other Income';
        incomeMap[src] = (incomeMap[src] || 0) + t.amount;
      } else {
        const cat = t.category || 'Uncategorized';
        expenseMap[cat] = (expenseMap[cat] || 0) + t.amount;
      }
    });

    const incomeSources = Object.entries(incomeMap);
    const expenseCategories = Object.entries(expenseMap);

    const totalIncome = incomeSources.reduce((acc, [, val]) => acc + val, 0);
    const totalExpenses = expenseCategories.reduce((acc, [, val]) => acc + val, 0);

    // If no income recorded, provide an aggregated inflow node so the flow connects
    const effectiveIncomes =
      incomeSources.length > 0
        ? incomeSources
        : [['Deposits & Transfers', Math.max(totalExpenses, 1000)]];

    const effectiveTotalIncome = effectiveIncomes.reduce((acc, [, val]) => acc + val, 0);

    // Nodes array
    const nodes: { name: string; color: string; value?: number }[] = [];
    const links: { source: number; target: number; value: number }[] = [];

    // 1. Inflow nodes (Layer 0)
    effectiveIncomes.forEach(([name, amt], idx) => {
      nodes.push({
        name,
        color: INCOME_COLORS[idx % INCOME_COLORS.length],
        value: amt,
      });
    });

    // 2. Central "Cash Flow Hub" node (Layer 1)
    const hubIndex = nodes.length;
    nodes.push({
      name: 'Total Income Hub',
      color: isDark ? '#38bdf8' : '#0284c7',
      value: effectiveTotalIncome,
    });

    // Links: Inflows -> Hub
    effectiveIncomes.forEach(([, amt], idx) => {
      links.push({
        source: idx,
        target: hubIndex,
        value: amt,
      });
    });

    // 3. Outflow categories (Layer 2)
    const categoryStartIndex = nodes.length;
    expenseCategories.forEach(([cat, amt]) => {
      const color = CATEGORY_COLORS[cat] || '#818cf8';
      nodes.push({
        name: cat,
        color,
        value: amt,
      });
    });

    // Surplus or Deficit handling for realistic balance
    if (effectiveTotalIncome > totalExpenses && totalExpenses > 0) {
      const surplus = effectiveTotalIncome - totalExpenses;
      const surplusIndex = nodes.length;
      nodes.push({
        name: 'Savings & Surplus',
        color: CATEGORY_COLORS['Savings & Surplus'],
        value: surplus,
      });
      // Link Hub -> Surplus
      links.push({
        source: hubIndex,
        target: surplusIndex,
        value: surplus,
      });
    }

    // Links: Hub -> Expense categories
    expenseCategories.forEach(([, amt], idx) => {
      links.push({
        source: hubIndex,
        target: categoryStartIndex + idx,
        value: amt,
      });
    });

    return { nodes, links, totalIncome: effectiveTotalIncome, totalExpenses };
  }, [transactions, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 backdrop-blur-sm shadow-sm transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Where Your Money Goes
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Interactive Sankey telemetry of your capital inflows, hub distribution, and expense outlays
            </p>
          </div>
        </div>

        {sankeyData.nodes.length > 0 && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Inflow: ₹{sankeyData.totalIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-semibold">
              <Wallet className="w-3.5 h-3.5" />
              <span>Outlay: ₹{sankeyData.totalExpenses.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart container */}
      <div className="mt-6">
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Calculating cash telemetry…</span>
          </div>
        ) : sankeyData.nodes.length === 0 || sankeyData.links.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
            <PiggyBank className="w-10 h-10 text-gray-400 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
              No cash flow telemetry yet
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 max-w-sm mt-1">
              Upload transactions via the CSV telemetry module above to generate your dynamic money-flow diagram.
            </p>
          </div>
        ) : (
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={{
                  nodes: sankeyData.nodes,
                  links: sankeyData.links,
                }}
                node={<CustomSankeyNode isDark={isDark} />}
                link={<CustomSankeyLink isDark={isDark} />}
                nodePadding={24}
                nodeWidth={14}
                margin={{ top: 20, right: 140, bottom: 20, left: 140 }}
              >
                <Tooltip content={<CustomSankeyTooltip isDark={isDark} />} />
              </Sankey>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {sankeyData.nodes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500">
          <span>Hover over link channels to inspect flow volume and destination</span>
          <span className="hidden sm:inline">Color-coded matching Spending Galaxy orbits</span>
        </div>
      )}
    </motion.div>
  );
}
