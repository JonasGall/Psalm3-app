"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Activity, TrendingUp, Plus, Globe, Lock, Star, 
  Twitter, MessageCircle, Send, FileText, Share2, ClipboardCheck,
  Briefcase, CheckCircle2, Link as LinkIcon, Zap, ChevronRight
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
  
  const [activeChain, setActiveChain] = useState('All');
  const chains = ['All', 'Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Avalanche', 'BSC'];
  
  const partnershipNeeds = [
    'Lead VC', 'Strategic Capital', 'KOL Distribution', 
    'Market Maker', 'Security Audit', 'Launchpad Access', 'Ecosystem Advisory'
  ];

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
      const total = data.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0);
      setTotalVetted(total);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      if (error) throw error;

      setShowSuccess(true);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Lead VC', telegram: '', website: '', tier: 'Genesis', deck: '', description: '' });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Verification request failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProjects = projects.filter(p => 
    activeChain === 'All' || p.chain === activeChain
  );

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30 font-sans flex flex-col scroll-smooth">
      <style jsx global>{`
        @keyframes alliance-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(34, 211, 238, 0.2); border-color: rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.5); border-color: rgba(34, 211, 238, 0.9); }
        }
        .alliance-glow { animation: alliance-pulse 3s infinite ease-in-out; }
      `}</style>

      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 p-6 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <ShieldCheck className="text-cyan-400 w-8 h-8" />
          <span className="text-2xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
        </div>
        <button onClick={() => {setIsModalOpen(true); setShowSuccess(false);}} className="bg-cyan-400 text-black px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">Apply Now</button>
      </nav>

      <main className="flex-grow">
        {/* HERO & DESCRIPTION */}
        <header className="py-24 px-6 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black mb-8 tracking-widest uppercase animate-pulse">
            <Zap className="w-3 h-3" /> Protocol Active
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 italic uppercase text-white leading-none">Trust <span className="text-cyan-400">Layer.</span></h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium italic max-w-3xl mx-auto mb-16 px-4 leading-relaxed">
            "Psalm3 is the industry's security-first alliance layer and institutional trust protocol, bridging high-signal builders with elite ecosystem partners through rigorous vetting."
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5 px-4">
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV (Vetted)</span>
              <div className="text-3xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
            </div>
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-3 h-3 text-cyan-400" /> Vetted Deals</span>
              <div className="text-3xl font-black text-white">{projects.length + portfolioProjects.length}</div>
            </div>
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Globe className="w-3 h-3 text-cyan-400" /> Networks</span>
              <div className="text-3xl font-black text-white">9+</div>
            </div>
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Lock className="w-3 h-3 text-cyan-400" /> Status</span>
              <div className="text-sm font-black uppercase italic text-cyan-400">Secured</div>
            </div>
          </div>
        </header>

        {/* --- PRICING --- */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { tier: 'Genesis', price: '$49', features: ['Basic Profile', 'Ecosystem Listing', 'Verified Announcement'] },
                    { tier: 'Verified', price: '$149', features: ['Shield Badge', 'Priority Queue', 'Partners Introduction', 'Verified Announcement'] },
                    { tier: 'Alliance', price: '$499', features: ['Neon Glow Status', 'Featured Listing', 'Direct VC Introduction', 'Strategic Advisory'] }
                ].map((p) => (
                    <div key={p.tier} className={`p-10 rounded-[40px] border flex flex-col ${p.tier === 'Alliance' ? 'border-cyan-400 alliance-glow' : 'border-white/5 bg-white/[0.01]'}`}>
                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">{p.tier}</h4>
                        <div className="text-4xl font-black mb-8 italic">{p.price}</div>
                        <ul className="space-y-4 mb-10 flex-grow">
                            {p.features.map(f => <li key={f} className="text-xs font-bold text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> {f}</li>)}
                        </ul>
                        <button onClick={() => { setFormData({...formData, tier: p.tier}); setIsModalOpen(true); }} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all">Join {p.tier}</button>
                    </div>
                ))}
            </div>
        </section>

        {/* --- LIVE DIRECTORY --- */}
        <section id="vetting" className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-2xl font-black uppercase italic text-gray-500 tracking-widest">Active Deal Flow</h2>
            <div className="flex flex-wrap gap-2">
              {chains.map(c => (
                <button key={c} onClick={() => setActiveChain(c)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${activeChain === c ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg' : 'bg-white/5 text-gray-500 border-white/10'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {filteredProjects.map((p) => (
              <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative transition-all group ${p.vetting_tier === 'Alliance' ? 'alliance-glow border-cyan-400' : 'border-white/5 hover:border-white/20'}`}>
                 <div className="absolute top-6 left-6 flex gap-2">
                    {p.vetting_tier === 'Alliance' && <div className="bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1 shadow-[0_0_15px_#22d3ee]"><Star className="w-3 h-3 fill-black" /> Alliance</div>}
                    
                    {/* NO SHIELD FOR GENESIS - ONLY FOR VERIFIED/ALLIANCE */}
                    {p.vetting_tier === 'Verified' && <div className="bg-white/10 text-cyan-400 border border-cyan-400/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</div>}
                    
                    {p.vetting_tier === 'Genesis' && <div className="bg-white/5 text-gray-400 border border-white/10 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">Genesis Tier</div>}

                    <div className="bg-white/5 text-gray-400 border border-white/10 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">{p.chain}</div>
                  </div>
                  <h3 className="text-3xl font-black mt-12 uppercase italic mb-4 tracking-tight">{p.project_name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/5 py-6 text-[10px] font-black uppercase tracking-widest">
                    <div><span className="text-gray-600 block mb-1">Seeking</span> <span className="text-cyan-400">{p.partnership_need}</span></div>
                    <div><span className="text-gray-600 block mb-1">Stage</span> <span className="text-white">{p.stage}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button onClick={() => window.open(p.website_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"><Globe className="w-3 h-3" /> Website</button>
                    <button onClick={() => window.open(p.deck_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 font-black transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><FileText className="w-3 h-3" /> Deck</button>
                  </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#080a0e] pt-20 pb-10 px-6 mt-20 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
              <ShieldCheck className="text-cyan-400 w-6 h-6" />
              <span className="text-xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed italic mx-auto md:mx-0">
               Psalm3 is the industry's security-first alliance layer and institutional trust protocol.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6 font-sans">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li onClick={() => scrollToSection('vetting')} className="hover:text-cyan-400 cursor-pointer transition-colors">Live Queue</li>
              <li onClick={() => window.location.href='/vetting'} className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2">Standards <ChevronRight className="w-3 h-3"/></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Social</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://x.com/Psalms_Capital" target="_blank" className="p-3 bg-white/5 border border-white/10 hover:text-cyan-400 transition-all rounded-xl shadow-xl"><Twitter className="w-5 h-5" /></a>
              <a href="https://t.me/CEO_Psalms" target="_blank" className="p-3 bg-white/5 border border-white/10 hover:text-cyan-400 transition-all rounded-xl shadow-xl"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-600 text-[9px] font-black uppercase tracking-widest border-t border-white/5 pt-10">© 2026 Psalm3 Protocol. All Rights Reserved.</p>
      </footer>

      {/* --- FORM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto">
            {!showSuccess ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-4xl font-black uppercase italic text-cyan-400 text-center mb-6 tracking-tighter">Protocol Apply</h2>
                
                <div className="bg-cyan-400/5 border border-cyan-400/20 p-4 rounded-2xl mb-6 text-center">
                    <p className="text-[9px] font-black uppercase text-cyan-400 tracking-widest mb-1">Tier: {formData.tier}</p>
                    <p className="text-xs font-bold italic text-white/50">
                        {formData.tier === 'Alliance' ? '$499 Protocol Fee' : formData.tier === 'Verified' ? '$149 Protocol Fee' : 'Free Entry'}
                    </p>
                </div>

                <div className="space-y-4">
                  <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400 transition-all" />
                  <textarea required placeholder="Institutional Description" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-sm text-white focus:border-cyan-400 transition-all" />
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Seeking Partners</label>
                        <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none appearance-none cursor-pointer">
                            {partnershipNeeds.map(n => <option key={n} value={n} className="bg-[#0D1117]">{n}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Current Stage</label>
                        <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none appearance-none cursor-pointer">
                            <option value="Pre-Seed">Pre-Seed</option><option value="Seed">Seed</option><option value="Private">Private</option><option value="Public">Public</option>
                        </select>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Founder TG Handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400" />
                    <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none">
                        {chains.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#0D1117]">{c}</option>)}
                    </select>
                  </div>

                  <input required placeholder="Official Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400" />
                  
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest text-center block">Update Vetting Tier</label>
                      <div className="grid grid-cols-3 gap-2">
                          {['Genesis', 'Verified', 'Alliance'].map(t => (
                            <button key={t} type="button" onClick={() => setFormData({...formData, tier: t})} className={`py-4 rounded-xl text-[9px] font-black uppercase border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-white/5 border-white/10 text-gray-500'}`}>{t}</button>
                          ))}
                      </div>
                  </div>

                  <input placeholder="Pitch Deck URL (Optional)" value={formData.deck} onChange={(e) => setFormData({...formData, deck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
                  {isSubmitting ? 'Verifying...' : 'Submit Secured Request'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="bg-cyan-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/20 shadow-lg"><ClipboardCheck className="w-10 h-10 text-cyan-400" /></div>
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white tracking-tighter">Protocol Sent</h2>
                <button onClick={() => window.open('https://t.me/CEO_Psalms', '_blank')} className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-sm hover:bg-cyan-400 transition-all shadow-xl">Connect Analyst</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
