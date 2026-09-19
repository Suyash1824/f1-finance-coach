'use client';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Transaction, Budget } from '@/lib/api';

interface CategoryData {
  name: string;
  total: number;
  budget?: Budget;
  transactions: Transaction[];
}

interface SphereProps {
  position: [number, number, number];
  size: number;
  color: string;
  label: string;
  amount: number;
  onClick: () => void;
  orbitSpeed: number;
  orbitRadius: number;
  orbitOffset: number;
}

function OrbitingSphere({ size, color, label, amount, onClick, orbitSpeed, orbitRadius, orbitOffset }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitSpeed + orbitOffset;
    meshRef.current.position.x = Math.cos(t) * orbitRadius;
    meshRef.current.position.z = Math.sin(t) * orbitRadius;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.15 : 1}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.3}
        metalness={0.4}
      />
      {hovered && (
        <Html center distanceFactor={8}>
          <div className="bg-slate-900/90 text-white text-xs rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap shadow-xl border border-slate-600">
            <p className="font-bold">{label}</p>
            <p className="text-slate-300">₹{amount.toLocaleString('en-IN')}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function CenterStar() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => { ref.current.rotation.y += 0.003; ref.current.rotation.x += 0.001; });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.35, 2]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
    </mesh>
  );
}

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function SpendingGalaxy({ transactions, budgets }: Props) {
  const [selected, setSelected] = useState<CategoryData | null>(null);

  const categories = useMemo<CategoryData[]>(() => {
    const map: Record<string, Transaction[]> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(t);
    });
    return Object.entries(map).map(([name, txns]) => ({
      name,
      total: txns.reduce((s, t) => s + t.amount, 0),
      budget: budgets.find(b => b.category === name),
      transactions: txns,
    }));
  }, [transactions, budgets]);

  const maxTotal = Math.max(...categories.map(c => c.total), 1);

  const getSphereColor = (cat: CategoryData) => {
    if (!cat.budget) return '#64748b'; // no budget → slate
    const ratio = cat.total / cat.budget.monthly_limit;
    if (ratio < 0.8) return '#10b981'; // green
    if (ratio < 1.0) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 h-80 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Import transactions to see the Spending Galaxy</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 overflow-hidden">
      <div className="flex items-center gap-2 p-5 border-b border-slate-700/50">
        <span className="text-lg">🌌</span>
        <h2 className="text-lg font-semibold text-white">Spending Galaxy</h2>
        <span className="ml-auto text-xs text-slate-500">Hover to explore · Click for details</span>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="h-80 lg:h-96 flex-1">
          <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.3} color="#818cf8" />
            <CenterStar />
            {categories.map((cat, i) => {
              const size = 0.2 + (cat.total / maxTotal) * 0.9;
              const orbitRadius = 1.5 + (i % 4) * 0.9;
              return (
                <OrbitingSphere
                  key={cat.name}
                  position={[0, 0, 0]}
                  size={size}
                  color={getSphereColor(cat)}
                  label={cat.name}
                  amount={cat.total}
                  onClick={() => setSelected(selected?.name === cat.name ? null : cat)}
                  orbitSpeed={0.15 + (i * 0.04)}
                  orbitRadius={orbitRadius}
                  orbitOffset={(i / categories.length) * Math.PI * 2}
                />
              );
            })}
            <OrbitControls enablePan={false} minDistance={4} maxDistance={14} />
          </Canvas>
        </div>

        {/* Side panel */}
        <div className="lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-700/50 p-4 overflow-y-auto max-h-96">
          {selected ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-lg leading-none">×</button>
              </div>
              <p className="text-xs text-slate-400 mb-3">Total: ₹{selected.total.toLocaleString('en-IN')}</p>
              <div className="space-y-2">
                {selected.transactions.map(t => (
                  <div key={t.id} className="flex justify-between text-xs rounded-lg bg-slate-700/40 px-3 py-2">
                    <div>
                      <p className="text-white font-medium">{t.merchant}</p>
                      <p className="text-slate-400">{t.date}</p>
                    </div>
                    <span className="text-rose-300 font-semibold">₹{t.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Categories</p>
              {categories.sort((a, b) => b.total - a.total).map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelected(cat)}
                  className="w-full flex justify-between text-xs rounded-lg bg-slate-700/30 hover:bg-slate-700/60 px-3 py-2 transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: getSphereColor(cat) }} />
                    <span className="text-slate-300">{cat.name}</span>
                  </span>
                  <span className="text-slate-400">₹{cat.total.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
