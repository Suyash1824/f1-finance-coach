'use client';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { CreditCard, Nfc } from 'lucide-react';

interface AnimatedCardProps {
  scrollYProgress?: MotionValue<number>;
  interactive?: boolean;
}

export default function AnimatedCard({ scrollYProgress, interactive = false }: AnimatedCardProps) {
  // If scrollYProgress is provided, use it for dramatic 3D rotation
  // Otherwise, use a subtle ambient rotation for the dashboard.
  
  const defaultRotateX = scrollYProgress ? useTransform(scrollYProgress, [0, 1], [30, -30]) : 10;
  const defaultRotateY = scrollYProgress ? useTransform(scrollYProgress, [0, 1], [-40, 40]) : -15;

  return (
    <div
      className="relative w-80 h-52 sm:w-96 sm:h-60 rounded-3xl group mx-auto"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: defaultRotateX,
          rotateY: defaultRotateY,
        }}
        animate={!scrollYProgress && !interactive ? {
          rotateX: [5, -5, 5],
          rotateY: [-10, -20, -10],
          y: [-5, 5, -5]
        } : undefined}
        transition={!scrollYProgress && !interactive ? {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        } : undefined}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #4c1d95 100%)',
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/30 blur-3xl rounded-full" />

          {/* Top Row: Chip and Network */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-8 bg-gradient-to-br from-amber-200 to-amber-500 rounded-md shadow-sm border border-amber-300/50 flex items-center justify-center opacity-90">
                <div className="w-full h-[1px] bg-amber-700/30 absolute" />
                <div className="h-full w-[1px] bg-amber-700/30 absolute" />
              </div>
              <Nfc className="w-5 h-5 text-gray-300/80" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-screen" />
              <div className="w-6 h-6 rounded-full bg-orange-500/80 mix-blend-screen -ml-3" />
            </div>
          </div>

          {/* Middle: Card Number */}
          <div className="relative z-10 mt-6 sm:mt-8">
            <div className="font-mono text-xl sm:text-2xl tracking-widest text-white/90 drop-shadow-sm flex items-center gap-3">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span className="tracking-widest">0329</span>
            </div>
          </div>

          {/* Bottom: Name and Expiry */}
          <div className="relative z-10 flex justify-between items-end mt-4 sm:mt-6 text-white/80 uppercase tracking-widest text-[10px] sm:text-xs">
            <div>
              <div className="opacity-60 mb-1 text-[8px] sm:text-[10px]">Cardholder</div>
              <div className="font-semibold text-white">Suyash Member</div>
            </div>
            <div className="text-right">
              <div className="opacity-60 mb-1 text-[8px] sm:text-[10px]">Valid Thru</div>
              <div className="font-semibold text-white">12/28</div>
            </div>
          </div>
        </div>

        {/* Back of Card (Optional, for realistic 3D) */}
        <div
          className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          }}
        >
          <div className="w-full h-12 bg-black/80 mt-8" />
          <div className="w-3/4 h-8 bg-gray-200 mt-4 mx-auto flex items-center justify-end px-4 text-black font-mono text-sm italic">
            ***
          </div>
        </div>
      </motion.div>
    </div>
  );
}
