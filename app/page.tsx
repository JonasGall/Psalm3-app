"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Activity, TrendingUp, Plus, Globe, Lock, Star, 
  Twitter, MessageCircle, Send, FileText, Share2, ClipboardCheck, 
  Briefcase, CheckCircle2, ShieldAlert, Clock, ChevronRight, Info
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Psalm3FullSite() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [totalVetted, setTotalVetted] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const [formData, setFormData] = useState({
    name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '', description: ''
  });

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data: allVerified } = await supabase.from('applications').select('*').eq('is_verified', true);

    if (allVerified) {
      setTotalVetted(allVerified.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0));
      setProjects(allVerified.filter(p => !p.vetting_process_complete));
      setPortfolioProjects(allVerified.filter(p => p.vetting_process_complete));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('applications').insert([{ 
        project_name: formData.name, chain: formData.chain, stage: formData.stage,
        partnership_need: formData.need, telegram_handle: formData.telegram, 
        vetting_tier: formData.tier, deck_url: formData.deck, description: formData.description,
        is_verified: false, vetting_process_complete: false 
    }]);
    setIsSubmitting(false);
    if (!error) { setShowSuccess(true); setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '', tier: 'Genesis', deck: '', description: '' }); }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30 font-sans pb-20">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <button onClick={() => {setIsModalOpen(true); setShowSuccess(false);}} className="bg-cyan-400 text-black px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">Apply Now</button>
      </nav>

      {/* --- HERO & METRICS --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase italic">Trust <span className="text-cyan-400">Layer.</span></h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 border-t border-white/5 pt-12">
          <div className="text-left p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)</span>
            <div className="text-3xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2"><Activity className="w-3 h-3 text-cyan-400" /> Active Deals</span>
            <div className="text-3xl font-black">{projects.length}</div>
          </div>
        </div>
      </header>

      {/* --- PORTFOLIO (ARCHIVE) --- */}
      {portfolioProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex items-center gap-3 mb-12 border-l-4 border-cyan-400 pl-6">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Institutional Archive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioProjects.map((p) => (
              <div key={p.id} className="bg-gradient-to-br from-[#0D1117] to-cyan-900/10 border border-cyan-400/20 p-10 rounded-[40px]">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80">Process Complete</span>
                </div>
                <h3 className="text-4xl font-black uppercase italic mb-4">{p.project_name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 italic">{p.description || "Project has successfully navigated the Psalm3 vetting pipeline and established institutional connectivity."}</p>
                <div className="flex gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">{p.chain}</span>
                    <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">Vetted: {p.vetting_tier}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- LIVE DIRECTORY --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-2xl font-black uppercase italic text-gray-500 mb-2">Active Deal Flow</h2>
                <div className="flex gap-2">
                    {['All', 'Ethereum', 'Solana', 'Base', 'Monad'].map((f) => (
                        <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all ${activeFilter === f ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 text-gray-500 border-white/10'}`}>{f}</button>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => activeFilter === 'All' || p.chain === activeFilter).map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-8 rounded-[40px] relative transition-all hover:scale-[1.02] ${p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.05)]' : 'border-white/5'}`}>
                {/* Badges & Chain */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-2">
                        {p.vetting_tier === 'Alliance' ? <span className="bg-cyan-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase italic flex items-center gap-1"><Star className="w-3 h-3 fill-black" /> Alliance</span> : <span className="bg-white/10 text-cyan-400 text-[9px] font-black px-3 py-1 rounded-full uppercase italic">Verified</span>}
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.chain}</span>
                </div>

                <h3 className="text-3xl font-black uppercase italic mb-3 tracking-tight">{p.project_name}</h3>
                <p className="text-gray-400 text-[11px] leading-relaxed mb-6 italic line-clamp-3">{p.description || "No description provided."}</p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 mb-8 border-y border-white/5 py-4">
                    <div>
                        <span className="text-[8px] uppercase text-gray-600 font-black block mb-1">Seeking</span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">{p.partnership_need || "Investment"}</span>
                    </div>
                    <div>
                        <span className="text-[8px] uppercase text-gray-600 font-black block mb-1">Stage</span>
                        <span className="text-[10px] text-white font-bold uppercase">{p.stage || "Seed"}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button onClick={() => window.open(p.deck_url)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><FileText className="w-3 h-3" /> View Deck</button>
                    <button onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`)} className="flex-1 bg-cyan-400 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-white hover:text-black"><Send className="w-3 h-3" /> Connect</button>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto shadow-2xl">
            {!showSuccess ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <h2 className="text-4xl font-black uppercase italic text-cyan-400 text-center mb-6">Apply to Protocol</h2>
                <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400" />
                <textarea required placeholder="Short Project Description (Institutional Summary)" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400 text-sm" />
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Telegram @handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400" />
                    <input required placeholder="Pitch Deck URL" value={formData.deck} onChange={(e) => setFormData({...formData, deck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white appearance-none outline-none">
                    {['Ethereum', 'Solana', 'Base', 'Monad', 'Polygon', 'Arbitrum'].map(c => <option key={c} className="bg-[#0D1117]">{c}</option>)}
                  </select>
                  <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white appearance-none outline-none">
                    {['Lead VC', 'Market Maker', 'Security Audit', 'CEX Listing', 'Advisory'].map(n => <option key={n} className="bg-[#0D1117]">{n}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm tracking-widest hover:scale-[1.02] transition-all">Submit Protocol Request</button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="bg-cyan-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]"><ClipboardCheck className="w-10 h-10 text-cyan-400" /></div>
                <h2 className="text-4xl font-black uppercase italic mb-4">Protocol Sent</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Application is in the Vetting Queue.</p>
                <button onClick={() => window.open('https://t.me/YourAdminHandle')} className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all">Contact Lead Analyst</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}