"use client";
import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  CheckCircle2, User, Award, Info, Sparkles, ShieldCheck, 
  Fingerprint, Zap, Users, History, Share2, Heart,
  ShieldAlert, ScanFace, Target, BarChart3
} from 'lucide-react';
import Image from 'next/image';

interface CandidateProps {
  name: string;
  section: string;
  bio: string;
  isSelected: boolean;
  onSelect: () => void;
  image?: string;
  party?: string;
  endorsements?: number;
}

function getDeterministicEndorsements(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  // Keep fallback values in the same visual range as before: 10..59
  return (Math.abs(hash) % 50) + 10;
}

export default function CandidateCard({ 
  name, 
  section, 
  bio, 
  isSelected, 
  onSelect,
  image,
  party = "Independent",
  endorsements
}: CandidateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayEndorsements = endorsements ?? getDeterministicEndorsements(`${name}-${section}`);
  
  // Magnetic & 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  const glowX = useTransform(x, [-100, 100], [0, 100]);
  const glowY = useTransform(y, [-100, 100], [0, 100]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      layout
      style={{ perspective: 1200, rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -15 }}
      whileTap={{ scale: 0.94 }}
      onClick={onSelect}
      className="relative group cursor-pointer font-poppins"
    >
      {/* --- ENHANCEMENT: Animated SVG Border Trace --- */}
      <AnimatePresence>
        {isSelected && (
          <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-0">
            <motion.rect
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              width="100%"
              height="100%"
              rx="3rem"
              fill="transparent"
              stroke="url(#orangeGradient)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </AnimatePresence>

      {/* --- Multi-Layer Background Glow --- */}
      <AnimatePresence>
        {(isSelected || isHovered) && (
          <motion.div
            style={{ x: glowX, y: glowY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isSelected ? 0.6 : 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-10 bg-orange-500/40 blur-[80px] rounded-full z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* --- Main Card Body --- */}
      <div className={`relative z-10 h-full w-full rounded-[3rem] overflow-hidden transition-all duration-700 ${
        isSelected 
          ? 'bg-white shadow-[0_50px_100px_-20px_rgba(249,115,22,0.3)] ring-1 ring-orange-500/30' 
          : 'bg-white/90 backdrop-blur-2xl border border-gray-100 hover:border-orange-200'
      }`}>
        
        {/* Subtle Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />

        <div className="p-8">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black tracking-widest uppercase transition-all shadow-sm ${
              isSelected ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-600'
            }`}>
              {isSelected ? <ScanFace size={12} className="animate-pulse" /> : <Target size={12} />}
              {isSelected ? 'SECURELY LOCKED' : 'CANDIDATE UNIT'}
            </div>
            
            <motion.div 
              whileHover={{ rotate: 180 }}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                isSelected ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'
              }`}
            >
              <Award size={20} />
            </motion.div>
          </div>

          {/* Profile Visual */}
          <div className="relative flex justify-center mb-8">
            <div className="relative">
              {/* Rotating Digital Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`absolute -inset-5 border-t-2 border-l-2 border-orange-500/30 rounded-full transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
              />
              
              <div className={`relative w-40 h-40 rounded-[3.5rem] overflow-hidden transition-all duration-700 border-4 ${
                isSelected 
                  ? 'rotate-3 scale-110 shadow-2xl border-orange-100' 
                  : 'grayscale-[20%] group-hover:grayscale-0 border-transparent'
              }`}>
                {image ? (
                  <Image src={image} alt={name} fill className="object-cover scale-110" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-orange-600' : 'bg-orange-50'
                  }`}>
                    <User size={70} className={isSelected ? 'text-white' : 'text-orange-300'} />
                  </div>
                )}
              </div>

              {/* Status Pill */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-2xl shadow-xl text-white"
                  >
                    <Sparkles size={18} fill="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center space-y-4">
            <div className="space-y-1">
               <div className="flex items-center justify-center gap-1.5">
                 <History size={11} className="text-orange-500" />
                 <span className="text-[10px] font-black text-orange-500 uppercase">Class Alpha-26</span>
               </div>
               <h3 className={`text-3xl md:text-4xl font-[1000] tracking-tighter transition-all italic leading-tight ${
                isSelected ? 'text-gray-900' : 'text-gray-800'
              }`}>
                {name}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-4 py-1.5 rounded-xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-tighter shadow-md">
                {section}
              </span>
              <span className="px-4 py-1.5 rounded-xl bg-gray-900 text-orange-400 text-[10px] font-black uppercase tracking-tighter">
                {party}
              </span>
            </div>

            <p className={`text-[13px] leading-relaxed px-2 transition-colors duration-500 ${
              isSelected ? 'text-gray-700 font-medium' : 'text-gray-400 italic'
            }`}>
              "{bio}"
            </p>

            {/* DATA METRICS (All Numbers Orange) */}
            <div className="flex items-center justify-between px-6 py-4 bg-orange-50/50 rounded-[2rem] border border-orange-100">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-orange-600 leading-none">
                    {displayEndorsements}
                  </span>
                  <span className="text-[9px] font-black text-orange-400 uppercase flex items-center gap-1">
                    <Heart size={10} className="fill-current" /> Endorsed
                  </span>
               </div>
               <div className="h-10 w-[2px] bg-orange-200/50 rounded-full" />
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-orange-600 leading-none">
                    0{Math.floor(displayEndorsements / 12)}
                  </span>
                  <span className="text-[9px] font-black text-orange-400 uppercase flex items-center gap-1">
                    <BarChart3 size={10} /> Rank
                  </span>
               </div>
               <div className="h-10 w-[2px] bg-orange-200/50 rounded-full" />
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-orange-600 leading-none">
                    {Math.floor(displayEndorsements * 1.5)}%
                  </span>
                  <span className="text-[9px] font-black text-orange-400 uppercase flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Trust
                  </span>
               </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-orange-100 flex items-center justify-between">
            <button 
              onClick={(e) => { e.stopPropagation(); alert(`Platform Hash: 0x${Math.random().toString(16).slice(2,10)}`); }}
              className="flex items-center gap-2 text-[10px] font-black text-orange-500 hover:text-orange-700 transition-colors uppercase tracking-tight"
            >
              <Info size={14} /> View Manifest
            </button>

            <AnimatePresence mode="wait">
              {isSelected ? (
                <motion.div 
                  key="voted"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg shadow-orange-300 ring-2 ring-white"
                >
                  <Fingerprint size={14} /> SIGNED
                </motion.div>
              ) : (
                <motion.div 
                  key="unvoted"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 text-orange-400 font-black text-[10px] group-hover:animate-bounce"
                >
                  <ShieldCheck size={16} /> TAP TO AUTHORIZE
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Floating ID Tag */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20"
          >
            <div className="bg-orange-600 text-white text-[8px] font-mono px-2 py-6 rounded-full [writing-mode:vertical-lr] uppercase font-black tracking-[0.3em]">
              CERTIFIED_VOICE_2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}