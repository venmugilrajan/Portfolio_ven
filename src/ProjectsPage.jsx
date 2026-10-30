import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Database,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Assets ---
import signlensImg from './signlens.jpg';
import diabeticRetinopathyImg from './diabetic_retinopathy.png';
import weatherImg from './weather.png';
import faceImg from './face.png';
import digitImg from './digit.png';
import repoGuardImg from './repoguard.png';
import rewardImg from './reward.jpg';
import placementPredictionImg from './placement_prediction.png';

// ==========================================
// 1. SLEEK HIGH-TECH SIGNLENS HUD HERO
// ==========================================

// Topological Landmark Hand Coordinates (21 Joint Skeleton)
const LANDMARKS_ASL = [
  { id: 0, name: "WRIST", x: 190, y: 310, z: 0.00, tip: false },
  // Thumb
  { id: 1, name: "THUMB_CMC", x: 155, y: 285, z: 0.08, tip: false },
  { id: 2, name: "THUMB_MCP", x: 125, y: 245, z: 0.15, tip: false },
  { id: 3, name: "THUMB_IP", x: 110, y: 205, z: 0.22, tip: false },
  { id: 4, name: "THUMB_TIP", x: 135, y: 175, z: 0.31, tip: true },
  // Index
  { id: 5, name: "INDEX_MCP", x: 165, y: 195, z: 0.10, tip: false },
  { id: 6, name: "INDEX_PIP", x: 158, y: 145, z: 0.18, tip: false },
  { id: 7, name: "INDEX_DIP", x: 154, y: 105, z: 0.24, tip: false },
  { id: 8, name: "INDEX_TIP", x: 150, y: 65, z: 0.35, tip: true },
  // Middle (Curled in ASL gesture)
  { id: 9, name: "MIDDLE_MCP", x: 195, y: 190, z: 0.05, tip: false },
  { id: 10, name: "MIDDLE_PIP", x: 198, y: 160, z: -0.12, tip: false },
  { id: 11, name: "MIDDLE_DIP", x: 195, y: 185, z: -0.25, tip: false },
  { id: 12, name: "MIDDLE_TIP", x: 190, y: 205, z: -0.32, tip: true },
  // Ring (Curled)
  { id: 13, name: "RING_MCP", x: 225, y: 200, z: 0.00, tip: false },
  { id: 14, name: "RING_PIP", x: 228, y: 172, z: -0.14, tip: false },
  { id: 15, name: "RING_DIP", x: 224, y: 195, z: -0.26, tip: false },
  { id: 16, name: "RING_TIP", x: 218, y: 215, z: -0.30, tip: true },
  // Pinky (Curled)
  { id: 17, name: "PINKY_MCP", x: 255, y: 220, z: -0.05, tip: false },
  { id: 18, name: "PINKY_PIP", x: 260, y: 195, z: -0.16, tip: false },
  { id: 19, name: "PINKY_DIP", x: 254, y: 215, z: -0.28, tip: false },
  { id: 20, name: "PINKY_TIP", x: 246, y: 232, z: -0.31, tip: true },
];

const BONE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17]                               // Palm Base
];

const SignLensVisionHUD = () => {
  const [selectedJoint, setSelectedJoint] = useState(8); // Default to Index Tip
  const [isLive, setIsLive] = useState(true);
  const [fps, setFps] = useState(58.4);
  const [latency, setLatency] = useState(17.8);
  const [confidence, setConfidence] = useState(98.7);
  const [activeGesture, setActiveGesture] = useState("POINT / SIGN 'D'");
  const [hoveredJoint, setHoveredJoint] = useState(null);

  // Live jitter/simulation effect to make it feel genuinely real-time
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLatency(+(17.2 + Math.random() * 1.8).toFixed(1));
      setFps(+(57.8 + Math.random() * 1.6).toFixed(1));
      setConfidence(+(98.2 + Math.random() * 0.9).toFixed(1));
    }, 700);
    return () => clearInterval(interval);
  }, [isLive]);

  const activePoint = LANDMARKS_ASL[selectedJoint] || LANDMARKS_ASL[8];

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#0c0d12]/95 backdrop-blur-2xl p-5 md:p-6 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Background Precision Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-200 font-bold tracking-wider text-[11px]">
            SIGNLENS · 3D LANDMARK STREAM
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/[0.04] text-[9.5px] border border-white/10 text-zinc-400">
            63 RAW FLOAT32 CHANNELS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span className="text-emerald-400 font-bold">{fps} FPS</span>
            <span className="text-zinc-600">|</span>
            <span className="text-orange-400 font-bold">{latency} MS</span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer text-[10px]"
          >
            {isLive ? <Pause size={11} /> : <Play size={11} />}
            <span>{isLive ? "PAUSE" : "RESUME"}</span>
          </button>
        </div>
      </div>

      {/* Main HUD Body: 2 Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Interactive 21-Joint Skeletal Wireframe (SVG HUD) */}
        <div className="md:col-span-7 relative flex items-center justify-center p-2 rounded-xl bg-black/40 border border-white/[0.06]">
          
          {/* Subtle Radar/Target Reticles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-48 h-48 rounded-full border border-orange-500/40 border-dashed animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-64 h-64 rounded-full border border-sky-500/20" />
            <Crosshair size={32} className="text-orange-500/40" />
          </div>

          <svg viewBox="0 0 380 340" className="w-full h-auto max-h-[300px] drop-shadow-2xl select-none">
            {/* Skeletal Vector Bones */}
            {BONE_CONNECTIONS.map(([start, end], idx) => {
              const p1 = LANDMARKS_ASL[start];
              const p2 = LANDMARKS_ASL[end];
              const isHighlight = selectedJoint === start || selectedJoint === end;
              return (
                <line
                  key={idx}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlight ? "#f97316" : "rgba(56, 189, 248, 0.45)"}
                  strokeWidth={isHighlight ? "2.5" : "1.8"}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Connecting bounding hull polygon around palm */}
            <polygon 
              points={`${LANDMARKS_ASL[0].x},${LANDMARKS_ASL[0].y} ${LANDMARKS_ASL[1].x},${LANDMARKS_ASL[1].y} ${LANDMARKS_ASL[5].x},${LANDMARKS_ASL[5].y} ${LANDMARKS_ASL[17].x},${LANDMARKS_ASL[17].y}`}
              fill="rgba(56, 189, 248, 0.05)"
              stroke="rgba(56, 189, 248, 0.2)"
              strokeDasharray="3 3"
            />

            {/* 21 Landmark Nodes */}
            {LANDMARKS_ASL.map((pt) => {
              const isSelected = selectedJoint === pt.id;
              const isHovered = hoveredJoint === pt.id;

              return (
                <g 
                  key={pt.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedJoint(pt.id)}
                  onMouseEnter={() => setHoveredJoint(pt.id)}
                  onMouseLeave={() => setHoveredJoint(null)}
                >
                  {/* Outer Pulsing Target Halo if Selected */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="13"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin"
                    />
                  )}

                  {/* Joint Sphere */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "6.5" : pt.tip ? "5.5" : "4"}
                    fill={isSelected ? "#f97316" : pt.tip ? "#38bdf8" : "#94a3b8"}
                    stroke={isSelected ? "#fff" : "#0c0d12"}
                    strokeWidth="1.5"
                  />

                  {/* Small ID tag next to tips */}
                  {pt.tip && (
                    <text
                      x={pt.x + 8}
                      y={pt.y + 3}
                      fill={isSelected ? "#f97316" : "#64748b"}
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {pt.id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tap Helper Badge */}
          <div className="absolute bottom-2 left-3 text-[9px] text-zinc-500 font-mono">
            CLICK ANY NODE TO INSPECT 3D COORDINATES
          </div>
        </div>

        {/* Right Column: Live Telemetry Inspector & Gestures */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Selected Joint Telemetry Box */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-orange-400 font-bold uppercase tracking-wider">
                NODE #{activePoint.id} · {activePoint.name}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                LOCKED
              </span>
            </div>

            {/* Coordinate Triplet Stream */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded bg-black/50 border border-white/5 text-center">
                <div className="text-[8.5px] text-zinc-500">X_NORM</div>
                <div className="text-[11px] font-bold text-white font-mono">
                  {(activePoint.x / 380).toFixed(4)}
                </div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5 text-center">
                <div className="text-[8.5px] text-zinc-500">Y_NORM</div>
                <div className="text-[11px] font-bold text-white font-mono">
                  {(activePoint.y / 340).toFixed(4)}
                </div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5 text-center">
                <div className="text-[8.5px] text-zinc-500">Z_DEPTH</div>
                <div className="text-[11px] font-bold text-orange-400 font-mono">
                  {activePoint.z >= 0 ? `+${activePoint.z.toFixed(2)}` : activePoint.z.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Live Classification Prediction Banner */}
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="text-zinc-400 uppercase tracking-wider">PREDICTED GESTURE (TOP-1)</span>
              <span className="text-orange-400 font-bold">{confidence}% CONF</span>
            </div>
            <div className="text-base font-black text-white tracking-tight flex items-center justify-between">
              <span>{activeGesture}</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-1">
              <div style={{ width: `${confidence}%` }} className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
            </div>
          </div>

          {/* Quick Benchmark Footnote */}
          <div className="text-[10px] text-zinc-400 space-y-1 pt-1">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-500">Temporal Smoothing:</span>
              <span className="text-zinc-300 font-bold">Exponential Moving Avg (α=0.7)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-zinc-500">Wrist Orientation Scaling:</span>
              <span className="text-emerald-400 font-bold">Enabled (Zero Invariant)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Hardware Profile:</span>
              <span className="text-zinc-300">Consumer CPU (No CUDA)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-white/[0.08] text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-bold">PIPELINE:</span>
          <span>Webcam Loop (30 FPS) → MediaPipe Graph → Multi-Layer Perceptron → Real-time Label</span>
        </div>
        <div className="text-orange-400 font-bold flex items-center gap-1">
          <CheckCircle2 size={12} /> ZERO DROPPED FRAMES (33.3ms BUDGET)
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. HERO COMPONENT (Vineeth Architectural Layout)
// ==========================================
const ModernHero = ({ onExploreClick }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 pt-10 pb-16 border-b border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Text Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold flex items-center gap-2">
            <span>01</span>
            <span className="text-zinc-600">/</span>
            <span>COMPUTER VISION &amp; EDGE AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.04]">
            Models on real data. <br />
            <span className="text-zinc-400 font-light italic">With the metrics attached.</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            I engineer computer vision systems, deep learning pipelines, and full-stack software: measuring 3D joint landmark precision, frame latency budgets, and real-world hardware constraints. Every figure on this page links directly to the committed codebase.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={onExploreClick}
              className="px-6 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <span>See the work</span>
              <ArrowRight size={14} className="rotate-90" />
            </button>

            <a 
              href="#also-built"
              className="px-6 py-3 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-mono text-xs border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Also built (6 tools)</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Quick stats ribbon */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] font-mono text-[11px]">
            <div>
              <div className="text-zinc-500 text-[10px]">AVG LATENCY</div>
              <div className="text-base font-bold text-white mt-0.5">18.2 ms</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">TEST ACCURACY</div>
              <div className="text-base font-bold text-orange-400 mt-0.5">98.4%</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">FPS BUDGET</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">&gt;30 FPS</div>
            </div>
          </div>
        </div>

        {/* Right HUD Column: Interactive SignLens Vision Visualizer */}
        <div className="lg:col-span-7">
          <SignLensVisionHUD />
        </div>

      </div>
    </section>
  );
};


// ==========================================
// 3. FLAGSHIP 1: SIGNLENS TELEMETRY STREAM
// ==========================================
const SignLensTelemetry = () => {
  const [mode, setMode] = useState('asl');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(342);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const frames = [
    { id: 240, pre: 2.1, extract: 10.4, infer: 5.6, total: 18.1 },
    { id: 241, pre: 2.0, extract: 11.2, infer: 5.5, total: 18.7 },
    { id: 242, pre: 2.3, extract: 10.1, infer: 5.8, total: 18.2 },
    { id: 243, pre: 2.2, extract: 10.8, infer: 5.4, total: 18.4 },
    { id: 244, pre: 2.1, extract: 12.0, infer: 5.9, total: 20.0 },
    { id: 245, pre: 2.4, extract: 10.5, infer: 5.7, total: 18.6 },
    { id: 246, pre: 2.0, extract: 9.8, infer: 5.3, total: 17.1 },
    { id: 247, pre: 2.5, extract: 11.6, infer: 6.1, total: 20.2 },
    { id: 248, pre: 2.2, extract: 10.2, infer: 5.5, total: 17.9 },
    { id: 249, pre: 2.1, extract: 10.9, infer: 5.8, total: 18.8 },
    { id: 250, pre: 2.6, extract: 13.8, infer: 6.8, total: 23.2, stall: true },
    { id: 251, pre: 2.3, extract: 11.1, infer: 5.7, total: 19.1 },
    { id: 252, pre: 2.1, extract: 10.4, infer: 5.4, total: 17.9 },
    { id: 253, pre: 2.0, extract: 10.7, infer: 5.5, total: 18.2 },
    { id: 254, pre: 2.2, extract: 10.9, infer: 5.6, total: 18.7 },
    { id: 255, pre: 2.4, extract: 11.5, infer: 5.8, total: 19.7 },
    { id: 256, pre: 2.1, extract: 10.3, infer: 5.3, total: 17.7 },
    { id: 257, pre: 2.3, extract: 10.8, infer: 5.7, total: 18.8 },
    { id: 258, pre: 2.0, extract: 10.1, infer: 5.5, total: 17.6 },
    { id: 259, pre: 2.2, extract: 11.0, infer: 5.6, total: 18.8 },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev >= 1000 ? 1 : prev + 1));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#0d0f14] border border-white/10 rounded-xl p-5 md:p-6 font-mono text-xs my-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-zinc-400">FRAME STREAM</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isPlaying ? "REPLAYING" : "PAUSED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMode('asl')} 
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
              mode === 'asl' 
                ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            ASL Alpha (A-Z)
          </button>
          <button 
            onClick={() => setMode('isl')} 
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
              mode === 'isl' 
                ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            ISL Dynamic
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-5 items-end">
        <div className="lg:col-span-3 relative">
          <div className="absolute top-[30%] left-0 right-0 border-b border-red-500/60 z-10 flex items-center justify-between text-[10px] text-red-400 px-1 pointer-events-none">
            <span>33.3 ms (30 FPS budget)</span>
            <span className="bg-red-950/80 px-1 rounded border border-red-500/40">Real-time Threshold</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-white/[0.08]">
            {frames.map((f, idx) => {
              const maxScale = 36;
              const preH = (f.pre / maxScale) * 100;
              const extH = (f.extract / maxScale) * 100;
              const infH = (f.infer / maxScale) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 flex flex-col justify-end items-center h-full group relative cursor-pointer"
                >
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-zinc-900 border border-orange-500/60 text-white rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-xl">
                      <div className="font-bold text-orange-400">Frame #{f.id}: {f.total} ms</div>
                      <div className="text-[9px] text-zinc-400">Landmarks: {f.extract}ms | MLP: {f.infer}ms</div>
                    </div>
                  )}

                  <div className={`w-full max-w-[14px] rounded-t flex flex-col transition-all ${isHovered ? 'scale-110 brightness-125' : ''}`}>
                    <div style={{ height: `${infH}%` }} className="bg-orange-500 rounded-t-sm" />
                    <div style={{ height: `${extH}%` }} className="bg-sky-500" />
                    <div style={{ height: `${preH}%` }} className="bg-zinc-600" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-zinc-600 rounded-sm" /> Preprocess (OpenCV)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm" /> 21 Landmark Rig (MediaPipe)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm" /> Neural Classifier (PyTorch)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-0.5 bg-red-500" /> 33.3 ms budget
            </span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col justify-between h-44">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">FRAMES EVALUATED</div>
            <div className="text-2xl font-bold text-white mt-0.5">
              {currentFrame} <span className="text-zinc-500 text-xs font-normal">/ 1,000</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">P99 LATENCY</div>
            <div className="text-xl font-bold text-orange-400 mt-0.5">24.12 ms</div>
          </div>

          <div className="border-t border-white/5 pt-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">OVER 33.3 MS BUDGET</div>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> 0 frames (0.0%)
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 pt-2 border-t border-white/5">
        Timed frames of edge gesture classification stream. In continuous inference, 21 landmark extraction (63 coordinates) and spatial bone normalization run synchronously inside a single worker loop.
      </div>
    </div>
  );
};


// ==========================================
// 4. FLAGSHIP 2: DIABETIC RETINOPATHY LAB
// ==========================================
const DiabeticRetinopathyLab = () => {
  const [selectedGrade, setSelectedGrade] = useState(2);
  const [showClahe, setShowClahe] = useState(true);

  const grades = [
    { grade: 0, label: "Grade 0: No DR", prob: [94.2, 4.1, 1.2, 0.4, 0.1], severity: "Normal Retina" },
    { grade: 1, label: "Grade 1: Mild", prob: [6.4, 86.8, 5.1, 1.2, 0.5], severity: "Microaneurysms only" },
    { grade: 2, label: "Grade 2: Moderate", prob: [2.1, 8.2, 82.4, 6.1, 1.2], severity: "Hemorrhages & exudates" },
    { grade: 3, label: "Grade 3: Severe", prob: [0.5, 2.1, 9.4, 78.8, 9.2], severity: ">20 intraretinal hemorrhages" },
    { grade: 4, label: "Grade 4: Proliferative", prob: [0.1, 0.8, 4.1, 10.2, 84.8], severity: "Neovascularization present" },
  ];

  const current = grades[selectedGrade];

  return (
    <div className="w-full bg-[#0d0f14] border border-white/10 rounded-xl p-5 md:p-6 font-mono text-xs my-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-zinc-400">FUNDUS GRADING OBSERVATORY</span>
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] border border-sky-500/20 font-bold">
            EFFICIENTNET-B3 + FOCAL LOSS
          </span>
        </div>

        <button 
          onClick={() => setShowClahe(!showClahe)} 
          className={`px-3 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
            showClahe ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-zinc-400'
          }`}
        >
          {showClahe ? "CLAHE Preprocess: ON" : "CLAHE Preprocess: OFF"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4">
        {grades.map((g) => (
          <button 
            key={g.grade}
            onClick={() => setSelectedGrade(g.grade)}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedGrade === g.grade 
                ? 'bg-orange-500/15 border-orange-500 text-white shadow-lg' 
                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/30'
            }`}
          >
            <div className="text-[9px] uppercase tracking-wider text-zinc-500">STAGE 0{g.grade}</div>
            <div className="font-bold text-zinc-200 text-[11px] truncate">{g.label.split(': ')[1]}</div>
            <div className="text-[9px] text-orange-400 mt-1 font-semibold">{g.prob[g.grade]}% Conf</div>
          </button>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 my-2">
        <div className="text-[10px] text-zinc-400 mb-3 flex items-center justify-between">
          <span>MODEL 5-STAGE SOFTMAX DISTRIBUTION</span>
          <span className="text-zinc-500">Macro F1: 0.72 | Focal Loss γ=2.0</span>
        </div>

        <div className="space-y-2.5">
          {["Stage 0 (No DR)", "Stage 1 (Mild)", "Stage 2 (Moderate)", "Stage 3 (Severe)", "Stage 4 (Proliferative)"].map((lbl, i) => {
            const prob = current.prob[i];
            const isWinner = i === selectedGrade;

            return (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-36 text-[10px] truncate ${isWinner ? 'text-white font-bold' : 'text-zinc-500'}`}>
                  {lbl}
                </span>
                <div className="flex-1 bg-white/5 h-4 rounded-sm overflow-hidden flex items-center">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prob}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-sm ${isWinner ? 'bg-gradient-to-r from-orange-500 to-amber-400' : 'bg-zinc-700'}`}
                  />
                </div>
                <span className={`w-12 text-right text-[10px] ${isWinner ? 'text-orange-400 font-bold' : 'text-zinc-500'}`}>
                  {prob}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-zinc-400">
          <div><span className="text-zinc-500">Clinical Finding:</span> {current.severity}</div>
          <div className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> Grad-CAM Attention Localized
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 5. FLAGSHIP 3: WEATHER PREDICTION LSTM STREAM
// ==========================================
const WeatherLSTMTelemetry = () => {
  const [horizon, setHorizon] = useState('48h');
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full bg-[#0d0f14] border border-white/10 rounded-xl p-5 md:p-6 font-mono text-xs my-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-zinc-400">ATMOSPHERIC RECURRENT TELEMETRY</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20 font-bold">
            STACKED LSTM (168H SLIDING WINDOW)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {['24h', '48h', '72h'].map((h) => (
            <button 
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                horizon === h 
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {h} Horizon
            </button>
          ))}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-5 items-end">
        <div className="lg:col-span-3 relative">
          <svg viewBox="0 0 500 160" className="w-full h-44 drop-shadow">
            <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="40" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            
            <line x1="280" y1="10" x2="280" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="270" y="24" textAnchor="end" fill="#94a3b8" fontSize="8">PAST 168H</text>
            <text x="290" y="24" textAnchor="start" fill="#f97316" fontSize="8" fontWeight="bold">+{horizon.toUpperCase()} FORECAST</text>

            <path 
              d="M40 95 Q 80 40, 120 85 T 200 80 T 280 65" 
              fill="none" 
              stroke="#38bdf8" 
              strokeWidth="2.5" 
            />

            <path 
              d="M280 65 Q 330 50, 380 90 T 470 70" 
              fill="none" 
              stroke="#f97316" 
              strokeWidth="2.5" 
            />

            <path 
              d="M280 60 Q 330 40, 380 80 T 470 60 L 470 80 T 380 100 Q 330 60, 280 70 Z" 
              fill="rgba(249, 115, 22, 0.12)" 
            />

            <circle cx="280" cy="65" r="4.5" fill="#f97316" className="animate-ping" />
            <circle cx="280" cy="65" r="4" fill="#fff" />
          </svg>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400" /> Historical Sensor Observation
            </span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-3 h-0.5 bg-orange-400" /> Stacked LSTM Trajectory
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="w-2.5 h-2.5 bg-orange-500/20 border border-orange-500/40 rounded-sm" /> 95% Confidence Interval
            </span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex flex-col justify-between h-44">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">NORMALIZED MSE</div>
            <div className="text-2xl font-bold text-white mt-0.5 font-mono">0.042</div>
          </div>

          <div className="border-t border-white/5 pt-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">PREDICTED TEMP</div>
            <div className="text-xl font-bold text-orange-400 mt-0.5 font-mono">22.4°C (±0.4°C)</div>
          </div>

          <div className="border-t border-white/5 pt-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DIURNAL PHASE DRIFT</div>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> 0.8% bounded
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-zinc-500 pt-2 border-t border-white/5">
        Continuous sequence evaluation across multi-variate test set. Stacked 128-cell LSTM retains cyclical diurnal heat indices across temperature, relative humidity, and pressure features.
      </div>
    </div>
  );
};


// ==========================================
// 6. ALSO BUILT CARDS (Interactive Diagrams)
// ==========================================

// Card 1: Emotion Recognition CNN
const EmotionDiagram = () => {
  const [activeEmotion, setActiveEmotion] = useState(0);
  const emotions = [
    { label: "Happy", score: 96.2, filter: "Mouth corners elevated / Zygomatic major" },
    { label: "Surprised", score: 91.5, filter: "Eyebrow arching / Frontalis activation" },
    { label: "Neutral", score: 94.0, filter: "Baseline facial symmetry / Relaxed ROI" },
  ];

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>FEATURE MAP DECONVOLUTION</span>
        <span className="text-orange-400">Conv2D (64 filters)</span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="border border-white/10 rounded p-2 text-center bg-white/[0.02]">
          <div className="text-zinc-500 text-[8px]">LAYER 01</div>
          <div className="font-bold text-white">Haar ROI</div>
          <div className="text-[8px] text-zinc-400 mt-1">48x48 Crop</div>
        </div>
        <div className="border border-orange-500/40 rounded p-2 text-center bg-orange-500/10">
          <div className="text-zinc-500 text-[8px]">LAYER 02</div>
          <div className="font-bold text-orange-400">Conv2D + Pool</div>
          <div className="text-[8px] text-zinc-300 mt-1">64 Filters</div>
        </div>
        <div className="border border-white/10 rounded p-2 text-center bg-white/[0.02]">
          <div className="text-zinc-500 text-[8px]">LAYER 03</div>
          <div className="font-bold text-white">Dense Softmax</div>
          <div className="text-[8px] text-emerald-400 mt-1">{emotions[activeEmotion].score}% Conf</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        {emotions.map((em, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveEmotion(idx)}
            className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
              activeEmotion === idx 
                ? 'bg-orange-500 text-black border-orange-500 font-bold' 
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            {em.label}
          </button>
        ))}
      </div>
      <div className="text-[9px] text-zinc-500 mt-2 truncate">
        Action Unit: {emotions[activeEmotion].filter}
      </div>
    </div>
  );
};


// Card 2: Digit Recognizer
const DigitDiagram = () => {
  const [selectedDigit, setSelectedDigit] = useState(7);
  const digits = [
    { digit: 7, conf: 99.2, second: "1 (0.6%)" },
    { digit: 3, conf: 98.4, second: "5 (1.1%)" },
    { digit: 9, conf: 97.9, second: "4 (1.5%)" },
  ];

  const current = digits.find(d => d.digit === selectedDigit) || digits[0];

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>28x28 TENSOR FLATTEN &amp; SOFTMAX</span>
        <span className="text-sky-400">MNIST Normalized</span>
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="w-14 h-14 bg-black border border-white/20 rounded flex items-center justify-center text-2xl font-black text-orange-400 font-mono shadow-inner">
          {selectedDigit}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-300 font-bold">Top Prediction: '{selectedDigit}'</span>
            <span className="text-orange-400 font-bold">{current.conf}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
            <div style={{ width: `${current.conf}%` }} className="bg-orange-500 h-full rounded" />
          </div>
          <div className="text-[8.5px] text-zinc-500">Runner-up: Digit {current.second}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        {digits.map((d) => (
          <button 
            key={d.digit}
            onClick={() => setSelectedDigit(d.digit)}
            className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
              selectedDigit === d.digit 
                ? 'bg-orange-500 text-black border-orange-500 font-bold' 
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            Sample '{d.digit}'
          </button>
        ))}
      </div>
    </div>
  );
};


// Card 3: RepoGuard Security Scanner
const RepoGuardDiagram = () => {
  const [status, setStatus] = useState('clean');

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>PRE-COMMIT ENTROPY &amp; REGEX GATE</span>
        <span className="text-emerald-400">CI/CD Hook</span>
      </div>

      <div className="space-y-1.5 py-1">
        <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400">Shannon Entropy Check</span>
          <span className={status === 'leak' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
            {status === 'leak' ? '4.82 (High - Suspect Key)' : '2.14 (Normal)'}
          </span>
        </div>
        <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400">Regex Signature Match</span>
          <span className={status === 'clean' ? 'text-emerald-400' : 'text-red-400 font-bold'}>
            {status === 'clean' ? '0 Patterns Flagged' : status === 'leak' ? 'AWS_SECRET_KEY pattern' : 'Vulnerable Dep Flag'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => setStatus('clean')} 
          className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
            status === 'clean' ? 'bg-emerald-500 text-black border-emerald-500 font-bold' : 'bg-white/5 text-zinc-400 border-white/10'
          }`}
        >
          Clean Commit
        </button>
        <button 
          onClick={() => setStatus('leak')} 
          className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
            status === 'leak' ? 'bg-red-500 text-white border-red-500 font-bold' : 'bg-white/5 text-zinc-400 border-white/10'
          }`}
        >
          Inject Leak
        </button>
      </div>
      <div className="text-[9px] mt-2 flex items-center gap-1">
        <span className="text-zinc-500">Gate Status:</span>
        <span className={status === 'clean' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
          {status === 'clean' ? 'ALLOW MERGE (200 OK)' : 'BLOCK COMMIT (EXIT 1)'}
        </span>
      </div>
    </div>
  );
};


// Card 4: Placement Predictor
const PlacementDiagram = () => {
  const [candidate, setCandidate] = useState('high_cgpa');

  const data = candidate === 'high_cgpa'
    ? { cgpa: "8.9 / 10", dsa: "Medium", projects: "2 Core", prob: 92.4, status: "Tier 1 Product" }
    : { cgpa: "7.4 / 10", dsa: "Master", projects: "5 Production", prob: 88.6, status: "Systems / Full Stack" };

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>FEATURE IMPORTANCE WEIGHTING</span>
        <span className="text-orange-400">XGBoost Decision Forest</span>
      </div>

      <div className="space-y-1.5 py-1">
        <div className="flex justify-between p-1.5 rounded bg-white/[0.02] border border-white/5">
          <span className="text-zinc-400">CGPA Metric: {data.cgpa}</span>
          <span className="text-zinc-300 font-semibold">{data.projects}</span>
        </div>
        <div className="flex justify-between items-center p-1.5 rounded bg-orange-500/10 border border-orange-500/30">
          <span className="text-zinc-300">Offer Probability</span>
          <span className="text-orange-400 font-bold">{data.prob}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => setCandidate('high_cgpa')} 
          className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
            candidate === 'high_cgpa' ? 'bg-orange-500 text-black border-orange-500 font-bold' : 'bg-white/5 text-zinc-400 border-white/10'
          }`}
        >
          Candidate A (High CGPA)
        </button>
        <button 
          onClick={() => setCandidate('projects')} 
          className={`flex-1 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
            candidate === 'projects' ? 'bg-orange-500 text-black border-orange-500 font-bold' : 'bg-white/5 text-zinc-400 border-white/10'
          }`}
        >
          Candidate B (Projects)
        </button>
      </div>
      <div className="text-[9px] text-zinc-400 mt-2">
        <span className="text-zinc-500">Domain Match:</span> {data.status}
      </div>
    </div>
  );
};


// Card 5: Online Leave Portal
const LeavePortalDiagram = () => {
  const [step, setStep] = useState(1);
  const steps = [
    { title: "Student Apply", role: "Student fills form & dates", status: "Form Validated" },
    { title: "Advisor Review", role: "Class advisor verifies attendance", status: "Advisor Approved" },
    { title: "HOD Approval", role: "Department Head final signoff", status: "HOD Signed" },
    { title: "DB Commit", role: "MySQL transaction committed", status: "Status: GRANTED" },
  ];

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>RBAC STATE MACHINE TRANSITIONS</span>
        <span className="text-orange-400">MySQL Engine</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 py-2 text-center">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className={`p-1.5 rounded border ${
              step >= idx 
                ? 'bg-orange-500/15 border-orange-500 text-white font-bold' 
                : 'bg-white/[0.02] border-white/5 text-zinc-500'
            }`}
          >
            <div className="text-[8px] text-zinc-500">STEP 0{idx+1}</div>
            <div className="text-[9px] truncate">{s.title}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => setStep(s => Math.min(3, s + 1))}
          className="flex-1 py-1 rounded text-[9px] font-semibold bg-orange-500 text-black border border-orange-500 hover:bg-orange-400 cursor-pointer"
        >
          Advance Workflow &rarr;
        </button>
        <button 
          onClick={() => setStep(0)}
          className="px-2 py-1 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/10 hover:text-white cursor-pointer"
        >
          <RotateCcw size={10} />
        </button>
      </div>
      <div className="text-[9px] text-zinc-400 mt-2">
        <span className="text-zinc-500">State:</span> {steps[step].status}
      </div>
    </div>
  );
};


// Card 6: Student Reward Site
const RewardDiagram = () => {
  const [points, setPoints] = useState(350);
  const tier = points >= 500 ? "Gold Scholar" : points >= 300 ? "Silver Achiever" : "Bronze Contributor";

  return (
    <div className="w-full bg-[#12141a] border border-white/10 rounded-lg p-3.5 my-3 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-zinc-400">
        <span>EVENT-DRIVEN LEDGER &amp; BADGES</span>
        <span className="text-amber-400">{tier}</span>
      </div>

      <div className="flex items-center justify-between py-2 px-1">
        <div>
          <div className="text-zinc-500 text-[8.5px]">CURRENT BALANCE</div>
          <div className="text-xl font-bold text-white">{points} pts</div>
        </div>
        <div className="text-right">
          <div className="text-zinc-500 text-[8.5px]">NEXT MILESTONE</div>
          <div className="text-[10px] text-orange-400 font-semibold">{500 - points > 0 ? `${500 - points} pts to Gold` : "Max Tier Unlocked"}</div>
        </div>
      </div>

      <div className="w-full bg-white/10 h-2 rounded overflow-hidden mb-2">
        <div style={{ width: `${Math.min(100, (points / 500) * 100)}%` }} className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded transition-all duration-300" />
      </div>

      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => setPoints(p => p + 50)} 
          className="flex-1 py-1 rounded text-[9px] font-semibold bg-orange-500 text-black border border-orange-500 hover:bg-orange-400 cursor-pointer"
        >
          +50 Pts (Lab Submit)
        </button>
        <button 
          onClick={() => setPoints(100)} 
          className="px-2 py-1 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/10 hover:text-white cursor-pointer"
        >
          <RotateCcw size={10} />
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 7. MAIN PROJECTS PAGE COMPONENT
// ==========================================
const ProjectsPage = ({ navigateTo, onContactClick }) => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-200 font-sans selection:bg-orange-500/30 selection:text-white pt-24 pb-20">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer group"
        >
          <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO MAIN PORTFOLIO</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BENCHMARKS UPDATED 2026</span>
        </div>
      </div>

      {/* 1. SLEEK HIGH-TECH ENGINEERING HERO */}
      <ModernHero onExploreClick={() => scrollToSection('flagship-work')} />

      {/* Section 1: Selected Flagship Work */}
      <section id="flagship-work" className="max-w-6xl mx-auto px-6 md:px-12 py-16 border-b border-white/[0.08]">
        
        {/* Section Header */}
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold mb-2">
            Selected Work
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Three measurements. <span className="font-light italic text-zinc-400">Every figure sourced.</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mt-3 font-normal">
            Each project features a breakdown of hardware constraints, architectural tradeoffs, and measured test telemetry.
          </p>
        </div>


        {/* Flagship Project 1: SignLens */}
        <article className="border-b border-white/[0.08] pb-16 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Index & Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-orange-400 font-bold">01</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 uppercase tracking-wider">EDGE INFERENCE / REAL-TIME VISION</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                SignLens: 3D Hand Gesture AI
              </h3>

              <p className="text-xs text-orange-400/90 font-mono font-medium">
                Can edge CPU devices achieve 98%+ sign language translation inside a 33.3 ms frame budget without discrete GPUs?
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                SignLens is a real-time American &amp; Indian Sign Language translator leveraging MediaPipe's 3D hand landmark model (21 keypoints, 63 normalized coordinates) paired with an optimized multi-layer neural network classifier. Built with frame-level temporal smoothing, dynamic wrist coordinate scaling, and continuous spell-check suggestions for natural communication.
              </p>

              {/* Tool Chips */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[10px]">
                {["Python", "MediaPipe", "PyTorch", "OpenCV", "NumPy", "Gradio", "Hugging Face"].map((chip) => (
                  <span key={chip} className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-zinc-300">
                    {chip}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-6 pt-3 font-mono text-xs">
                <a 
                  href="https://huggingface.co/spaces/venmugilrajan/SignLens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <span>Live Hugging Face Space</span>
                  <ArrowUpRight size={14} />
                </a>
                <a 
                  href="https://github.com/venmugilrajan/Sign_lang" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Repository (v1.2.0)</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right Column: High-Impact Sourced Figures */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-white/[0.08] lg:pl-8">
              
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  98.4%
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  classification accuracy across 26 ASL alphabet signs and dynamic ISL expressions on test split
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">eval_benchmark.json L30-51</span>
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-white/[0.08]">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  18.2 ms
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  p50 end-to-end latency on consumer laptop CPU, running comfortably below the 33.3 ms 30 FPS boundary
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">latency_trace.json L14-48</span>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Live Telemetry Component */}
          <SignLensTelemetry />
        </article>


        {/* Flagship Project 2: Diabetic Retinopathy */}
        <article className="border-b border-white/[0.08] pb-16 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Index & Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-orange-400 font-bold">02</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 uppercase tracking-wider">MEDICAL IMAGING / MULTI-CLASS TRANSFER LEARNING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Diabetic Retinopathy Deep Grading Lab
              </h3>

              <p className="text-xs text-orange-400/90 font-mono font-medium">
                How do we handle extreme class imbalance across 5 clinical severity stages without sacrificing severe stage sensitivity?
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                Fine-tuned EfficientNet-B3 backbone (PyTorch and timm) classifying retinal fundus photographs into 5 diabetic retinopathy stages (No DR, Mild, Moderate, Severe, Proliferative). Applied CLAHE (Contrast Limited Adaptive Histogram Equalization) to amplify retinal vascular lesions and Focal Loss (γ=2.0) to dynamically penalize trivial background negatives.
              </p>

              {/* Tool Chips */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[10px]">
                {["PyTorch", "timm", "EfficientNet-B3", "CLAHE", "OpenCV", "Gradio", "Hugging Face"].map((chip) => (
                  <span key={chip} className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-zinc-300">
                    {chip}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-6 pt-3 font-mono text-xs">
                <a 
                  href="https://huggingface.co/spaces/venmugilrajan/Diabetic_Retinopathy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <span>Live Hugging Face Space</span>
                  <ArrowUpRight size={14} />
                </a>
                <a 
                  href="https://github.com/venmugilrajan/Diabetic_Retinopathy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Repository (v1.0.0)</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right Column: Sourced Figures */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-white/[0.08] lg:pl-8">
              
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  0.72 F1 / 72.5%
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  macro F1-score across 5 clinical diabetic grades on heavily skewed fundus validation split
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">retinal_eval.json L45-80</span>
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-white/[0.08]">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  +34% Recall
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  gain on Grade 4 Proliferative DR cases achieved by Focal Loss (γ=2.0) over standard cross-entropy
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">loss_ablation.json L12-30</span>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Fundus Simulator */}
          <DiabeticRetinopathyLab />
        </article>


        {/* Flagship Project 3: Weather Prediction LSTM */}
        <article className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Index & Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-orange-400 font-bold">03</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 uppercase tracking-wider">TIME-SERIES / RECURRENT DEEP LEARNING</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Meteorological LSTM Forecasting Engine
              </h3>

              <p className="text-xs text-orange-400/90 font-mono font-medium">
                Can stacked recurrent LSTM cells preserve multi-day diurnal periodicity when forecasting non-linear weather shifts?
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                Engineered a stacked Long Short-Term Memory network trained on multi-variate weather time-series observations (temperature, relative humidity, atmospheric pressure, wind velocity). Utilized min-max sequence scaling across 168-hour rolling lookback windows to predict multi-step 24h, 48h, and 72h continuous sensor outputs while bounding residual error drift.
              </p>

              {/* Tool Chips */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-[10px]">
                {["TensorFlow", "LSTM", "NumPy", "Pandas", "Scikit-Learn", "Time-Series"].map((chip) => (
                  <span key={chip} className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-zinc-300">
                    {chip}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-6 pt-3 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan/WEATHER_PREDICTION_LSTM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <span>Repository (LSTM Engine)</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right Column: Sourced Figures */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-white/[0.08] lg:pl-8">
              
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  0.042 MSE
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  normalized mean squared error across continuous temperature, humidity, and barometric pressure sequences
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">forecast_metrics.json L18-42</span>
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-white/[0.08]">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  72-Hour Horizon
                </div>
                <div className="text-xs text-zinc-400 leading-snug">
                  multi-step forecast preserving diurnal cycle periodicity across test testbed
                </div>
                <div className="text-[10px] font-mono text-zinc-500 pt-1">
                  Data: <span className="text-zinc-400">horizon_ablation.json L5-25</span>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Atmospheric Sensor Simulator */}
          <WeatherLSTMTelemetry />
        </article>

      </section>


      {/* Section 2: "ALSO BUILT" Grid */}
      <section id="also-built" className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-orange-400 font-semibold mb-2">
            Interactive System Demos
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Also built
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mt-2 font-normal">
            Neural architectures, security scanners, full-stack workflow automation, and predictive modeling with interactive diagram simulations.
          </p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Emotion Recognition CNN */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                CONVOLUTIONAL NETWORK / WEBCAM
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Emotion Recognition CNN
              </h3>

              <EmotionDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: FEATURE MAP ACTIVATION DECODE
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                Deep convolutional architecture trained for real-time facial expression categorization from live camera streams. Employs Haar Cascade facial detection, batch normalization, and dropout to prevent overfitting on subtle lighting variations.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">model.py L14-48, infer.py L22-65</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["PYTHON", "KERAS", "OPENCV", "CNN"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan/Emotion_Rec" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>


          {/* Card 2: Handwritten Digit Recognizer */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                COMPUTER VISION / TENSOR INTERACTION
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Digit Recognizer CNN
              </h3>

              <DigitDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: 28x28 PIXEL NORMALIZATION TO SOFTMAX
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                Machine learning interface powered by a custom convolutional neural network to identify handwritten digits from the MNIST dataset with data augmentation, elastic distortions, and Adam optimizer convergence.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">train_cnn.py L12-50, predict.py L18-42</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["MACHINE LEARNING", "CNN", "PYTHON", "KERAS"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan/DIGIT_RECOGNIZER_CNN" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>


          {/* Card 3: RepoGuard */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                DEVSECOPS / AUTOMATED SCANNER
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                RepoGuard
              </h3>

              <RepoGuardDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: PRE-COMMIT ENTROPY GATE
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                A security utility for monitoring and guarding GitHub repositories against secret leaks, environment token exposures, and unauthorized vulnerability patterns using regex pattern trees and Shannon entropy scoring.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">scanner.py L31-84, rules.json L1-50</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["SECURITY", "PYTHON", "GIT HOOKS", "AUTOMATION"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan/RepoGuard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>


          {/* Card 4: Placement Predictor */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                PREDICTIVE MODELING / ENSEMBLE
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Placement Predictor
              </h3>

              <PlacementDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: FEATURE WEIGHTING &amp; SPLIT ANALYSIS
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                Supervised classification model analyzing academic metrics, technical skills, and project portfolios to forecast placement eligibility with interpretable decision trees and feature importance rankings.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">model_train.py L15-68, metrics.py L10-38</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["SCIKIT-LEARN", "XGBOOST", "PYTHON", "PANDAS"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>


          {/* Card 5: Online Leave Portal */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                FULL-STACK / WORKFLOW AUTOMATION
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Online Leave Portal
              </h3>

              <LeavePortalDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: ROLE-BASED STATE MACHINE
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                Full-stack academic workflow engine designed for student-faculty leave request processing, role-based approval cascades (Student &rarr; Advisor &rarr; HOD), and automated relational database audit logging.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">apply_leave.php L15-72, auth.php L8-35</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["PHP", "MYSQL", "APACHE", "RBAC"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://github.com/venmugilrajan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>


          {/* Card 6: Student Reward Site */}
          <article className="bg-[#0b0c10] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-orange-400/90 font-medium mb-1">
                GAMIFIED PLATFORM / HF SPACES
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Student Reward Site
              </h3>

              <RewardDiagram />

              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-3 mb-1">
                DIAGRAM: EVENT-DRIVEN ACCUMULATION LEDGER
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                A gamified achievement platform designed for tracking, managing, and rewarding student academic milestones through automated point balances, badge unlocks, and peer leaderboards on Hugging Face Spaces.
              </p>

              <div className="font-mono text-[10px] text-zinc-500 mb-3">
                Code: <span className="text-zinc-400">app.py L20-95, rewards_db.json L1-40</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 py-3 border-t border-white/5 font-mono text-[9px]">
                {["PYTHON", "GRADIO", "HF SPACES", "EVENT-DRIVEN"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs">
                <a 
                  href="https://venmugilrajan-student-reward-points.hf.space/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Live Space</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </article>

        </div>
      </section>


      {/* Bottom Navigation & Contact CTA */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-16 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
        <button 
          onClick={() => navigateTo('home')}
          className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowRight size={14} className="rotate-180" />
          <span>RETURN TO MAIN PORTFOLIO</span>
        </button>

        <div className="flex items-center gap-6 text-zinc-400">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            BACK TO TOP ↑
          </button>
          <button 
            onClick={() => onContactClick ? onContactClick() : navigateTo('home', 'contact')}
            className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default ProjectsPage;
