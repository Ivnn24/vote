"use client";

import Image from 'next/image';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, LogOut, ChevronDown, Settings, 
  UserCircle, Bell, Info, X, ShieldCheck,
  Camera, Mail, Fingerprint, Moon, Globe, 
  Lock, Trash2, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [voterId, setVoterId] = useState("00000000");
  const [voterName, setVoterName] = useState("Guest Voter");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("voterId");
    const savedName = localStorage.getItem("voterName");
    const savedPic = localStorage.getItem("voterPic");
    
    if (savedId) setVoterId(savedId);
    if (savedName) setVoterName(savedName);
    if (savedPic) setProfilePic(savedPic);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("voterId");
    localStorage.removeItem("voterName");
    localStorage.removeItem("voterPic");
    router.push('/');
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        localStorage.setItem("voterPic", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/vote')}
          className="flex items-center gap-4 group cursor-pointer relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#f05a28]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image 
              src="/cet.png" 
              alt="CET Logo" 
              width={48} 
              height={48} 
              className="relative drop-shadow-md group-hover:rotate-[5deg] transition-transform duration-300" 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-[900] text-2xl tracking-tighter text-gray-900 leading-none italic">
              CET<span className="text-[#f05a28]">VOTE</span>
            </h1>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1 hidden sm:block">
              Student Portal
            </span>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative" ref={notifRef}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={`relative p-3 rounded-2xl transition-all duration-300 ${
                isNotifOpen 
                ? 'bg-[#f05a28] text-white shadow-lg shadow-[#f05a28]/20' 
                : 'text-gray-400 hover:text-[#f05a28] hover:bg-[#f05a28]/5'
              }`}
            >
              <Bell size={22} strokeWidth={2.5} />
              <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isNotifOpen ? 'bg-white' : 'bg-red-500'}`} />
            </motion.button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-5 w-85 sm:w-96 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center border-b border-gray-50">
                    <span className="font-[900] text-[10px] uppercase tracking-[0.2em] text-gray-500">Live Updates</span>
                    <button onClick={() => setIsNotifOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={16} className="text-gray-400"/></button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    <div className="p-4 rounded-3xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100">
                      <div className="flex gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-orange-100/50 flex items-center justify-center text-[#f05a28] shrink-0 group-hover:scale-110 transition-transform">
                          <Info size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 leading-tight mb-1">Election ending soon!</p>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">Only 2 hours left to cast your votes. Your choice matters for the future of CET.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-4 px-2 py-2 sm:pl-2 sm:pr-5 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#111] to-gray-700 shadow-lg flex items-center justify-center text-white overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} strokeWidth={2.5} />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Voter</p>
                <p className="text-xs font-black text-gray-800">{voterName}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-[#f05a28]' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-5 w-64 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-50 p-3 overflow-hidden"
                >
                  <div className="px-5 py-5 mb-2 bg-gradient-to-br from-gray-50 to-white rounded-[1.8rem] border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-[#f05a28]" />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Verified Account</p>
                    </div>
                    <p className="text-sm font-[900] text-gray-900 break-all">{voterId}</p>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => { setShowProfileModal(true); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold text-gray-600 hover:bg-[#f05a28]/5 hover:text-[#f05a28] rounded-2xl transition-all duration-200 group"
                    >
                      <UserCircle size={20} className="group-hover:scale-110 transition-transform"/> Profile Details
                    </button>
                    <button 
                      onClick={() => { setShowSettingsModal(true); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-[13px] font-bold text-gray-600 hover:bg-[#f05a28]/5 hover:text-[#f05a28] rounded-2xl transition-all duration-200 group"
                    >
                      <Settings size={20} className="group-hover:rotate-45 transition-transform"/> Settings
                    </button>
                    
                    <div className="h-[1px] bg-gray-100/60 my-2 mx-4" />
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-3 px-5 py-4 text-[13px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                    >
                      <LogOut size={20} className="group-hover:translate-x-1 transition-transform"/> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>

    {/* --- PROFILE MODAL --- */}
    <AnimatePresence>
      {showProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 pb-0 flex justify-between items-center">
              <h2 className="text-2xl font-[900] italic uppercase tracking-tight">Voter <span className="text-[#f05a28]">Profile</span></h2>
              <button onClick={() => setShowProfileModal(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 overflow-hidden border-4 border-white shadow-xl">
                    {profilePic ? (
                      <img src={profilePic} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={64}/></div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-3 bg-[#f05a28] text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <h3 className="mt-4 text-xl font-black text-gray-800">{voterName}</h3>
                <p className="text-xs font-bold text-[#f05a28] uppercase tracking-widest">{voterId}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <Mail className="text-gray-400" size={20}/>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Email Address</p>
                    <p className="text-sm font-bold text-gray-700">{voterId}@hcdc.edu.ph</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <Fingerprint className="text-gray-400" size={20}/>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Biometric Status</p>
                    <p className="text-sm font-bold text-green-500">Encrypted & Active</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* --- SETTINGS MODAL --- */}
    <AnimatePresence>
      {showSettingsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSettingsModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 pb-0 flex justify-between items-center">
              <h2 className="text-2xl font-[900] italic uppercase tracking-tight">App <span className="text-[#f05a28]">Settings</span></h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
            </div>

            <div className="p-8 space-y-6">
              <section>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Moon size={18}/></div>
                      <span className="text-sm font-bold text-gray-700">Dark Mode</span>
                    </div>
                    <div className="w-10 h-6 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"/></div>
                  </div>
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Globe size={18}/></div>
                      <span className="text-sm font-bold text-gray-700">Language</span>
                    </div>
                    <span className="text-xs font-black text-[#f05a28]">English (US)</span>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Privacy & Security</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 transition-all border border-transparent hover:border-gray-100">
                    <Lock size={18} className="text-gray-400"/> Change Vote PIN
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 transition-all border border-transparent hover:border-gray-100">
                    <Smartphone size={18} className="text-gray-400"/> Two-Factor Auth
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-2xl text-sm font-bold text-red-500 transition-all border border-transparent hover:border-red-100">
                    <Trash2 size={18}/> Delete Ballot History
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}