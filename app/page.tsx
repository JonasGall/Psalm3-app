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
  UserCheck
} from 'lucide-react';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Psalm3FullSite() {
  // Identity State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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
    telegram: '' 
  });

  // Identity Connection Logic
  const connectIdentity = () => {
    setIsConnecting(true);
    // Simulating wallet handshake delay
    setTimeout(() => {
      setWalletAddress("0x71C24B4353c8921812903921");
      setIsConnecting(false);
    }, 1200);
  };

  // Fetch Verified Projects
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
      const total = data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0);
      setTotalVetted(total);
    }
  };

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.chain === activeFilter);

  const handleShare = (projectName: string, chain: string) => {
    const text = encodeURIComponent(`🛡️ ${projectName} has been VERIFIED on @Psalm3_Protocol.`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const openDealRoom = (handle: string) => {
    if (handle) {
      window.open(`https://t.me/${handle.replace('@', '')}`, '_blank');
    } else {
      alert("Deal Room encrypted. Contact Psalm3 Admin.");
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
        is_verified: false,
        valuation_amount: 0 
    }]);
    setIsSubmitting(false);
    if (!error) {
      alert("Genesis Phase Initialized.");
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

        {/* UPDATED CONNECT IDENTITY BUTTON */}
        <button 
          onClick={connectIdentity}
          disabled={isConnecting || !!walletAddress}
          className={`border px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            walletAddress 
            ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400' 
            : 'bg-white/5 border-white/10 hover:border-cyan-400 hover:text-cyan-400'
          }`}
        >
          {isConnecting ? (
            <><Activity className="w-3 h-3 animate-spin" /> Handshaking...</>
          ) : walletAddress ? (
            <><UserCheck className="w-3 h-3" /> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</>
          ) : (
            "Connect Identity"
          )}
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-bold mb-8 tracking-widest uppercase">
          <Activity className="w-3 h-3 animate-pulse" /> Alliance Protocol Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          BUILD <span className="opacity-80">TRUST.</span><br/>
          FIND <span className="text-cyan-400 uppercase">ALLIES.</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
          <button onClick={() => setIsModalOpen(true)} className="bg-cyan-400 text-black px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            Apply for Vetting
          </button>
        </div>

        {/* --- STATS BAR --- */}
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
              <Lock className="w-3 h-3 text-cyan-400" /> Status
            </span>
            <div className="text-2xl font-black tracking-tight uppercase text-sm">Encrypted</div>
          </div>
          <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-cyan-400" /> Success
            </span>
            <div className="text-2xl font-black tracking-tight">100%</div>
          </div>
        </div>
      </header>

      {/* --- DIRECTORY --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <h2 className="text-4xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-white">
            <Search className="text-cyan-400 w-8 h-8" /> Active Alliances
          </h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Ethereum', 'Solana', 'Base', 'Polygon'].map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${activeFilter === filter ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-[#0D1117] border border-white/5 p-8 rounded-[32px] hover:border-cyan-400/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-3 z-10">
                   <button onClick={() => handleShare(p.project_name, p.chain)} className="p-2 bg-white/5 hover:bg-cyan-400 hover:text-black rounded-lg transition-all border border-white/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" /></svg>
                   </button>
                   <ShieldCheck className="w-8 h-8 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase italic tracking-tight">{p.project_name}</h3>
                <div className="bg-white/5 rounded-2xl p-4 mb-8">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1 tracking-widest">Seeking Partner</span>
                  <span className="text-md font-bold text-white uppercase italic">{p.partnership_need}</span>
                </div>
                <button onClick={() => openDealRoom(p.telegram_handle)} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
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
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Project Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-400 font-bold" />
              <input required type="text" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} placeholder="Telegram @handle" className="w-full bg-white/5 border border-cyan-400/30 rounded-2xl p-5 outline-none focus:border-cyan-400 font-bold" />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white">
                  <option className="bg-black">Ethereum</option>
                  <option className="bg-black">Solana</option>
                  <option className="bg-black">Base</option>
                </select>
                <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white">
                  <option className="bg-black">Pre-Seed</option>
                  <option className="bg-black">Seed</option>
                </select>
              </div>

              <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white">
                  <option className="bg-black">Security Audit</option>
                  <option className="bg-black">Market Maker</option>
                  <option className="bg-black">Venture Capital</option>
              </select>

              <button disabled={isSubmitting} type="submit" className="w-full bg-cyan-400 text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase">
                {isSubmitting ? "ENCRYPTING..." : "SUBMIT APPLICATION"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}