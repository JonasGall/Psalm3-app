"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Activity, TrendingUp, Plus, Globe, Lock, Star, 
  Twitter, MessageCircle, Send, FileText, Share2, ClipboardCheck,
  Briefcase, CheckCircle2
} from 'lucide-react';

// --- DATABASE CONNECTION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Psalm3FullSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]); // New State
  const [totalVetted, setTotalVetted] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '', description: ''
  });

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('vetting_tier', { ascending: false });
    
    if (data) {
      // Logic to separate Active Queue from Institutional Archive
      const active = data.filter(p => !p.vetting_process_complete);
      const archived = data.filter(p => p.vetting_process_complete);
      
      setProjects(active);
      setPortfolioProjects(archived);
      
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
        description: formData.description,
        is_verified: false,
        vetting_process_complete: false
    }]);

    setIsSubmitting(false);
    if (!error) {
      setShowSuccess(true);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '', description: '' });
    } else {
      alert("Submission Error: " + error.message);
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
        
        <div className="hidden md:flex items-center gap-8">
           <a href="https://x.com/Psalm3_Protocol" target="_blank" className="text-gray-500 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
           <a href="https://t.me/YourAdminHandle" target="_blank" className="text-gray-500 hover:text-cyan-400 transition-colors"><MessageCircle className="w-5 h-5" /></a>
           <button onClick={() => {setIsModalOpen(true); setShowSuccess(false);}} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all">
            Apply Now
          </button>
        </div>
      </nav>

      {/* --- HERO & METRICS --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Activity className="w-3 h-3 animate-pulse" /> Alliance Protocol Active
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase italic text-white">Trust <span className="text-cyan-400">Layer.</span></h1>
        
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic max-w-3xl mx-auto mb-16 px-4">
          "The institutional bridge for the next generation of Web3 builders. We verify, filter, and connect high-signal deal flow with elite VC networks."
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5 px-4">
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)</span>
            <div className="text-2xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-3 h-3 text-cyan-400" /> Active Deals</span>
            <div className="text-2xl font-black">{projects.length}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Globe className="w-3 h-3 text-cyan-400" /> Networks</span>
            <div className="text-2xl font-black">9+</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Lock className="w-3 h-3 text-cyan-400" /> Status</span>
            <div className="text-2xl font-black uppercase text-sm italic">Verified</div>
          </div>
        </div>
      </header>

      {/* --- INSTITUTIONAL ARCHIVE (PORTFOLIO) --- */}
      {portfolioProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex items-center gap-3 mb-12 border-l-4 border-cyan-400 pl-6">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Institutional Archive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioProjects.map((p) => (
              <div key={p.id} className="bg-gradient-to-br from-[#0D1117] to-cyan-900/10 border border-cyan-400/20 p-10 rounded-[40px] relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/70">Vetting Complete</span>
                  </div>
                  <h3 className="text-4xl font-black uppercase italic mb-4 tracking-tight">{p.project_name}</h3>
                  <p className="text-gray-400 text-sm mb-8 italic">"{p.description || "Project successfully navigated the Psalm3 vetting pipeline."}"</p>
                  <div className="flex gap-2">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase italic">KYC Vetted</span>
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase italic">Audit Passed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- ACTIVE DIRECTORY --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl font-black uppercase mb-12 italic text-gray-500">Live Active Queue</h2>
        <div className="flex flex-wrap gap-2 mb-12">
          {['All', 'Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${activeFilter === f ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg' : 'bg-white/5 text-gray-500 border-white/10 hover:border-cyan-400/50'}`}>{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {projects.filter(p => activeFilter === 'All' || p.chain === activeFilter).map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${
              p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.1)] scale-[1.03]' : 'border-white/5 hover:border-white/20'
            }`}>
               <div className="absolute top-6 left-6 flex gap-2">
                  {p.vetting_tier === 'Alliance' && <div className="bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><Star className="w-3 h-3 fill-black" /> Alliance</div>}
                  {p.vetting_tier === 'Verified' && <div className="bg-white/10 text-cyan-400 border border-cyan-400/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</div>}
                </div>

                <h3 className="text-3xl font-black mt-12 uppercase italic mb-4 tracking-tight">{p.project_name}</h3>
                <p className="text-gray-400 text-[11px] leading-relaxed mb-8 italic line-clamp-3">{p.description || "Foundational Web3 infrastructure pending final vetting."}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/5 py-4 text-[10px] font-bold uppercase tracking-widest">
                  <div><span className="text-gray-600 block mb-1">Seeking</span> <span className="text-cyan-400">{p.partnership_need}</span></div>
                  <div><span className="text-gray-600 block mb-1">Stage</span> <span className="text-white">{p.stage}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`)} className="py-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Send className="w-3 h-3" /> Chat
                  </button>
                  <button onClick={() => p.deck_url ? window.open(p.deck_url) : alert("Deck Restricted.")} className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <FileText className="w-3 h-3" /> Deck
                  </button>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL (FORM + SUCCESS STATE) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-12 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            {!showSuccess ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-5xl font-black mb-8 uppercase italic text-cyan-400 tracking-tighter text-center">Protocol Apply</h2>
                <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400 transition-all" />
                <textarea required placeholder="Institutional Description" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400 text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Telegram @handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400 transition-all" />
                  <input placeholder="Pitch Deck URL" value={formData.deck} onChange={(e) => setFormData({...formData, deck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    {['Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'].map(c => <option key={c} className="bg-[#0D1117]">{c}</option>)}
                  </select>
                  <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    {['Security Audit', 'Market Maker', 'Lead VC', 'KOL Distribution'].map(n => <option key={n} className="bg-[#0D1117]">{n}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm">
                  Submit Protocol Request
                </button>
              </form>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                <div className="bg-cyan-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/20">
                  <ClipboardCheck className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white">Protocol Sent</h2>
                <button onClick={() => window.open('https://t.me/YourAdminHandle', '_blank')} className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-sm">Message Lead Analyst</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}