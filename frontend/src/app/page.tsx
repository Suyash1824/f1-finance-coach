'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useInView, useScroll } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import {
  Sun,
  Moon,
  ArrowRight,
  Play,
  Star,
  Activity,
  Award,
  Cpu,
  Layers,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';

function FloatingHeroMockup() {
  return (
    <motion.div
      animate={{ y: [-15, 15, -15] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-sm mx-auto sm:ml-auto select-none"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 blur-2xl rounded-full" />
      <div className="relative rounded-3xl border border-white/40 bg-white/30 backdrop-blur-xl shadow-2xl p-6 text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <span>Total Balance</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-4xl font-extrabold tracking-tight mb-8">₹14,50,000</div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Housing</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[45%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Food & Dining</span>
                <span>28%</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[28%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Investments</span>
                <span>20%</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[20%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative">
      
      {/* ─── NAVIGATION BAR ──────────────────────────────────────────────── */}
      <header className="absolute top-0 w-full z-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🏎️</span>
            <div className="font-extrabold text-lg text-gray-900 tracking-tight leading-tight">
              F1 Finance Coach
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-200 overflow-hidden"
            >
              <Moon className="w-4 h-4 text-gray-800" />
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-lg"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─── PART 1: BRIGHT GRADIENT HERO SECTION ────────────────────────── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-coral-400 via-orange-400 to-yellow-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-gray-900 text-xs font-bold tracking-wide">
              <Zap className="w-4 h-4 text-orange-600" />
              AI-Powered Finance Coach
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.05]">
              Manage Your Money, <br />
              <span className="italic font-serif text-white drop-shadow-sm">Smarter, Faster, Better</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-900/80 max-w-xl font-medium leading-relaxed">
              Supercharge your wealth accumulation with automated categorization, interactive 3D visualizations, and actionable AI insights that keep your spending in check.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gray-900 hover:bg-black shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="group flex items-center gap-2 text-gray-900 font-bold hover:text-black transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/40 group-hover:bg-white/60 flex items-center justify-center backdrop-blur-md transition-colors">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="pt-8 border-t border-gray-900/10">
              <div className="flex gap-1 text-orange-600 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="flex items-center gap-6 text-sm font-bold text-gray-800">
                <div>24K+ <span className="font-medium text-gray-700">Analyzed</span></div>
                <div>18 <span className="font-medium text-gray-700">Categories</span></div>
                <div>1.2M <span className="font-medium text-gray-700">Insights</span></div>
              </div>
            </div>
          </div>

          <div>
            <FloatingHeroMockup />
          </div>
        </div>
      </section>

      {/* ─── PART 2: ANIMATED 3D CREDIT CARD SECTION ─────────────────────── */}
      <section className="relative py-32 lg:py-48 px-4 sm:px-6 bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center min-h-[100vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-80" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Your Wallet, Reimagined.</h2>
          <p className="text-slate-400 text-lg">Scroll down to see the magic of 3D transforms tied directly to your scroll position.</p>
        </div>

        <div className="relative z-20 w-full h-96 flex items-center justify-center">
          <AnimatedCard scrollYProgress={scrollYProgress} interactive={true} />
        </div>
      </section>

      {/* ─── PART 3: DARK FEATURE SECTION ────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-[#0a0f24] to-[#1a1025] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Financial management at your fingertips
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              We leverage advanced algorithms and seamless integration to provide you with a crystal clear view of your financial health, without the spreadsheets.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold mb-1">Smart Insights</h3>
                <p className="text-sm text-slate-400">AI automatically detects your spending patterns and flags anomalies.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold mb-1">Custom Budgets</h3>
                <p className="text-sm text-slate-400">Set limits on specific categories and get notified before you overspend.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold mb-1">Goal Tracking</h3>
                <p className="text-sm text-slate-400">Allocate funds to tailored savings goals and track your progress live.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="font-bold mb-1">3D Visualization</h3>
                <p className="text-sm text-slate-400">Interact with your spending orbits and Sankey flow diagrams.</p>
              </motion.div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/40 via-purple-500/10 to-transparent blur-2xl" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="relative w-full max-w-xs rounded-[2rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-slate-900">
                <div className="h-6 w-1/3 bg-slate-800 rounded mb-4" />
                <div className="h-20 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-800" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-1/2 bg-slate-700 rounded" />
                        <div className="h-2 w-1/4 bg-slate-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  );
}
