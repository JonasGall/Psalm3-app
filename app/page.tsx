"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Zap, Plus, Search, ArrowRight, X as CloseIcon, 
  Activity, TrendingUp, Lock, Send, Star, CheckCircle2, Globe, FileText, Share2
} from 'lucide-react';

// --- SUPABASE CONFIGURATION ---
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

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    chain: 'Ethereum',
    stage: 'Seed',
    need: 'Security Audit',
    telegram: '',
    tier: 'Genesis',
    deck: ''
  });

  useEffect(() => {
    fetchVerifiedProjects();
  }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('vetting_tier', { ascending: false });
    
    if (data) {
      setProjects(data);
      // Calculate TVV from your valuation_amount column in Supabase
      const total = data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0);
      setTotalVetted(total);
    }
  };

  const handleShare = (name: string, chain: string) => {
    const text = encodeURIComponent(`🛡️ ${name} is officially VETTED on @Psalm3_Protocol. Building on ${chain}.`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
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
        deck_url: formData.deck, 
        is_verified: false 
    }]);

    setIsSubmitting(false);

    if (!error) {
      alert("Submission Successful. We will review your data in Supabase.");
      setIsModalOpen(false);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '' });
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 font-sans pb-20">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all">
          Apply for Vetting
        </button>
      </nav>

      {/* --- HERO & PROTOCOL DESCRIPTION --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Activity className="w-3 h-3 animate-pulse" /> Alliance Protocol Active
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase italic">
          Trust <span className="text-cyan-400">Layer.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic max-w-2xl mx-auto mb-16 px-4">
          "Psalm3 is the industry's security-first alliance layer, bridging high-signal builders with elite ecosystem partners through rigorous vetting."
        </p>

        {/* METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5 px-4">
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)</span>
            <div className="text-2xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-3 h-3 text-cyan-400" /> Vetted Deals</span>
            <div className="text-2xl font-black">{projects.length}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Globe className="w-3 h-3 text-cyan-400" /> Networks</span>
            <div className="text-2xl font-black">8+</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Lock className="w-3 h-3 text-cyan-400" /> Status</span>
            <div className="text-2xl font-black uppercase text-sm italic">Verified</div>
          </div>
        </div>
      </header>

      {/* --- PRICING SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[32px]">
            <h3 className="text-xl font-black uppercase italic mb-1 text-gray-400">Genesis</h3>
            <div className="text-3xl font-black mb-6">$0</div>
            <p className="text-[10px] font-bold text-gray-500 uppercase italic">Base Inclusion</p>
          </div>
          <div className="bg-white/[0.03] border border-cyan-400/30 p-8 rounded-[32px] shadow-[0_0_40px_rgba(6,182,212,0.05)]">
            <h3 className="text-xl font-black uppercase italic mb-1 text-cyan-400">Verified</h3>
            <div className="text-3xl font-black mb-6">$199</div>
            <p className="text-[10px] font-bold text-gray-300 uppercase italic">Badge & Audit</p>
          </div>
          <div className="bg-cyan-400 p-8 rounded-[32px] text-black shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <h3 className="text-xl font-black uppercase italic mb-1">Alliance</h3>
            <div className="text-3xl font-black mb-6">$499</div>
            <p className="text-[10px] font-bold uppercase italic">VC Brokerage</p>
          </div>
        </div>
      </section>

      {/* --- DIRECTORY & FILTERS --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-4">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Verified Projects</h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'].map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${activeFilter === f ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-white/5 text-gray-500 border-white/10 hover:border-cyan-400/50'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {projects.filter(p => activeFilter === 'All' || p.chain === activeFilter).map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${
              p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.1)] scale-[1.03]' : 
              p.vetting_tier === 'Verified' ? 'border-cyan-400/30' : 'border-white/5 hover:border-white/20'
            }`}>
               <div className="absolute top-6 left-6 flex gap-2">
                  {p.vetting_tier === 'Alliance' && <div className="bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><Star className="w-3 h-3 fill-black" /> Alliance</div>}
                  {p.vetting_tier === 'Verified' && <div className="bg-white/10 text-cyan-400 border border-cyan-400/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</div>}
                </div>

                <div className="absolute top-6 right-6">
                  <button onClick={() => handleShare(p.project_name, p.chain)} className="p-2 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-lg transition-all border border-white/10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" /></svg>
                  </button>
                </div>

                <h3 className="text-3xl font-black mt-12 uppercase italic mb-8 tracking-tight">{p.project_name}</h3>
                
                <div className="space-y-4 mb-10 text-[10px] uppercase font-bold text-gray-500">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Ecosystem</span> <span className="text-white italic">{p.chain}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Stage</span> <span className="text-white italic">{p.stage || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Need</span> <span className="text-cyan-400 italic text-right max-w-[120px]">{p.partnership_need}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`)} className="py-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Send className="w-3 h-3" /> Chat
                  </button>
                  <button onClick={() => p.deck_url ? window.open(p.deck_url) : alert("Restricted.")} className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <FileText className="w-3 h-3" /> Deck
                  </button>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- APPLICATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-12 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl font-black mb-8 uppercase italic text-cyan-400 tracking-tighter leading-none text-white text-center">Protocol Apply</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
                <input required placeholder="Telegram @handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
                <input placeholder="Pitch Deck URL (Optional)" value={formData.deck} onChange={(e) => setFormData({...formData, deck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                  {['Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'].map(c => <option key={c} className="bg-[#0D1117]">{c}</option>)}
                </select>
                <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                   {['Pre-Seed', 'Seed', 'Series A', 'Mainnet Live'].map(s => <option key={s} className="bg-[#0D1117]">{s}</option>)}
                </select>
              </div>

              <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                 {['Security Audit', 'Market Maker', 'Lead VC', 'KOL Distribution', 'Exchange Listing', 'Launchpads', 'Gaming Ecosystem'].map(n => <option key={n} className="bg-[#0D1117]">{n}</option>)}
              </select>

              <div className="grid grid-cols-3 gap-2">
                {['Genesis', 'Verified', 'Alliance'].map((t) => (
                  <button key={t} type="button" onClick={() => setFormData({...formData, tier: t})} className={`py-4 rounded-xl text-[9px] font-black uppercase border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{t}</button>
                ))}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm hover:scale-[1.02] transition-all shadow-lg active:scale-95">
                {isSubmitting ? "PROCESSING..." : "SUBMIT REQUEST"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}