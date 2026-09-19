'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun,
  Moon,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Repeat,
  Cpu,
  Orbit,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight,
  Activity,
  Award,
} from 'lucide-react';

// ─── Counting Number Component ────────────────────────────────────────────────
function CountingNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = value * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-IN');

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── 3D Tilt Mockup Card with Mouse Follow & Continuous Float ────────────────
function FloatingDashboardMockup({ isDark }: { isDark: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Continuous floating ambient motion + mouse tilt
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        y: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full max-w-lg mx-auto cursor-pointer select-none"
    >
      {/* Outer ambient glow behind card */}
      <div
        className={`absolute -inset-1.5 rounded-3xl blur-xl opacity-60 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-r from-red-600/30 via-indigo-600/30 to-cyan-500/30'
            : 'bg-gradient-to-r from-red-400/20 via-indigo-400/20 to-cyan-400/20'
        }`}
      />

      {/* Main Glass Mockup Container */}
      <div
        style={{ transform: 'translateZ(30px)' }}
        className={`relative rounded-2xl border p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/85 border-slate-700/70 shadow-black/60 text-white'
            : 'bg-white/90 border-gray-200/80 shadow-indigo-100/50 text-gray-900'
        }`}
      >
        {/* Mockup Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏎️</span>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <span>PIT WALL TELEMETRY</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">
                P1 Pace · Sector 3 Active
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
            LAP 24 / 57
          </span>
        </div>

        {/* Mockup Numbers Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-gray-100/70 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/50">
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              Net Capital Inflow
            </span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ₹98,000
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2% vs previous stint
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-100/70 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/50">
            <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              Monthly Burn Rate
            </span>
            <div className="text-xl font-extrabold text-rose-500 dark:text-rose-400 mt-0.5">
              ₹34,850
            </div>
            <div className="text-[10px] text-rose-500 dark:text-rose-400 flex items-center gap-0.5 mt-0.5">
              <span>Under Delta by 18%</span>
            </div>
          </div>
        </div>

        {/* Mini 3D Orbit & Flow Simulation Bar */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-red-500/10 border border-indigo-500/20 dark:border-indigo-500/30 mb-4">
          <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              Spending Galaxy Balance
            </span>
            <span className="font-mono text-xs text-gray-600 dark:text-slate-300">
              Optimal Pit Window
            </span>
          </div>

          {/* Flow progress track */}
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[45%]" />
              <div className="h-full bg-amber-400 w-[25%]" />
              <div className="h-full bg-indigo-500 w-[20%]" />
              <div className="h-full bg-rose-500 w-[10%]" />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 dark:text-slate-400">
              <span>Savings: 45%</span>
              <span>Living: 25%</span>
              <span>Growth: 20%</span>
              <span>Leisure: 10%</span>
            </div>
          </div>
        </div>

        {/* Sample Live Transactions Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800/40 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                +₹
              </div>
              <div>
                <div className="font-semibold text-[11px]">Primary Salary Credit</div>
                <div className="text-[10px] text-gray-400">Auto-categorized · Inflow</div>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +₹45,000
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800/40 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
                🔄
              </div>
              <div>
                <div className="font-semibold text-[11px]">Netflix & Streaming</div>
                <div className="text-[10px] text-gray-400">Recurring detected · Monthly</div>
              </div>
            </div>
            <span className="font-mono font-bold text-rose-500 dark:text-rose-400">
              -₹199
            </span>
          </div>
        </div>

        {/* AI Insight Badge */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate">
            <strong className="text-gray-900 dark:text-white">Pit Wall AI:</strong> Switch
            food spend by 12% to lock in pole position on your Goa trip goal.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden relative">
      {/* ─── ATMOSPHERIC BACKGROUND GRADIENT ORBS ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Crimson Orb */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute -top-32 -left-32 w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full blur-3xl opacity-30 dark:opacity-20 ${
            isDark ? 'bg-rose-600' : 'bg-red-400'
          }`}
        />

        {/* Electric Cyan/Indigo Orb */}
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className={`absolute top-1/3 -right-32 w-96 h-96 sm:w-[36rem] sm:h-[36rem] rounded-full blur-3xl opacity-25 dark:opacity-20 ${
            isDark ? 'bg-cyan-500' : 'bg-indigo-400'
          }`}
        />

        {/* Emerald/Amber Subtle Center Orb */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 50, 0],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
          className={`absolute -bottom-32 left-1/4 w-96 h-96 sm:w-[30rem] sm:h-[30rem] rounded-full blur-3xl opacity-20 dark:opacity-15 ${
            isDark ? 'bg-emerald-500' : 'bg-teal-300'
          }`}
        />
      </div>

      {/* ─── NAVIGATION BAR ──────────────────────────────────────────────── */}
      <header className="relative z-30 border-b border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🏎️</span>
            <div>
              <div className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
                <span>F1 Finance Coach</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                High-Performance Wealth Telemetry
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('telemetry-stats')}
              className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Telemetry
            </button>
          </nav>

          <div className="flex items-center gap-3">
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

            <Link
              href="/dashboard"
              className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-lg shadow-red-600/25 dark:shadow-red-600/20 transition-all duration-300 transform active:scale-95"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, subheadline, CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold tracking-wide"
            >
              <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>NEXT-GEN FINTECH COCKPIT</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08]"
            >
              Drive Your Finances at{' '}
              <span className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                Championship Speed.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              Harness live banking telemetry, 3D orbital spending galaxies, automated recurring leak
              detectors, and Gemini AI coaching to turn every financial pit stop into pole position.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-xl shadow-red-600/30 dark:shadow-red-600/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-all duration-200"
              >
                <span>See How It Works</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>

            {/* Micro proof points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-gray-500 dark:text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero login needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Local & Private Docker telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Powered by Gemini AI</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Floating Dashboard Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <FloatingDashboardMockup isDark={isDark} />
          </div>
        </div>
      </section>

      {/* ─── ANIMATED STATS ROW ──────────────────────────────────────────── */}
      <section
        id="telemetry-stats"
        className="relative z-10 py-16 border-y border-gray-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/70 dark:border-slate-700/50 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-mono">
                <CountingNumber value={24850} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400 mt-2">
                Transactions Analyzed
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                High-frequency telemetry
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/70 dark:border-slate-700/50 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                <CountingNumber value={38400} prefix="₹" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400 mt-2">
                Avg. Saved / Season
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Per active racer
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/70 dark:border-slate-700/50 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                <CountingNumber value={16} suffix=" Categories" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400 mt-2">
                Automated ML Tagging
              </div>
              <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 font-medium">
                Microsecond precision
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200/70 dark:border-slate-700/50 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-mono">
                <CountingNumber value={99.4} decimals={1} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400 mt-2">
                Gemini Strategy Accuracy
              </div>
              <div className="text-[11px] text-amber-500 mt-1 font-medium">
                Personalized pit maneuvers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Race-Engineered Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
          >
            Engineered to Outpace Financial Friction
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-slate-400"
          >
            Every feature is calibrated like an F1 telemetry sensor: instant insight, zero clutter,
            and complete control over your cash flow dynamics.
          </motion.p>
        </div>

        {/* 4 Feature Cards Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Smart Categorization
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Instant rule-based & semantic parsing automatically attributes merchants to Food,
              Housing, Utilities, Transport, and Shopping with zero manual tagging.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Repeat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Recurring Leak Detector
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Unmasks sneaky monthly subscriptions, creeping recurring bills, and cadence charges so
              you can plug financial leaks before they compound.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI Pit Wall Insights
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Powered by Google Gemini to analyze your entire spending profile and generate
              customized tactical moves that maximize your discretionary savings rate.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group p-6 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Orbit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              3D Galaxy & Money Flow
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Experience your finances in full 3D with glowing orbital spheres and Sankey money-flow
              telemetry mapping every rupee from source to savings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-slate-800/80"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider"
          >
            <Activity className="w-3.5 h-3.5" />
            The 3-Step Race Strategy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
          >
            How F1 Finance Coach Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-600 dark:text-slate-400"
          >
            From raw transaction logs to clear, high-velocity wealth generation in under 60 seconds.
          </motion.p>
        </div>

        {/* 3 Step Cards Horizontal / Stacked with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-8 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl sm:text-4xl font-black font-mono text-red-500/30 dark:text-red-400/25">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ingest Telemetry
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Upload your bank CSV with one click or feed sample telemetry directly. Data is parsed
              securely into your private database instantly.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative p-8 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl sm:text-4xl font-black font-mono text-amber-500/30 dark:text-amber-400/25">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI Pit Crew Analysis
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Neural detectors categorize expenses, flag recurrent drains, compare against active
              budgets, and build custom Gemini AI pit strategies.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative p-8 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-500/30 dark:text-emerald-400/25">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Take the Podium
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              Visualize flows on the 3D Spending Galaxy and Sankey telemetry, fund goal reserves,
              and watch your savings velocity accelerate.
            </p>
          </motion.div>
        </div>

        {/* CTA Banner at bottom of How It Works */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-red-600 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden text-center"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Upgrade Your Financial Lap Times?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Launch the F1 Finance Coach dashboard right now and explore your complete cash flow
              telemetry in real time.
            </p>
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Enter the Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/60 transition-colors duration-300 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏎️</span>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">
                F1 Finance Coach
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Personal finance at championship velocity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:text-red-500 transition-colors">
              Pit Wall Dashboard
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-red-500 transition-colors"
            >
              Telemetry Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-red-500 transition-colors"
            >
              How It Works
            </button>
          </div>

          <div className="text-xs text-gray-400 dark:text-slate-500">
            © 2026 F1 Finance Coach · High-Performance Wealth Engineering
          </div>
        </div>
      </footer>
    </div>
  );
}
