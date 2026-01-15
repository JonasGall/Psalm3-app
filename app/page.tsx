"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Zap, Plus, Search, ArrowRight, X as CloseIcon, 
  Activity, TrendingUp, Lock, Send, Star, CheckCircle2, Globe, FileText
} from 'lucide-react';

// --- CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// PASTE YOUR SECRETS HERE
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"; // From BotFather
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID";     // From userinfobot

export default function Psalm3FullSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [totalVetted, setTotalVetted] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: ''
  });

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase.from('applications').select('*').eq('is_verified', true).order('vetting_tier', { ascending: false });
    if (data) {
      setProjects(data);
      setTotalVetted(data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0));
    }
  };

  // --- TELEGRAM NOTIFICATION LOGIC ---
  const sendTelegramAlert = async (data: any) => {
    // 1. Ensure the message is URL-safe
    const message = `🛡️ NEW PSALM3 SUBMISSION\n\nProject: ${data.name}\nTier: ${data.tier}\nChain: ${data.chain}\nTelegram: ${data.telegram}\nDeck: ${data.deck || 'None'}`;
    
    // 2. Build the URL directly (Internal Telegram API prefers GET for simple alerts)
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    try {
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });

      const result = await response.json();
      
      if (!result.ok) {
        // This will now show up in your browser console (F12) if it fails
        console.error("Telegram error detail:", result);
      } else {
        console.log("✅ Telegram Alert Sent Successfully!");
      }
    } catch (err) {
      console.error("Connection to Telegram failed. Check your internet or Bot Token.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('applications').insert([{ 
        project_name: formData.name, 
        chain: formData.chain, 
        partnership_need: formData.need,
        telegram_handle: formData.telegram, 
        vetting_tier: formData.tier, 
        deck_url: formData.deck, 
        is_verified: false 
    }]);

    if (!error) {
      // Trigger the alert
      await sendTelegramAlert(formData);
      alert("Application sent to Vetting Queue.");
      setIsModalOpen(false);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '' });
    } else {
      alert("Database error. Check Supabase connection.");
    }
    setIsSubmitting(false);
  };

  // ... rest of your UI code (Nav, Hero, Directory, Modal) remains exactly as before
  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 font-sans pb-20">
      {/* (Same UI code we used in the previous "Full Build") */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all">
          Apply Now
        </button>
      </nav>

      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase italic text-white">Trust <span className="text-cyan-400">Layer.</span></h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5">
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV</span>
             <div className="text-2xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-3 h-3 text-cyan-400" /> Vetted</span>
             <div className="text-2xl font-black">{projects.length}</div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : 'border-white/5'}`}>
                <h3 className="text-3xl font-black mt-12 uppercase italic mb-8">{p.project_name}</h3>
                <button onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`)} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase tracking-widest">Chat</button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal remains the same as previous full version */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-12 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl font-black mb-8 uppercase italic text-cyan-400 tracking-tighter text-white">Apply</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
              <input required placeholder="Telegram @handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
              <div className="grid grid-cols-3 gap-2">
                {['Genesis', 'Verified', 'Alliance'].map((t) => (
                  <button key={t} type="button" onClick={() => setFormData({...formData, tier: t})} className={`py-4 rounded-xl text-[9px] font-black uppercase border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{t}</button>
                ))}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}