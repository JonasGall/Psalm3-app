"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, 
  Zap, 
  Plus, 
  Search, 
  ArrowRight, 
  X as CloseIcon, 
  Globe, 
  Activity,
  BarChart3,
  TrendingUp,
  Lock,
  Send,
  Share2
} from 'lucide-react';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Psalm3FullSite() {
  // UI State
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
    telegram: '' // Telegram handle state
  });

  // Fetch Verified Projects & Calculate Stats
  useEffect(() => {
    fetchVerifiedProjects();
  }, []);

  const fetchVerifiedProjects = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
      const total = data.reduce((sum, p) => sum + (Number(100000) || 0), 0);
      setTotalVetted(total);
    }
    if (error) console.error("Error fetching projects:", error);
  };

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.chain === activeFilter);

  // Social Sharing Logic
  const handleShare = (projectName: string, chain: string) => {
    const text = encodeURIComponent(
      `🛡️ ${projectName} has officially been VETTED & VERIFIED on @Psalm3_Protocol.\n\nBuilding the future of the ${chain} ecosystem.`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/CEO_Psalms`, '_blank');'_blank';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('applications')
      .insert([{ 
        project_name: formData.name, 
        chain: formData.chain, 
        stage: formData.stage, 
        partnership_need: formData.need,
        telegram_handle: formData.telegram, // Submitting Telegram to DB
        is_verified: false,
        valuation_amount: 0 
      }]);

    setIsSubmitting(false);

    if (error) {
      alert("Submission Error: " + error.message);
    } else {
      alert("Genesis Phase Initialized. We will contact you on Telegram shortly for vetting.");
      setIsModalOpen(false);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Security Audit', telegram: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-cyan-500/30 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black tracking-tighter uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-widest uppercase text-gray-500">
          <a href="#directory" className="hover:text-cyan-400 transition-colors font-black">Directory</a>
          <a href="#stats" className="hover:text-cyan-400 transition-colors font-black">Network Data</a>
        </div>
        <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-bold hover:bg-cyan-400 hover:text-black transition-all">
          Connect Identity
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Activity className="w-3 h-3 animate-pulse" /> Alliance Protocol Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          BUILD <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 text-white opacity-80">TRUST.</span><br/>
          FIND <span className="text-cyan-400 uppercase">ALLIES.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          The premiere alliance layer for Web3. Bridging high-integrity builders 
          with the industry's top-tier VCs, auditors, and ecosystem partners.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-400 text-black px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(6,182,212,0.3)]"
          >
            Apply for Vetting
          </button>
        </div>

        {/* --- DYNAMIC STATS BAR --- */}
        <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-white/5">
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)
            </span>
            <div className="text-2xl font-black tracking-tight text-cyan-400">${totalVetted.toLocaleString()}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <Plus className="w-3 h-3 text-cyan-400" /> Active Deals
            </span>
            <div className="text-2xl font-black tracking-tight">{projects.length}</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <Lock className="w-3 h-3 text-cyan-400" /> Chains
            </span>
            <div className="text-2xl font-black tracking-tight">4+</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-cyan-400" /> Success Rate
            </span>
            <div className="text-2xl font-black tracking-tight">100%</div>
          </div>
        </div>
      </header>

      {/* --- LIVE DIRECTORY --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-white">
              <Search className="text-cyan-400 w-8 h-8" /> Active Alliances
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['All', 'Ethereum', 'Solana', 'Base', 'Polygon'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${
                  activeFilter === filter 
                  ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'bg-white/5 text-gray-500 border-white/10 hover:border-cyan-400/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-[#0D1117] border border-white/5 p-8 rounded-[32px] hover:border-cyan-400/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-3 z-10">
                   <button 
                    onClick={() => handleShare(p.project_name, p.chain)}
                    className="p-2 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-lg transition-all border border-white/10 flex items-center justify-center group/share"
                   >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" /></svg>
                   </button>
                   <ShieldCheck className="w-8 h-8 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="bg-cyan-400/10 text-cyan-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-400/20">{p.chain}</span>
                  <span className="bg-white/5 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{p.stage}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">{p.project_name}</h3>
                <div className="bg-white/5 rounded-2xl p-4 mb-8">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1 tracking-widest">Seeking Partner</span>
                  <span className="text-md font-bold text-white uppercase italic">{p.partnership_need}</span>
                </div>
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                  Open Deal Room <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- APPLICATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[40px] relative z-10 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <CloseIcon className="w-8 h-8" />
            </button>
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-cyan-400">Genesis Application</h2>
              <p className="text-gray-500 text-sm">Enter the vetting protocol to access the alliance network.</p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Project Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. PSALM3 PROTOCOL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400 transition-all font-bold text-white" />
              </div>

              {/* TELEGRAM HANDLE FIELD */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-400 ml-1 flex items-center gap-2">
                  <Send className="w-3 h-3" /> Telegram Handle (@username)
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.telegram} 
                  onChange={(e) => setFormData({...formData, telegram: e.target.value})} 
                  placeholder="@handle"
                  className="w-full bg-white/5 border border-cyan-400/30 rounded-2xl p-5 outline-none focus:border-cyan-400 transition-all font-bold text-white placeholder:text-gray-700" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Ecosystem</label>
                  <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none appearance-none font-bold text-white">
                    <option className="bg-[#0D1117]">Ethereum</option>
                    <option className="bg-[#0D1117]">Solana</option>
                    <option className="bg-[#0D1117]">Base</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Stage</label>
                  <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none appearance-none font-bold text-white">
                    <option className="bg-[#0D1117]">Pre-Seed</option>
                    <option className="bg-[#0D1117]">Seed</option>
                    <option className="bg-[#0D1117]">Mainnet Live</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button disabled={isSubmitting} type="submit" className="w-full bg-cyan-400 text-black font-black py-5 rounded-2xl hover:bg-white disabled:bg-gray-800 transition-all uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20">
                  {isSubmitting ? "ENCRYPTING DATA..." : "SUBMIT TO PSALM3"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}