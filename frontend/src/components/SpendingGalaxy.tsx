'use client';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Transaction, Budget } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

interface CategoryData {
  name: string;
  total: number;
  budget?: Budget;
  transactions: Transaction[];
}

// ─── Camera intro animation ───────────────────────────────────────────────────
function CameraIntro() {
  const { camera } = useThree();
  const done = useRef(false);
  const t = useRef(0);
  useEffect(() => {
    camera.position.set(0, 12, 24);
  }, [camera]);
  useFrame((_, delta) => {
    if (done.current) return;
    t.current = Math.min(t.current + delta / 1.5, 1);
    const ease = 1 - Math.pow(1 - t.current, 3);
    camera.position.lerp(new THREE.Vector3(0, 4, 11), ease * 0.1);
    if (t.current >= 1) done.current = true;
  });
  return null;
}

// ─── Orbit ring ───────────────────────────────────────────────────────────────
function OrbitRing({ radius, isDark }: { radius: number; isDark: boolean }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 8, 80]} />
      <meshBasicMaterial
        color={isDark ? '#334155' : '#cbd5e1'}
        transparent opacity={0.4}
      />
    </mesh>
  );
}

// ─── Orbiting sphere ──────────────────────────────────────────────────────────
interface SphereProps {
  size: number;
  color: string;
  label: string;
  amount: number;
  onClick: () => void;
  orbitSpeed: number;
  orbitRadius: number;
  orbitOffset: number;
  onPositionUpdate?: (pos: THREE.Vector3) => void;
}

function OrbitingSphere({
  size, color, label, amount, onClick,
  orbitSpeed, orbitRadius, orbitOffset, onPositionUpdate
}: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);
  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const currentColor = useRef(new THREE.Color(color));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * orbitSpeed + orbitOffset;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(t * 0.8 + orbitOffset) * 0.18; // gentle bob

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += 0.008;

    // Smooth scale lerp
    const targetScale = hovered ? 1.25 : 1;
    scaleRef.current += (targetScale - scaleRef.current) * 0.12;
    meshRef.current.scale.setScalar(scaleRef.current);

    // Color lerp
    currentColor.current.lerp(targetColor, 0.08);
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(currentColor.current);
    (meshRef.current.material as THREE.MeshStandardMaterial).emissive.copy(currentColor.current);
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = hovered ? 0.7 : 0.25;

    onPositionUpdate?.(meshRef.current.position);
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={0.25}
        roughness={0.25} metalness={0.5}
      />
      {hovered && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15,23,42,0.9)', color: 'white', borderRadius: 10,
            padding: '8px 14px', fontSize: 12, whiteSpace: 'nowrap',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            border: '1px solid rgba(148,163,184,0.2)',
            transform: 'translateY(-32px)',
          }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
            <div style={{ color: '#94a3b8' }}>₹{amount.toLocaleString('en-IN')}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Center star ─────────────────────────────────────────────────────────────
function CenterStar() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.4;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.3;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.4, 2]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} roughness={0.1} />
    </mesh>
  );
}

// ─── Loading state ────────────────────────────────────────────────────────────
function LoadingScene() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 0.9 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
    ref.current.scale.setScalar(s);
  });
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
      <Html center>
        <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 80, whiteSpace: 'nowrap', textAlign: 'center' }}>
          Loading your finances…
        </div>
      </Html>
    </>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────────
interface SceneProps {
  categories: CategoryData[];
  maxTotal: number;
  isDark: boolean;
  onSelect: (cat: CategoryData | null) => void;
  selected: CategoryData | null;
  getSphereColor: (c: CategoryData) => string;
}

function GalaxyScene({ categories, maxTotal, isDark, onSelect, selected, getSphereColor }: SceneProps) {
  return (
    <>
      <CameraIntro />
      <ambientLight intensity={isDark ? 0.3 : 0.7} />
      <pointLight position={[6, 6, 6]} intensity={isDark ? 1.2 : 0.8} />
      <pointLight position={[-6, -4, -4]} intensity={0.3} color="#818cf8" />

      <Stars radius={60} depth={40} count={400} factor={3} saturation={0} fade speed={0.5} />

      <CenterStar />

      {categories.map((cat, i) => {
        const size = 0.2 + (cat.total / maxTotal) * 0.85;
        const orbitRadius = 1.8 + (i % 4) * 0.85;
        return (
          <group key={cat.name}>
            <OrbitRing radius={orbitRadius} isDark={isDark} />
            <OrbitingSphere
              size={size}
              color={getSphereColor(cat)}
              label={cat.name}
              amount={cat.total}
              onClick={() => onSelect(selected?.name === cat.name ? null : cat)}
              orbitSpeed={0.14 + i * 0.03}
              orbitRadius={orbitRadius}
              orbitOffset={(i / Math.max(categories.length, 1)) * Math.PI * 2}
            />
          </group>
        );
      })}

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={isDark ? 0.8 : 0.3} />
      </EffectComposer>

      <OrbitControls
        enableDamping dampingFactor={0.06}
        enablePan={false}
        minDistance={4} maxDistance={18}
        makeDefault
      />
    </>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  loading?: boolean;
}

export default function SpendingGalaxy({ transactions, budgets, loading }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selected, setSelected] = useState<CategoryData | null>(null);

  const categories = useMemo<CategoryData[]>(() => {
    const map: Record<string, Transaction[]> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(t);
    });
    return Object.entries(map).map(([name, txns]) => ({
      name, total: txns.reduce((s, t) => s + t.amount, 0),
      budget: budgets.find(b => b.category === name),
      transactions: txns,
    }));
  }, [transactions, budgets]);

  const maxTotal = useMemo(() => Math.max(...categories.map(c => c.total), 1), [categories]);

  const getSphereColor = (cat: CategoryData): string => {
    if (!cat.budget) return '#64748b';
    const ratio = cat.total / cat.budget.monthly_limit;
    if (ratio < 0.8) return '#10b981';
    if (ratio < 1.0) return '#f59e0b';
    return '#ef4444';
  };

  const bgColor = isDark ? '#020617' : '#f1f5f9';

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700/50 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/70 transition-colors duration-300">
        <span className="text-lg">🌌</span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Galaxy</h2>
        <span className="ml-auto text-xs text-gray-400 dark:text-slate-500">
          {loading ? 'Loading…' : categories.length === 0 ? 'Upload data to populate' : 'Drag · Scroll · Click spheres'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Canvas */}
        <div className="h-80 lg:h-96 flex-1" style={{ background: bgColor }}>
          <Canvas camera={{ position: [0, 12, 24], fov: 50 }} gl={{ antialias: true }}>
            {loading ? (
              <>
                <ambientLight intensity={0.4} />
                <LoadingScene />
              </>
            ) : categories.length === 0 ? (
              <>
                <ambientLight intensity={0.4} />
                <mesh>
                  <sphereGeometry args={[0.7, 32, 32]} />
                  <meshStandardMaterial color="#334155" emissive="#334155" emissiveIntensity={0.3} />
                </mesh>
                <Html center>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 70, whiteSpace: 'nowrap', textAlign: 'center' }}>
                    Upload transactions to see<br />your spending galaxy
                  </div>
                </Html>
              </>
            ) : (
              <GalaxyScene
                categories={categories}
                maxTotal={maxTotal}
                isDark={isDark}
                onSelect={setSelected}
                selected={selected}
                getSphereColor={getSphereColor}
              />
            )}
          </Canvas>
        </div>

        {/* Side panel */}
        <div className={`border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-y-auto transition-all duration-300 ${selected ? 'lg:w-72 max-h-96' : 'lg:w-56 max-h-96'}`}>
          {selected ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl leading-none transition">×</button>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 font-medium">
                Total: ₹{selected.total.toLocaleString('en-IN')}
                {selected.budget && (
                  <span className={` ml-2 px-1.5 py-0.5 rounded text-xs ${selected.total > selected.budget.monthly_limit ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'}`}>
                    {selected.total > selected.budget.monthly_limit ? 'Over budget' : 'On track'}
                  </span>
                )}
              </p>
              <div className="space-y-2">
                {selected.transactions.map(t => (
                  <div key={t.id} className="flex justify-between text-xs rounded-lg bg-gray-50 dark:bg-slate-700/40 px-3 py-2 transition-colors">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{t.merchant}</p>
                      <p className="text-gray-400 dark:text-slate-400">{t.date}</p>
                    </div>
                    <span className="text-rose-600 dark:text-rose-300 font-semibold">₹{t.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs text-gray-400 dark:text-slate-400 mb-3 font-medium uppercase tracking-wider">Categories</p>
              {categories.sort((a, b) => b.total - a.total).map(cat => (
                <button key={cat.name} onClick={() => setSelected(cat)}
                  className="w-full flex justify-between text-xs rounded-lg bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/60 px-3 py-2 mb-1.5 transition text-left">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: getSphereColor(cat) }} />
                    <span className="text-gray-700 dark:text-slate-300 truncate max-w-[100px]">{cat.name}</span>
                  </span>
                  <span className="text-gray-500 dark:text-slate-400 ml-2">₹{cat.total.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
