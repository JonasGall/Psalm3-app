"use client";
import React from 'react';
import { 
  ShieldCheck, CheckCircle2, Star, Zap, Lock, 
  BarChart3, Users, Scale, FileSearch 
} from 'lucide-react';

export default function VettingGuide() {
  const tiers = [
    {
      name: "Verified Tier",
      icon: <ShieldCheck className="w-8 h-8 text-white/50" />,
      glow: "border-white/10",
      description: "Standard verification for institutional-ready projects entering the ecosystem.",
      requirements: [
        "KYC/KYB Verification completed",
        "Publicly accessible Whitepaper/Litepaper",
        "Functional MVP or Testnet",
        "Verified Social Presence"
      ]
    },
    {
      name: "Alliance Partner",
      icon: <Star className="w-8 h-8 text-cyan-400 fill-cyan-400" />,
      glow: "border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/30",
      description: "Elite status reserved for high-signal infrastructure with proven security standards.",
      requirements: [
        "Full Security Audit by Tier-1 Firm",
        "On-chain traction or high-profile lead VC",
        "Direct Protocol Partnership with Psalm3",
        "Strategic Ecosystem Contribution"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans py-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black mb-8 tracking-widest uppercase">
            Protocol Standards v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8">Vetting <span className="text-cyan-400">Process.</span></h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium italic max-w-2xl mx-auto">
            "Transparency is the foundation of institutional trust. Our multi-stage vetting ensures only high-signal deal flow reaches our network."
          </p>
        </div>

        {/* TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {tiers.map((tier) => (
            <div key={tier.name} className={`bg-[#0D1117] p-12 rounded-[50px] border ${tier.glow} transition-all`}>
              <div className="mb-6">{tier.icon}</div>
              <h3 className="text-3xl font-black uppercase italic mb-4">{tier.name}</h3>
              <p className="text-gray-400 text-sm mb-10 italic leading-relaxed">{tier.description}</p>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Requirements</h4>
                {tier.requirements.map((req) => (
                  <div key={req} className="flex items-center gap-3 text-xs font-bold text-gray-300 italic">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> {req}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* THE 4 PILLARS */}
        <div className="border-t border-white/5 pt-24">
          <h2 className="text-4xl font-black uppercase italic mb-16 text-center tracking-tight">The Four Pillars of <span className="text-cyan-400">Trust</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FileSearch className="w-10 h-10 text-cyan-400 mx-auto mb-6" />
              <h5 className="text-[10px] font-black uppercase tracking-widest mb-3">Audit Review</h5>
              <p className="text-gray-500 text-[10px] italic leading-relaxed">Deep-dive analysis of smart contract security and logic.</p>
            </div>
            <div className="text-center">
              <Users className="w-10 h-10 text-cyan-400 mx-auto mb-6" />
              <h5 className="text-[10px] font-black uppercase tracking-widest mb-3">Founder KYC</h5>
              <p className="text-gray-500 text-[10px] italic leading-relaxed">Identity verification to eliminate anonymous rug-risk.</p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-cyan-400 mx-auto mb-6" />
              <h5 className="text-[10px] font-black uppercase tracking-widest mb-3">Tokenomics</h5>
              <p className="text-gray-500 text-[10px] italic leading-relaxed">Sustainability audit of supply distribution and cliff schedules.</p>
            </div>
            <div className="text-center">
              <Scale className="w-10 h-10 text-cyan-400 mx-auto mb-6" />
              <h5 className="text-[10px] font-black uppercase tracking-widest mb-3">Scalability</h5>
              <p className="text-gray-500 text-[10px] italic leading-relaxed">Assessment of infrastructure capacity for ecosystem growth.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 bg-cyan-400 p-16 rounded-[60px] text-center text-black">
          <h2 className="text-5xl font-black uppercase italic mb-6 leading-none tracking-tighter">Ready to Verify?</h2>
          <p className="text-black/70 font-bold italic mb-10 max-w-lg mx-auto">Apply today to move through the Psalm3 Trust Layer and unlock institutional capital.</p>
          <button onClick={() => window.location.href='/'} className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
            Open Protocol Application
          </button>
        </div>

      </div>
    </div>
  );
}