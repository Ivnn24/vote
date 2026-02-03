"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/Navbar';
import CandidateCard from '../components/CandidateCard';
import { 
  Send, Info, CheckCircle, Megaphone, Timer, Users, 
  ShieldCheck, AlertCircle, ChevronRight, ChevronLeft, 
  LayoutList, Fingerprint, Lock, Sparkles, RefreshCcw,
  Eye, EyeOff
} from 'lucide-react';

const POSITIONS = [
  "Moderator", "President", "Internal Vice President", "External Vice President",
  "Secretary", "Assistant Secretary", "Treasurer", "Assistant Treasurer", "Auditor",
  "Business Manager (Select 2)", "BSIT PIO", "BSCPE PIO", "BSECE PIO", "BLIS PIO"
];

const BANNER_IMAGES = [
  "https://scontent.fdvo5-1.fna.fbcdn.net/v/t39.30808-6/481229292_1032887128877095_9174458456034449645_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=ltop5TyeHksQ7kNvwHsuqis&_nc_oc=Adld8Xjuq0RaVjnQJ3vfDr2UA8Dr0C5ivqyV2S_tfh0mGumZ-1nPwSnCRQF88wOK7rE&_nc_zt=23&_nc_ht=scontent.fdvo5-1.fna&_nc_gid=QdeQO_EUD3BRVijnrbv0lw&oh=00_AftEcCZYbI42VYSueDl9MU2U8niRJi7cz0Yl5PFdnRF4XA&oe=6987DBD3",
  "https://scontent.fdvo8-1.fna.fbcdn.net/v/t39.30808-6/480357780_1029766222522519_6630668978844353149_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=oihDK4bLf3QQ7kNvwGIQKRh&_nc_oc=Adm7TLiNVjVeqVy1EMSQORPsDOJ1Uh-vT6TXbeafZz_5d1YP6yU-h1YhRZ22cRauuE4&_nc_zt=23&_nc_ht=scontent.fdvo8-1.fna&_nc_gid=_nCcv_wAALUYTu0CfKgZUw&oh=00_AftDytnutrIAXo2jMCRI3zomWrw0oMRdyFwlF92jtnQurA&oe=6987F90C",
  "https://scontent.fdvo8-1.fna.fbcdn.net/v/t39.30808-6/234754765_1713972372145057_2343636954238515698_n.png?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=24Z_ZAGzQZ8Q7kNvwHz0DCG&_nc_oc=AdlZPuBDn6La3qX_B8HzIl2b-ZYlMuD1mhPWD4c4YTZ9JD38UyhPNXIZx9NnfVYkiB0&_nc_zt=23&_nc_ht=scontent.fdvo8-1.fna&_nc_gid=yMvkVyL_J-ks6byuBSjQzA&oh=00_AfuqyJ4y6sztB1iErtW3RuQeZX1zbx0y-ReVkHPkJ27qLg&oe=6987FEC1",
];

export default function VotePage() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Auto-slide Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const progress = useMemo(() => {
    return (Object.keys(selectedCandidates).length / POSITIONS.length) * 100;
  }, [selectedCandidates]);

  const handleVoteSubmit = () => {
    if (Object.keys(selectedCandidates).length < POSITIONS.length) {
      const missing = POSITIONS.filter(p => !selectedCandidates[p]);
      alert(`Please cast your vote for: ${missing[0]}`);
      return;
    }
    setIsConfirming(true);
  };

  const finalSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setHasVoted(true);
      setSubmitting(false);
    }, 2500);
  };

  if (hasVoted) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-orange-50/30 -z-10" />
          <motion.div 
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] max-w-lg text-center border border-orange-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
            >
              <CheckCircle size={56} strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Receipt Issued</h2>
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex flex-col gap-2">
              <p className="text-xs font-mono text-gray-400">TRANSACTION HASH</p>
              <p className="text-xs font-mono font-bold text-gray-700 truncate uppercase tracking-widest">CET-VOTE-2026-X89B-Q21Z-KLL9</p>
            </div>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Your identity has been verified and your choices recorded. Digital democracy in action.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-[#111] text-white px-8 py-5 rounded-2xl font-black hover:bg-[#f05a28] transition-all shadow-2xl uppercase tracking-tighter flex items-center justify-center gap-3"
            >
              Finish Session <ChevronRight size={20} />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] font-poppins pb-32 selection:bg-[#f05a28]/20">
      <Navbar />

      {/* --- SCROLL PROGRESS BAR --- */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#f05a28] z-[110] origin-left" style={{ scaleX }} />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[650px] overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img src={BANNER_IMAGES[currentSlide]} alt="Banner" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#FDFCFB] via-black/20 to-black/80 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto h-full px-6 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> CET ANNOUNCEMENT
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6 italic">
              ENGINEER THE <br /> <span className="text-[#f05a28] drop-shadow-[0_0_30px_rgba(240,90,40,0.4)]">FUTURE.</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-12 max-w-xl">
              HCDC College of Engineering and Technology elections are now live. Choose the leaders who will navigate our path toward innovation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Timer, label: "Time Remaining", value: "04h 22m 10s", color: "text-[#f05a28]" },
                { icon: Users, label: "Active Voters", value: "1,240 / 1,800", color: "text-blue-400" },
                { icon: ShieldCheck, label: "Encryption", value: "AES-GCM-256", color: "text-green-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all group">
                  <stat.icon className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`} size={24} />
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</p>
                  <p className="text-white font-black text-sm mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 z-20 flex gap-3">
          {BANNER_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-[#f05a28]' : 'w-4 bg-white/20'}`} />
          ))}
        </div>
      </section>

      {/* --- VOTING PROGRESS STICKY BAR --- */}
      <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-2xl border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f05a28] border border-gray-100 font-black italic">
              {Math.round(progress)}%
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-black text-gray-900">{Object.keys(selectedCandidates).length} of {POSITIONS.length} Casted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSummary(!showSummary)}
              className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-900 text-xs font-black uppercase tracking-tight hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <LayoutList size={16} /> Summary
            </button>
            <button 
              onClick={handleVoteSubmit}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all flex items-center gap-2 shadow-lg ${progress === 100 ? 'bg-[#f05a28] text-white shadow-[#f05a28]/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
               Cast Ballot <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-20 px-6">
        {/* --- DYNAMIC CANDIDATES LIST --- */}
        {POSITIONS.map((pos, index) => (
          <motion.section 
            key={pos}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32 relative"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="flex items-center gap-6">
                <span className="text-7xl font-black text-gray-100 italic leading-none select-none">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-3xl font-[900] text-gray-900 uppercase tracking-tighter leading-none mb-2">{pos}</h3>
                  <div className="flex items-center gap-3">
                    <span className="h-0.5 w-8 bg-[#f05a28]" />
                    <p className="text-[#f05a28] text-[10px] font-black uppercase tracking-[0.3em]">Required Selection</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedCandidates({...selectedCandidates, [pos]: "abstain"})}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedCandidates[pos] === 'abstain' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                <RefreshCcw size={14} /> Abstain for this position
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((c) => (
                <CandidateCard 
                  key={c}
                  name={`Candidate Name ${c}`}
                  section={`BLOCK ${c}A`}
                  bio="Platform: Dedicated to digital equity and student-led innovation through accessible CET labs and workshops."
                  isSelected={selectedCandidates[pos] === `c${c}`}
                  onSelect={() => setSelectedCandidates({...selectedCandidates, [pos]: `c${c}`})}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* --- MODALS & OVERLAYS --- */}
      <AnimatePresence>
        {/* BALLOT SUMMARY DRAWER */}
        {showSummary && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSummary(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[130] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Ballot Summary</h4>
                <button onClick={() => setShowSummary(false)} className="p-2 hover:bg-gray-50 rounded-full"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                {POSITIONS.map(pos => (
                  <div key={pos} className="p-4 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-[#f05a28]/30 transition-all">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{pos}</span>
                    <span className={`text-xs font-black ${selectedCandidates[pos] ? 'text-gray-900' : 'text-red-400'}`}>
                      {selectedCandidates[pos] === 'abstain' ? 'ABSTAINED' : selectedCandidates[pos] ? 'SELECTION MADE' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* FINAL CONFIRMATION MODAL */}
        {isConfirming && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#f05a28]" />
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-50 text-[#f05a28] rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Fingerprint size={40} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 italic uppercase mb-4">Confirm Selection</h3>
                <p className="text-gray-500 font-medium mb-10">
                  By confirming, you verify that these choices are your own. This action is encrypted and irreversible.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    disabled={submitting}
                    onClick={finalSubmit}
                    className="w-full bg-[#111] text-white h-16 rounded-2xl font-black uppercase tracking-tighter hover:bg-[#f05a28] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {submitting ? <RefreshCcw className="animate-spin" /> : <><Lock size={18} /> Cast Secure Vote</>}
                  </button>
                  <button 
                    onClick={() => setIsConfirming(false)}
                    className="w-full h-16 rounded-2xl font-black uppercase tracking-tighter text-gray-400 hover:text-gray-900 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Sub-component for simplicity
function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}