"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Zap, Plus, Search, ArrowRight, X as CloseIcon, 
  Activity, TrendingUp, Lock, Send, Star, UserCheck
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Psalm3FullSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [totalVetted, setTotalVetted] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    chain: 'Ethereum',
    stage: 'Seed',
    need: 'Security Audit',
    telegram: '',
    tier: 'Genesis'
  });

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('vetting_tier', { ascending: false });
    
    if (data) {
      setProjects(data);
      const total = data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0);
      setTotalVetted(total);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('applications').insert([{ 
        project_name: formData.name, 
        chain: formData.chain, 
        stage: formData.stage, 
        partnership_need: formData.need,
        telegram_handle: formData.telegram,
        vetting_tier: formData.tier,
        is_verified: false,
        valuation_amount: 0 
    }]);

    setIsSubmitting(false);

    if (error) {
      alert("Encryption Error: " + error.message);
    } else {
      alert(`Genesis Phase Initialized.\n\nTier: ${formData.tier}\n\nA Psalm3 analyst will contact ${formData.telegram} on Telegram to finalize the alliance.`);
      setIsModalOpen(false);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-widest uppercase text-gray-500">
          <a href="#directory" className="hover:text-cyan-400 transition-colors">Directory</a>
          <a href="#stats" className="hover:text-cyan-400 transition-colors">Network</a>
        </div>
        <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-bold hover:bg-cyan-400 hover:text-black transition-all">
          Connect Identity
        </button>
      </nav>

      {/* --- HERO --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Activity className="w-3 h-3 animate-pulse" /> Alliance Protocol Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          SCALE <span className="text-cyan-400 uppercase italic">FASTER.</span><br/>
          VET <span className="opacity-80 uppercase italic">DEEPER.</span>
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-400 text-black px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)]"
        >
          Apply for Vetting
        </button>

        {/* --- DYNAMIC STATS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 mt-20 border-t border-white/5">
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)
            </span>
            <div className="text-2xl font-black tracking-tight text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <Plus className="w-3 h-3 text-cyan-400" /> Deals
            </span>
            <div className="text-2xl font-black tracking-tight">{projects.length}</div>
          </div>
        </div>
      </header>

      {/* --- DIRECTORY --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <h2 className="text-4xl font-black flex items-center gap-3 tracking-tighter uppercase italic">
            <Search className="text-cyan-400 w-8 h-8" /> Active Alliances
          </h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Ethereum', 'Solana', 'Base', 'Polygon'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${
                  activeFilter === filter ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-white/5 text-gray-500 border-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.filter(p => activeFilter === 'All' || p.chain === activeFilter).map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-8 rounded-[32px] relative transition-all group ${p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                {p.vetting_tier === 'Alliance' && (
                  <div className="absolute top-4 left-4 bg-cyan-400 text-black text-[8px] font-black px-3 py-1 rounded-full uppercase italic flex items-center gap-1">
                    <Star className="w-2 h-2 fill-black" /> Alliance Partner
                  </div>
                )}
                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ShieldCheck className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mt-4 uppercase italic tracking-tight">{p.project_name}</h3>
                <div className="bg-white/5 rounded-2xl p-4 my-6">
                  <span className="text-[10px] text-gray-500 uppercase font-black block mb-1 tracking-widest">Protocol Need</span>
                  <span className="text-md font-bold text-white uppercase italic">{p.partnership_need}</span>
                </div>
                <button 
                  onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`, '_blank')}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all flex items-center justify-center gap-2 text-xs uppercase italic tracking-widest"
                >
                  Open Deal Room <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[40px] relative z-10 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white">
              <CloseIcon className="w-8 h-8" />
            </button>
            <h2 className="text-4xl font-black mb-6 uppercase italic text-cyan-400 tracking-tighter">Apply for Vetting</h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input required type="text" placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400 transition-all font-bold text-white" />
              
              <div className="relative">
                <Send className="absolute left-5 top-5 w-5 h-5 text-cyan-400/50" />
                <input required type="text" placeholder="Telegram Handle (@username)" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 outline-none focus:border-cyan-400 transition-all font-bold text-white" />
              </div>

              {/* TIER SELECTION */}
              <div className="space-y-2 pt-2 text-left">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-1">Select Vetting Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Genesis', 'Verified', 'Alliance'].map((t) => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, tier: t})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-gray-600 mt-2 ml-1 italic">* Paid tiers finalized via manual Telegram handshake.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                  <option className="bg-black">Ethereum</option>
                  <option className="bg-black">Solana</option>
                  <option className="bg-black">Base</option>
                </select>
                <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    <option className="bg-black">Security Audit</option>
                    <option className="bg-black">Liquidity</option>
                    <option className="bg-black">Venture Capital</option>
                </select>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-5 rounded-2xl uppercase mt-4 tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-400/10">
                {isSubmitting ? "ENCRYPTING DATA..." : "SUBMIT TO PSALM3"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}