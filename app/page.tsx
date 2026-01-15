"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Activity, TrendingUp, Plus, Globe, Lock, Star, 
  Twitter, MessageCircle, Send, FileText, Share2, ClipboardCheck,
  Briefcase, CheckCircle2, Link as LinkIcon, Zap
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

  const [formData, setFormData] = useState({
    name: '', chain: 'Ethereum', stage: 'Seed', need: 'Lead VC', 
    telegram: '', website: '', tier: 'Genesis', deck: '', description: ''
  });

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('vetting_tier', { ascending: false });
    
    if (data) {
      setProjects(data.filter(p => !p.vetting_process_complete));
      setPortfolioProjects(data.filter(p => p.vetting_process_complete));
      setTotalVetted(data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0));
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
        website_url: formData.website,      
        vetting_tier: formData.tier, 
        deck_url: formData.deck,
        description: formData.description,
        is_verified: false,
        vetting_process_complete: false
    }]);

    setIsSubmitting(false);
    if (!error) {
      setShowSuccess(true);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Lead VC', telegram: '', website: '', tier: 'Genesis', deck: '', description: '' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 font-sans flex flex-col scroll-smooth">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <button onClick={() => {setIsModalOpen(true); setShowSuccess(false);}} className="bg-cyan-400 text-black px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">Apply Now</button>
      </nav>

      <main className="flex-grow">
        {/* HERO */}
        <header className="py-24 px-6 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase animate-pulse">
            <Zap className="w-3 h-3" /> Protocol Mainnet Live
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 italic uppercase leading-none">Trust <span className="text-cyan-400">Layer.</span></h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5">
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)</span>
              <div className="text-2xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
            </div>
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Activity className="w-3 h-3 text-cyan-400" /> Active Deals</span>
              <div className="text-2xl font-black">{projects.length}</div>
            </div>
          </div>
        </header>

        {/* --- INSTITUTIONAL ARCHIVE --- */}
        <section id="archive" className="max-w-7xl mx-auto px-6 mb-32 pt-20">
          <div className="flex items-center gap-3 mb-12 border-l-4 border-cyan-400 pl-6">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Institutional Archive</h2>
          </div>
          {portfolioProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {portfolioProjects.map((p) => (
                <div key={p.id} className="bg-gradient-to-br from-[#0D1117] to-cyan-900/10 border border-cyan-400/20 p-10 rounded-[40px] relative group">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-4" />
                    <h3 className="text-4xl font-black uppercase italic mb-4">{p.project_name}</h3>
                    <p className="text-gray-400 text-sm mb-8 italic leading-relaxed">{p.description}</p>
                </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs italic">Genesis phase archive currently under encryption...</p>
          )}
        </section>

        {/* --- LIVE DIRECTORY --- */}
        <section id="vetting" className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 pt-20">
          <h2 className="text-2xl font-black uppercase mb-12 italic text-gray-500">Live Active Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${
                p.vetting_tier === 'Alliance' 
                ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50 animate-pulse-slow' 
                : 'border-white/5 hover:border-white/20'
              }`}>
                 <div className="absolute top-6 left-6">
                    {p.vetting_tier === 'Alliance' 
                        ? <span className="bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic shadow-[0_0_15px_#22d3ee]">Alliance Partner</span> 
                        : <span className="bg-white/10 text-cyan-400 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">Verified Tier</span>
                    }
                  </div>
                  <h3 className="text-3xl font-black mt-12 uppercase italic mb-4">{p.project_name}</h3>
                  <p className="text-gray-400 text-[11px] leading-relaxed mb-8 italic line-clamp-3">{p.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/5 py-4 text-[10px] font-black uppercase tracking-widest">
                    <div><span className="text-gray-600 block mb-1">Seeking</span> <span className="text-cyan-400">{p.partnership_need || "Capital"}</span></div>
                    <div><span className="text-gray-600 block mb-1">Stage</span> <span className="text-white">{p.stage || "Seed"}</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={() => window.open(p.website_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <Globe className="w-3 h-3" /> Website
                    </button>
                    <button onClick={() => window.open(p.deck_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <FileText className="w-3 h-3" /> Deck
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- INSTITUTIONAL FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#080a0e] pt-20 pb-10 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-cyan-400 w-6 h-6" />
                <span className="text-xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed italic">The institutional vetting protocol for Web3 infrastructure.</p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Navigation</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <li onClick={() => scrollToSection('vetting')} className="hover:text-cyan-400 transition-colors cursor-pointer">Live Vetting</li>
                <li onClick={() => scrollToSection('archive')} className="hover:text-cyan-400 transition-colors cursor-pointer">Archive</li>
                <li onClick={() => scrollToSection('vetting')} className="hover:text-cyan-400 transition-colors cursor-pointer">Alliance List</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Social</h4>
              <div className="flex gap-4">
                <a href="https://x.com/Psalm3_Protocol" target="_blank" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="https://t.me/YourAdminHandle" target="_blank" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 transition-all"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">© 2026 Psalm3 Protocol. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* --- MODAL WITH FULL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            {!showSuccess ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <h2 className="text-4xl font-black uppercase italic text-cyan-400 text-center mb-6">Protocol Apply</h2>
                <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400 text-white" />
                <textarea required placeholder="Institutional Description" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-sm focus:border-cyan-400 text-white" />
                
                <div className="grid grid-cols-2 gap-4">
                    <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none">
                        <option value="Pre-Seed">Pre-Seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Private Round">Private Round</option>
                    </select>
                    <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none">
                        <option value="Lead VC">Lead VC</option>
                        <option value="Market Maker">Market Maker</option>
                        <option value="Security Audit">Security Audit</option>
                        <option value="Launchpad">Launchpad</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Founder TG Handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400 text-white" />
                  <input required placeholder="Official Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400 text-white" />
                </div>
                
                <input placeholder="Deck URL" value={formData.deck} onChange={(e) => setFormData({...formData, deck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-cyan-400 text-white" />

                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm tracking-widest hover:scale-[1.02] transition-all">Submit Secured Request</button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="bg-cyan-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/20 shadow-lg"><ClipboardCheck className="w-10 h-10 text-cyan-400" /></div>
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white">Protocol Sent</h2>
                <button onClick={() => window.open('https://t.me/YourAdminHandle', '_blank')} className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-sm hover:bg-cyan-400 transition-all">Connect with Lead Analyst</button>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.01); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}