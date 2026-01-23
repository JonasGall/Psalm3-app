"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Activity, TrendingUp, Plus, Globe, Lock, Star, 
  Twitter, MessageCircle, Send, FileText, Share2, ClipboardCheck,
  Briefcase, CheckCircle2, Link as LinkIcon, Zap, ChevronRight, X
} from 'lucide-react';

// --- TYPES ---
interface Project {
  id: string;
  project_name: string;
  chain: string;
  stage: string;
  partnership_need: string;
  website_url: string;
  deck_url: string;
  vetting_tier: 'Genesis' | 'Verified' | 'Alliance';
  vetting_process_complete: boolean;
  valuation_amount?: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Psalm3FullSite() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]); 
  const [totalVetted, setTotalVetted] = useState(0);
  const [activeChain, setActiveChain] = useState('All');
  
  // --- SCORECARD STATE ---
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showScoreResult, setShowScoreResult] = useState(false);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const chains = ['All', 'Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Avalanche', 'BSC', 'TON'];
  const partnershipNeeds = ['Lead VC', 'Strategic Capital', 'KOL Distribution', 'Market Maker', 'Security Audit', 'Launchpad Access', 'Ecosystem Advisory'];

  const [formData, setFormData] = useState({
    name: '', chain: 'Ethereum', stage: 'Seed', need: 'Lead VC', 
    telegram: '', website: '', tier: 'Genesis', deck: '', description: ''
  });

  const scorecardQuestions = [
    { id: 1, text: "Do you have a Whitepaper/Litepaper?", category: "Foundations" },
    { id: 2, text: "Is your GitHub repo active or ready for review?", category: "Foundations" },
    { id: 3, text: "Does your roadmap cover the next 12 months?", category: "Foundations" },
    { id: 4, text: "Does the project solve a specific Web3 friction point?", category: "Market" },
    { id: 5, text: "Is the core team willing to undergo KYC?", category: "Market" },
    { id: 6, text: "Do you have a working MVP or high-fidelity UI?", category: "Market" },
    { id: 7, text: "Do you have a plan for a 3rd party security audit?", category: "Security" },
    { id: 8, text: "Are tokenomics sustainable (no 'hype' reliance)?", category: "Security" },
    { id: 9, text: "Is your GTM strategy independent of influencers?", category: "Security" },
  ];

  useEffect(() => { fetchVerifiedProjects(); }, []);

  const fetchVerifiedProjects = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('is_verified', true)
      .order('vetting_tier', { ascending: false });
    
    if (data) {
      const fetchedProjects = data as Project[];
      setProjects(fetchedProjects.filter(p => !p.vetting_process_complete));
      setPortfolioProjects(fetchedProjects.filter(p => p.vetting_process_complete));
      const total = fetchedProjects.reduce((sum, p) => sum + (Number(p.valuation_amount) || 0), 0);
      setTotalVetted(total);
    }
  };

  const handleScoreChange = (id: number, val: boolean) => {
    const oldVal = answers[id];
    setAnswers({ ...answers, [id]: val });
    if (oldVal === undefined) {
      setAnsweredCount(prev => prev + 1);
      if (val) setScore(prev => prev + 1);
    } else if (oldVal !== val) {
      setScore(prev => val ? prev + 1 : prev - 1);
    }
  };

  const getResultTier = () => {
    if (score <= 3) return { label: "NOISE", color: "text-red-400", desc: "Your project lacks institutional foundations. Genesis Tier recommended." };
    if (score <= 6) return { label: "SIGNAL", color: "text-cyan-400", desc: "Strong potential. Verified Tier recommended to secure your Shield." };
    return { label: "ALLIANCE", color: "text-purple-400", desc: "Institutional Grade. Alliance Tier recommended for direct VC bridging." };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert([{ 
          project_name: formData.name, chain: formData.chain, stage: formData.stage,
          partnership_need: formData.need, telegram_handle: formData.telegram, 
          website_url: formData.website, vetting_tier: formData.tier, 
          deck_url: formData.deck, description: formData.description,
          is_verified: false, vetting_process_complete: false
      }]);
      if (error) throw error;
      setShowSuccess(true);
      setFormData({ name: '', chain: 'Ethereum', stage: 'Seed', need: 'Lead VC', telegram: '', website: '', tier: 'Genesis', deck: '', description: '' });
    } catch (err) {
      alert("Verification request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

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
        {/* --- HERO --- */}
        <header className="py-24 px-6 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black mb-8 tracking-widest uppercase animate-pulse">
            <Zap className="w-3 h-3" /> Protocol Active
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 italic uppercase text-white leading-none">Trust <span className="text-cyan-400">Layer.</span></h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium italic max-w-3xl mx-auto mb-16 px-4 leading-relaxed italic">
            "Psalm3 is the industry's security-first alliance layer and institutional trust protocol."
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5">
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><TrendingUp className="w-3 h-3 text-cyan-400" /> TVV</span>
              <div className="text-3xl font-black text-cyan-400">${totalVetted.toLocaleString()}</div>
            </div>
            <div className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-3 h-3 text-cyan-400" /> Deals</span>
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

        {/* --- SCORECARD SECTION --- */}
        <section id="protocol" className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Institutional <span className="text-cyan-400">Readiness</span></h2>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
            <div className="space-y-8">
              {scorecardQuestions.map((q) => (
                <div key={q.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div><span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest block mb-1">{q.category}</span><p className="text-sm font-bold text-gray-300">{q.text}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => handleScoreChange(q.id, true)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${answers[q.id] === true ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-white/5 text-gray-500 border border-white/10'}`}>Yes</button>
                    <button onClick={() => handleScoreChange(q.id, false)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${answers[q.id] === false ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500 border border-white/10'}`}>No</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-cyan-400/5 border border-cyan-400/20 rounded-3xl text-center">
              <div className="mb-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Progress: {answeredCount}/9</div>
              <button disabled={answeredCount < 9} onClick={() => setShowScoreResult(true)} className="bg-cyan-400 text-black px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50">Get Result</button>
            </div>
          </div>
        </section>

        {/* --- METHODOLOGY VAULT --- */}
        <section id="methodology" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-500/[0.02]">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
              The <span className="text-cyan-400">Methodology</span> Vault
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Evaluating projects across 48 data points to ensure only high-signal builds receive the Psalm3 Shield.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center md:text-left">
            {[
              { title: "Technical Integrity", desc: "Deep-dive analysis of GitHub, contract security, and codebase architecture.", icon: <Zap className="w-6 h-6 text-cyan-400" /> },
              { title: "Economic Logic", desc: "Stress-testing tokenomics against market volatility and emission schedules.", icon: <TrendingUp className="w-6 h-6 text-cyan-400" /> },
              { title: "Team Status", desc: "Multi-factor verification of core contributors and historical track records.", icon: <Lock className="w-6 h-6 text-cyan-400" /> }
            ].map((pillar) => (
              <div key={pillar.title} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-cyan-400 transition-all">
                <div className="mb-6 flex justify-center md:justify-start">{pillar.icon}</div>
                <h3 className="text-xl font-black uppercase italic mb-4">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-[40px] border border-white/5 bg-white/[0.01]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <th className="p-8">Audit Pillar</th>
                  <th className="p-8">Genesis Requirement</th>
                  <th className="p-8">Alliance Standard</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold">
                {[
                  { p: "Documentation", g: "Litepaper Required", a: "Full Tech Spec" },
                  { p: "Team Status", g: "Social Verification", a: "Institutional KYC" },
                  { p: "Security", g: "Internal Review", a: "3rd Party Audit" }
                ].map((row) => (
                  <tr key={row.p} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-8 text-white uppercase italic">{row.p}</td>
                    <td className="p-8 text-gray-500">{row.g}</td>
                    <td className="p-8 text-cyan-400">{row.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: 'Genesis', price: '$49', features: ['Basic Profile', 'Ecosystem Listing', 'Verified Announcement'] },
              { tier: 'Verified', price: '$149', features: ['Shield Badge', 'Priority Queue', 'Partners Introduction'] },
              { tier: 'Alliance', price: '$499', features: ['Neon Glow Status', 'Direct VC Introduction', 'Strategic Advisory'] }
            ].map((p) => (
              <div key={p.tier} className={`p-10 rounded-[40px] border flex flex-col ${p.tier === 'Alliance' ? 'border-cyan-400 alliance-glow' : 'border-white/5 bg-white/[0.01]'}`}>
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">{p.tier}</h4>
                <div className="text-4xl font-black mb-8 italic">{p.price}</div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {p.features.map(f => <li key={f} className="text-xs font-bold text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-cyan-400" /> {f}</li>)}
                </ul>
                <button onClick={() => { setFormData({...formData, tier: p.tier}); setIsModalOpen(true); }} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase hover:bg-cyan-400 hover:text-black transition-all">Join {p.tier}</button>
              </div>
            ))}
          </div>
        </section>

        {/* --- DIRECTORY --- */}
        <section id="vetting" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-2xl font-black uppercase italic text-gray-500 tracking-widest">Active Deal Flow</h2>
            <div className="flex flex-wrap gap-2">
              {chains.map(c => (
                <button key={c} onClick={() => setActiveChain(c)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${activeChain === c ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg' : 'bg-white/5 text-gray-500 border-white/10'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.filter(p => activeChain === 'All' || p.chain === activeChain).map((p) => (
              <div key={p.id} className={`bg-[#0D1117] border p-10 rounded-[40px] relative group ${p.vetting_tier === 'Alliance' ? 'alliance-glow border-cyan-400' : 'border-white/5'}`}>
                <div className="absolute top-6 left-6 flex gap-2">
                  {p.vetting_tier === 'Alliance' && <div className="bg-cyan-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1 shadow-[0_0_15px_#22d3ee]"><Star className="w-3 h-3 fill-black" /> Alliance</div>}
                  {p.vetting_tier === 'Verified' && <div className="bg-white/10 text-cyan-400 border border-cyan-400/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</div>}
                  {p.vetting_tier === 'Genesis' && <div className="bg-white/5 text-gray-400 border border-white/10 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">Genesis</div>}
                  <div className="bg-white/5 text-gray-400 border border-white/10 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">{p.chain}</div>
                </div>
                <h3 className="text-3xl font-black mt-12 uppercase italic mb-4 tracking-tight">{p.project_name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/5 py-6 text-[10px] font-black uppercase tracking-widest">
                  <div><span className="text-gray-600 block mb-1">Seeking</span> <span className="text-cyan-400">{p.partnership_need}</span></div>
                  <div><span className="text-gray-600 block mb-1">Stage</span> <span className="text-white">{p.stage}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => window.open(p.website_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black font-black transition-all text-[10px] uppercase">Website</button>
                  <button onClick={() => window.open(p.deck_url)} className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 font-black transition-all text-[10px] uppercase">Deck</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- MODALS --- */}
      {showScoreResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowScoreResult(false)} />
          <div className="bg-[#0D1117] border border-cyan-400/30 w-full max-w-md p-10 rounded-[40px] relative z-10 text-center alliance-glow shadow-2xl">
            <button onClick={() => setShowScoreResult(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X /></button>
            <div className="text-6xl font-black italic mb-2">{score}<span className="text-2xl text-gray-600">/9</span></div>
            <div className={`text-4xl font-black uppercase italic mb-6 ${getResultTier().color}`}>{getResultTier().label}</div>
            <p className="text-gray-400 text-sm mb-8 italic">{getResultTier().desc}</p>
            <button onClick={() => { setShowScoreResult(false); setIsModalOpen(true); }} className="w-full bg-cyan-400 text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-400/20 hover:scale-105 transition-all">Apply for Report</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl p-10 rounded-[50px] relative z-10 max-h-[90vh] overflow-y-auto shadow-2xl">
            {!showSuccess ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-4xl font-black uppercase italic text-cyan-400 text-center mb-6 tracking-tighter">Protocol Apply</h2>
                <div className="space-y-4">
                  <input required placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400 transition-all" />
                  <textarea required placeholder="Institutional Description" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-sm text-white focus:border-cyan-400 transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.need} onChange={(e) => setFormData({...formData, need: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none appearance-none cursor-pointer">
                      {partnershipNeeds.map(n => <option key={n} value={n} className="bg-[#0D1117]">{n}</option>)}
                    </select>
                    <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none appearance-none cursor-pointer">
                      <option value="Seed">Seed</option><option value="Private">Private</option><option value="Public">Public</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="TG Handle" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400 transition-all" />
                    <select value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-white outline-none appearance-none cursor-pointer">
                      {chains.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#0D1117]">{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-4">
                    {['Genesis', 'Verified', 'Alliance'].map(t => <button key={t} type="button" onClick={() => setFormData({...formData, tier: t})} className={`py-4 rounded-xl text-[9px] font-black uppercase border transition-all ${formData.tier === t ? 'bg-cyan-400 text-black border-cyan-400 shadow-xl shadow-cyan-400/20' : 'bg-white/5 border-white/10 text-gray-500'}`}>{t}</button>)}
                  </div>
                  <input required placeholder="Website URL" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold outline-none text-white focus:border-cyan-400 transition-all" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-400 text-black font-black py-6 rounded-3xl uppercase text-sm tracking-widest hover:scale-[1.02] disabled:opacity-50 transition-all shadow-xl shadow-cyan-400/30">{isSubmitting ? 'Verifying...' : 'Submit Secured Request'}</button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="bg-cyan-400/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-400/20 shadow-lg"><ClipboardCheck className="w-10 h-10 text-cyan-400" /></div>
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white tracking-tighter">Protocol Sent</h2>
                <button onClick={() => window.open('https://t.me/CEO_Psalms', '_blank')} className="w-full bg-white text-black font-black py-6 rounded-3xl uppercase text-sm hover:bg-cyan-400 transition-all shadow-2xl">Connect Analyst</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#080a0e] pt-20 pb-10 px-6 mt-20 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
              <ShieldCheck className="text-cyan-400 w-6 h-6" />
              <span className="text-xl font-black uppercase italic tracking-[0.2em]">Psalm3</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm italic mx-auto md:mx-0 leading-relaxed italic">Psalm3 is the industry's security-first trust protocol.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-6">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li onClick={() => scrollToSection('vetting')} className="hover:text-cyan-400 cursor-pointer transition-colors">Live Queue</li>
              <li onClick={() => scrollToSection('protocol')} className="hover:text-cyan-400 cursor-pointer flex items-center gap-2 justify-center md:justify-start transition-colors">Standards <ChevronRight className="w-3 h-3"/></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-6">Social</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="https://x.com/MyFounder_com" className="p-3 bg-white/5 border border-white/10 hover:text-cyan-400 rounded-xl transition-all shadow-xl"><Twitter className="w-5 h-5" /></a>
              <a href="https://t.me/CEO_Psalms" className="p-3 bg-white/5 border border-white/10 hover:text-cyan-400 rounded-xl transition-all shadow-xl"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-600 text-[9px] font-black uppercase tracking-widest pt-10 border-t border-white/5">© 2026 Psalm3 Protocol. All Rights Reserved.</p>
      </footer>
    </div>
  );
}