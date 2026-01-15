"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Zap, Plus, Search, ArrowRight, X as CloseIcon, 
  Activity, TrendingUp, Lock, Send, Star, CheckCircle2, Crown
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
    if (!error) {
      alert(`Genesis Phase Initialized.\nTier: ${formData.tier}\nA Psalm3 analyst will contact ${formData.telegram} on Telegram.`);
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
        <button onClick={() => setIsModalOpen(true)} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all">
          Apply Now
        </button>
      </nav>

      {/* --- HERO --- */}
      <header className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase italic">
          The <span className="text-cyan-400">Alliance</span><br/>Layer.
        </h1>
        <p className="text-gray-500 text-lg uppercase tracking-[0.3em] font-bold mb-12">Institutional Grade Vetting for Web3</p>
      </header>

      {/* --- PRICING SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase italic tracking-tight mb-2">Vetting Protocols</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Choose your entry point into the Psalm3 ecosystem</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Genesis */}
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[32px] hover:border-white/20 transition-all">
            <h3 className="text-xl font-black uppercase italic mb-1">Genesis</h3>
            <div className="text-3xl font-black mb-6">$0</div>
            <ul className="space-y-4 mb-8 text-xs font-bold text-gray-400 uppercase tracking-tight">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Standard Directory Listing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Basic Metadata Vetting</li>
            </ul>
          </div>

          {/* Verified */}
          <div className="bg-white/[0.03] border border-cyan-400/30 p-8 rounded-[32px] relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.05)]">
            <div className="absolute top-4 right-4"><ShieldCheck className="w-6 h-6 text-cyan-400" /></div>
            <h3 className="text-xl font-black uppercase italic mb-1 text-cyan-400">Verified</h3>
            <div className="text-3xl font-black mb-6">$199</div>
            <ul className="space-y-4 mb-8 text-xs font-bold text-gray-300 uppercase tracking-tight">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Identity Authentication</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Verified Badge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Direct Telegram Bridge</li>
            </ul>
          </div>

          {/* Alliance */}
          <div className="bg-cyan-400 p-8 rounded-[32px] text-black shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="absolute top-4 right-4"><Crown className="w-6 h-6" /></div>
            <h3 className="text-xl font-black uppercase italic mb-1">Alliance</h3>
            <div className="text-3xl font-black mb-6">$499</div>
            <ul className="space-y-4 mb-8 text-xs font-bold uppercase tracking-tight">
              <li className="flex items-center gap-2"><Star className="w-4 h-4 fill-black" /> Top-Tier Sticky Placement</li>
              <li className="flex items-center gap-2"><Star className="w-4 h-4 fill-black" /> Institutional Glow Effect</li>
              <li className="flex items-center gap-2"><Star className="w-4 h-4 fill-black" /> 1-on-1 VC Brokerage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- DIRECTORY --- */}
      <section id="directory" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Live Deals</h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Ethereum', 'Solana', 'Base', 'Polygon'].map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFilter === f ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 border-white/10'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.filter(p => activeFilter === 'All' || p.chain === activeFilter).map((p) => (
            <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${p.vetting_tier === 'Alliance' ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.15)] scale-[1.03]' : 'border-white/5'}`}>
                {p.vetting_tier === 'Alliance' && (
                  <div className="absolute top-6 left-6 bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-black" /> Alliance Partner
                  </div>
                )}
                <h3 className="text-3xl font-black mt-8 uppercase italic mb-8">{p.project_name}</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] uppercase font-bold text-gray-500">
                    <span>Ecosystem</span>
                    <span className="text-white italic">{p.chain}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] uppercase font-bold text-gray-500">
                    <span>Partner Need</span>
                    <span className="text-white italic text-right">{p.partnership_need}</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`https://t.me/${p.telegram_handle?.replace('@','')}`, '_blank')}
                  className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                >
                  Enter Deal Room <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- APPLICATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-12 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl font-black mb-8 uppercase italic text-cyan-400 tracking-tighter">Protocol Application</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Basic Info */}
              <div className="space-y-4">
                <input required type="text" placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
                <input required type="text" placeholder="Telegram @handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white outline-none focus:border-cyan-400" />
              </div>

              {/* RESTORED: Ecosystem & Stage Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-2">Ecosystem</label>
                  <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    <option className="bg-[#0D1117]">Ethereum</option>
                    <option className="bg-[#0D1117]">Solana</option>
                    <option className="bg-[#0D1117]">Base</option>
                    <option className="bg-[#0D1117]">Polygon</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 ml-2">Stage</label>
                  <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    <option className="bg-[#0D1117]">Stealth</option>
                    <option className="bg-[#0D1117]">Pre-Seed</option>
                    <option className="bg-[#0D1117]">Seed</option>
                    <option className="bg-[#0D1117]">Mainnet Live</option>
                  </select>
                </div>
              </div>

              {/* RESTORED: Seeking Partners For */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-2">Seeking Partners For</label>
                <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white appearance-none">
                    <option className="bg-[#0D1117]">Security Audit</option>
                    <option className="bg-[#0D1117]">Market Maker (Liquidity)</option>
                    <option className="bg-[#0D1117]">Venture Capital (Lead)</option>
                    <option className="bg-[#0D1117]">KOL / Distribution</option>
                    <option className="bg-[#0D1117]">Exchange Listing</option>
                </select>
              </div>

              {/* Tier Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 ml-2">Vetting Protocol Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Genesis', 'Verified', 'Alliance'].map((t) => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, tier: t})} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-lg shadow-cyan-400/20">
                  {isSubmitting ? "ENCRYPTING DATA..." : "SUBMIT PROTOCOL REQUEST"}
                </button>
                <p className="text-center text-[9px] text-gray-600 mt-4 uppercase font-bold italic tracking-tighter">Manual vetting fee settled via Telegram handshake</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}