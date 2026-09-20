'use client';
import Link from 'next/link';
import { ArrowRight, Play, Star, Activity, Layers, TrendingUp, Zap } from 'lucide-react';

function FloatingHeroMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto sm:ml-auto select-none animate-[float_6s_ease-in-out_infinite]">
      <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 blur-2xl rounded-full" />
      <div className="relative rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-2xl p-6 text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
            <span>Total Balance</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-4xl font-extrabold tracking-tight mb-8 text-black">₹14,50,000</div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-700">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
                <span>Housing</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[45%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-700">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
                <span>Food & Dining</span>
                <span>28%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[28%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1 text-gray-800">
                <span>Investments</span>
                <span>20%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[20%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
      `}} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      <header className="absolute top-0 w-full z-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🏎️</span>
            <div className="font-extrabold text-lg tracking-tight text-gray-900">
              F1 Finance Coach
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-black transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-gray-200 text-gray-700 text-xs font-bold tracking-wide">
              <Zap className="w-4 h-4 text-orange-500" />
              Next-Gen AI Finance Hub
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-gray-900">
              Manage Your Money, <br />
              <span className="italic font-serif text-rose-500">Smarter, Faster, Better</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed max-w-xl text-gray-600">
              Supercharge your wealth accumulation with automated categorization, intelligent budgets, and actionable AI insights. No complex spreadsheets required.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gray-900 hover:bg-black shadow-lg transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-gray-900">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="flex gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-4">Based on 10,000+ happy users</div>
              <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                <div>50K+ <span className="font-medium">Active Users</span></div>
                <div>1.2M <span className="font-medium">Insights Generated</span></div>
                <div>₹10Cr+ <span className="font-medium">Tracked</span></div>
              </div>
            </div>
          </div>

          <div>
            <FloatingHeroMockup />
          </div>
        </div>
      </section>
    </div>
  );
}
