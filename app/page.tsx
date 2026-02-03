"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Loader2, ArrowRight, ShieldCheck, AlertCircle, Mail, IdCard, CheckCircle2 } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '900'] 
});

export default function AuthPage() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [shake, setShake] = useState(false);
  
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle ID change (Numbers only & Max 8 digits)
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 8) {
      setStudentId(value);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setShake(false);

    // 1. Validation for Registration
    if (!isLogin) {
      if (!email.toLowerCase().endsWith("@hcdc.edu.ph")) {
        setLoading(false);
        setError("Please use your official @hcdc.edu.ph email.");
        setShake(true);
        return;
      }
    }

    // 2. Validation for both Login and Registration
    if (studentId.length !== 8) {
      setLoading(false);
      setError("Student ID must be exactly 8 digits.");
      setShake(true);
      return;
    }
    
    setTimeout(() => {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const savedId = localStorage.getItem("voterId");
        if(studentId === savedId || studentId.length === 8) {
          localStorage.setItem("voterId", studentId);
          router.push('/vote');
        } else {
          setLoading(false);
          setError("Invalid Student ID or Password.");
          setShake(true);
        }
      } else {
        // --- REGISTRATION LOGIC ---
        localStorage.setItem("voterId", studentId);
        localStorage.setItem("voterName", fullName); // Saving the name
        
        setLoading(false);
        setSuccessMsg("Account created! Please sign in.");
        setIsLogin(true);
        setPassword("");
      }
    }, 1500);
  };

  return (
    <div className={`${poppins.className} relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#FAFAFA] overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-full -z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-[#f05a28]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[40%] bg-orange-200/20 rounded-full blur-[80px]" />
      </div>

      <motion.div 
        layout
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div className="bg-white/80 backdrop-blur-2xl p-6 xs:p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white ring-1 ring-black/[0.03]">
          
          <div className="text-center mb-8">
            <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <Image src="/cetlogo.svg" alt="CET Logo" width={90} height={90} className="relative mx-auto drop-shadow-xl mb-4 w-[75px] h-[75px] sm:w-[90px] sm:h-[90px]" priority />
            </motion.div>
            <motion.h1 layout className="text-3xl sm:text-4xl font-[900] text-gray-900 tracking-tighter italic">
              CET<span className="text-[#f05a28] ml-1">VOTE</span>
            </motion.h1>
            <p className="text-[10px] font-700 text-gray-400 uppercase tracking-[0.2em] mt-1">
              {isLogin ? "CET Official Election Portal" : "Create Voter Account"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm">
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-semibold leading-tight">{error}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 shadow-sm">
                <CheckCircle2 size={18} className="shrink-0" />
                <p className="text-xs font-semibold leading-tight">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div key="signup-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] font-700 text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f05a28]" size={18} />
                      <input 
                        required 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Dela Cruz" 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:ring-4 focus:ring-[#f05a28]/10 focus:border-[#f05a28] outline-none transition-all font-medium text-base text-gray-800" 
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-700 text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f05a28]" size={18} />
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@hcdc.edu.ph" 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:ring-4 focus:ring-[#f05a28]/10 focus:border-[#f05a28] outline-none transition-all font-medium text-base text-gray-800" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div key="identity-fields" layout className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-700 text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Student ID (8-Digits Only)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f05a28]" size={18} />
                    <input 
                      required 
                      type="text" 
                      value={studentId}
                      onChange={handleIdChange}
                      placeholder="598-XXXXX" 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:ring-4 focus:ring-[#f05a28]/10 focus:border-[#f05a28] outline-none transition-all font-medium text-base text-gray-800 font-mono" 
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-700 text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f05a28]" size={18} />
                    <input 
                      required 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:ring-4 focus:ring-[#f05a28]/10 focus:border-[#f05a28] outline-none transition-all font-medium text-base text-gray-800" 
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button type="submit" disabled={loading} className="w-full relative bg-[#111] hover:bg-[#f05a28] text-white font-black py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 mt-4 overflow-hidden group">
              <div className="relative z-10 flex items-center justify-center gap-2 text-sm tracking-tight uppercase">
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /><span>Validating...</span></>
                ) : (
                  <>{isLogin ? "SIGN IN TO VOTE" : "Register Account"}<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { 
                setIsLogin(!isLogin); 
                setError(""); 
                setSuccessMsg("");
              }} 
              className="text-xs font-bold text-gray-500 hover:text-[#f05a28] transition-colors group"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-[#f05a28] underline decoration-2 underline-offset-4 group-hover:no-underline font-black">
                {isLogin ? "Register now" : "Login here"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}