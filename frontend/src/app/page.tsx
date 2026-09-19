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
      <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/30 to-pink-500/30 blur-2xl rounded-full" />
      <div className="relative rounded-3xl border border-white/60 bg-white/60 backdrop-blur-2xl shadow-2xl p-6 text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
            <span>Total Balance</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-4xl font-extrabold tracking-tight mb-8 text-black">₹14,50,000</div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-700">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
                <span>Housing</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[45%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-700">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
                <span>Food & Dining</span>
                <span>28%</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[28%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
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
            <div className="font-extrabold text-lg tracking-tight leading-tight" style={{ color: '#0f172a' }}>
              F1 Finance Coach
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-200 overflow-hidden"
            >
              <Moon className="w-4 h-4 text-slate-800" />
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-black transition-colors shadow-lg"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─── PART 1: BRIGHT GRADIENT HERO SECTION ────────────────────────── */}
      {/* Used style={{ background: ... }} to guarantee the gradient overrides any tailwind classes */}
      <section 
        className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #fcd34d 100%)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-slate-900 text-xs font-bold tracking-wide">
              <Zap className="w-4 h-4 text-rose-600" />
              AI-Powered Finance Coach
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-sm">
              Manage Your Money, <br />
              <span className="italic font-serif text-white/90 drop-shadow-sm">Smarter, Faster, Better</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed max-w-xl text-gray-100 drop-shadow-sm">
              Supercharge your wealth accumulation with automated categorization, interactive 3D visualizations, and actionable AI insights that keep your spending in check.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-slate-900 hover:bg-black shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="group flex items-center gap-2 font-bold hover:text-black transition-colors" style={{ color: '#0f172a' }}>
                <div className="w-12 h-12 rounded-full bg-white/50 group-hover:bg-white/70 flex items-center justify-center backdrop-blur-md transition-colors">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="pt-8 border-t border-slate-900/10">
              <div className="flex gap-1 text-white mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="flex items-center gap-6 text-sm font-bold" style={{ color: '#0f172a' }}>
                <div>24K+ <span className="font-medium" style={{ color: '#334155' }}>Analyzed</span></div>
                <div>18 <span className="font-medium" style={{ color: '#334155' }}>Categories</span></div>
                <div>1.2M <span className="font-medium" style={{ color: '#334155' }}>Insights</span></div>
              </div>
            </div>
          </div>

          <div>
            <FloatingHeroMockup />
          </div>
        </div>
      </section>

      {/* ─── PART 2: ANIMATED 3D CREDIT CARD SECTION ─────────────────────── */}
      <section className="relative py-40 lg:py-56 px-4 sm:px-6 bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center min-h-[120vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-80" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-24 space-y-4">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white">Your Wallet, Reimagined.</h2>
          <p className="text-slate-300 text-xl font-medium">Scroll down to see the magic of 3D transforms tied directly to your scroll position.</p>
        </div>

        {/* Gave the card a much larger container and scale */}
        <div className="relative z-20 w-full flex items-center justify-center transform scale-125 lg:scale-150">
          <AnimatedCard scrollYProgress={scrollYProgress} interactive={true} />
        </div>
      </section>

      {/* ─── PART 3: DARK FEATURE SECTION ────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #0a0f24 0%, #1a1025 100%)', color: 'white' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Financial management at your fingertips
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              We leverage advanced algorithms and seamless integration to provide you with a crystal clear view of your financial health, without the spreadsheets.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <h3 className="font-bold mb-1 text-white">Smart Insights</h3>
                <p className="text-sm text-slate-300">AI automatically detects your spending patterns and flags anomalies.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <h3 className="font-bold mb-1 text-white">Custom Budgets</h3>
                <p className="text-sm text-slate-300">Set limits on specific categories and get notified before you overspend.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <h3 className="font-bold mb-1 text-white">Goal Tracking</h3>
                <p className="text-sm text-slate-300">Allocate funds to tailored savings goals and track your progress live.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <h3 className="font-bold mb-1 text-white">3D Visualization</h3>
                <p className="text-sm text-slate-300">Interact with your spending orbits and Sankey flow diagrams.</p>
              </motion.div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/60 via-purple-500/20 to-transparent blur-3xl" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="relative w-full max-w-sm rounded-[2rem] border-[8px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden"
            >
              {/* Polished Mockup */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-white font-bold tracking-tight">Recent Activity</div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-6 shadow-lg">
                  <div className="text-indigo-100 text-xs mb-1">Available Balance</div>
                  <div className="text-white text-3xl font-extrabold mb-4">₹1,24,500</div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded bg-white/20 text-white text-[10px] font-medium">+12.5%</div>
                    <div className="px-2 py-1 rounded bg-white/20 text-white text-[10px] font-medium">Trending</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { color: 'bg-rose-500', title: 'Netflix Subscription', amount: '-₹649', sub: 'Entertainment' },
                    { color: 'bg-emerald-500', title: 'Salary Credited', amount: '+₹85,000', sub: 'Income' },
                    { color: 'bg-amber-500', title: 'Uber Ride', amount: '-₹420', sub: 'Transport' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className={`w-10 h-10 rounded-full ${item.color} bg-opacity-20 flex items-center justify-center shrink-0`}>
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{item.title}</div>
                        <div className="text-slate-400 text-xs">{item.sub}</div>
                      </div>
                      <div className={`font-bold text-sm ${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                        {item.amount}
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
