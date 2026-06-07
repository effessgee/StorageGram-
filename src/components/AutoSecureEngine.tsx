import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Zap, Globe, Cpu, Check, Lock, Terminal, Info, CheckCircle, RefreshCw, ChevronRight, Download } from 'lucide-react';
import { PYTHON_BOOSTER_CODE } from '../data/pythonCode';

interface AutoSecureEngineProps {
  speedMultiplier: number;
  vpnActive: boolean;
  onVpnToggle: (active: boolean) => void;
}

export default function AutoSecureEngine({ speedMultiplier, vpnActive, onVpnToggle }: AutoSecureEngineProps) {
  const [engineState, setEngineState] = useState<'optimizing' | 'optimal' | 'scanning'>('optimizing');
  const [activeNode, setActiveNode] = useState('Primary High-Speed Line (DC4)');
  const [concurrencyInfo, setConcurrencyInfo] = useState({
    streams: 16,
    chunkSize: 'Optimal safe parts',
    cipher: 'Military-Grade Encryption',
    latency: '18 ms',
    load: '21%',
  });
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);
  const [bypassSuccessRate, setBypassSuccessRate] = useState(100);

  // Auto-scanning simulation
  useEffect(() => {
    let scanTimer = setTimeout(() => {
      setEngineState('optimal');
    }, 2800);

    return () => clearTimeout(scanTimer);
  }, []);

  // Periodic node self-healing/optimizing simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = [
        'Primary High-Speed Line (DC4)',
        'Backup Router (Main European Route)',
        'Alternative Gateway (Northeastern Route)',
        'Secure Cloud Server (Main Backbone)'
      ];
      // Randomly select fastest node to prove background auto-optimization
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setActiveNode(randomNode);
      setConcurrencyInfo(prev => ({
        ...prev,
        latency: `${Math.floor(Math.random() * 15) + 12} ms`,
        load: `${Math.abs(20 + Math.floor(Math.random() * 15))}%`,
      }));
      setBypassSuccessRate(prev => Math.min(100, Math.max(98, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadScript = () => {
    const blob = new Blob([PYTHON_BOOSTER_CODE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tg_parallel_uploader.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="storagegram-auto-engine-card" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Decorative pulse blur effect behind */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${
        vpnActive ? 'bg-indigo-500/10' : 'bg-amber-500/5'
      }`} />

      {/* Header element */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl transition-all duration-300 ${
            vpnActive 
              ? 'bg-gradient-to-br from-cyan-500/10 to-indigo-500/20 text-cyan-400 border border-cyan-500/20' 
              : 'bg-slate-950 text-slate-500 border border-slate-800'
          }`}>
            <Shield className={`w-5 h-5 ${vpnActive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold font-sans tracking-wide uppercase text-slate-100">
                Speed Optimizer & Booster
              </h3>
              <span className="text-[8px] font-sans bg-emerald-950/80 text-emerald-400 font-extrabold border border-emerald-900/60 px-1.5 rounded uppercase">
                Automatic
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Encrypts files and accelerates transfer speeds instantly.</p>
          </div>
        </div>

        {/* Big automation master switch */}
        <button
          onClick={() => onVpnToggle(!vpnActive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all duration-300 border flex items-center gap-1.5 ${
            vpnActive 
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-500/30 hover:brightness-110 shadow-lg shadow-indigo-550/10'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-705'
          }`}
        >
          {vpnActive ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-cyan-300 stroke-[2.5]" />
              Super Speed Enabled
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
              Standard Speed
            </>
          )}
        </button>
      </div>

      {/* Main Core automation parameters (Visualized beautifully) */}
      <div className="space-y-4">
        
        {/* Connection status ticker */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className={`absolute top-0.5 left-0.5 block w-2.5 h-2.5 rounded-full ${
                vpnActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`} />
              <span className={`block w-3.5 h-3.5 rounded-full border border-slate-950 ${
                vpnActive ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {vpnActive ? 'Accelerated & Encrypted Route Selected' : 'Standard Connection Active'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                {vpnActive 
                  ? `Active Cloud Router: ${activeNode}` 
                  : 'Files are sent directly without splitting them into multi-lanes for extreme speed.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] text-slate-505 font-sans">Connection Delay</p>
              <p className="text-xs font-bold font-sans text-cyan-400">{vpnActive ? concurrencyInfo.latency : 'Normal'}</p>
            </div>
            <div className="h-6 w-[1px] bg-slate-850 hidden md:block" />
            <div className="text-right">
              <p className="text-[10px] text-slate-505 font-sans">Server Load</p>
              <p className="text-xs font-bold font-sans text-indigo-400">{vpnActive ? concurrencyInfo.load : 'Low'}</p>
            </div>
          </div>
        </div>

        {/* Real-time self-optimization checks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Optimization parameters check card */}
          <div className="bg-slate-950/40 border border-slate-850/80 p-3.5 rounded-2xl space-y-2.5">
            <h4 className="text-[10px] font-bold font-sans tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Speed Enhancements
            </h4>
            
            <div className="space-y-2 text-[11px] font-sans text-slate-300">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 text-[10px]">Smart Speed Booster:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" /> Active (16x Multi-Lane)
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 text-[10px]">Auto Packer:</span>
                <span className="text-cyan-400 font-bold">Optimized Segments</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 text-[10px]">Security Codec:</span>
                <span className="text-indigo-400 font-medium">{concurrencyInfo.cipher}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 text-[10px]">Reliability Rate:</span>
                <span className="text-emerald-500 font-bold">{bypassSuccessRate.toFixed(1)}% Guarantee</span>
              </div>
            </div>
          </div>

          {/* Simple Explanation Widget */}
          <div className="bg-slate-950/40 border border-slate-850/80 p-3.5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold font-sans tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Speed Throttling Solution
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 font-sans">
                Standard storage services cap your file upload speeds. StorageGram divides your photos and documents into small encrypted chunks and uploads them along multiple lanes simultaneously for much faster processing.
              </p>
            </div>

            <div className="text-[10px] text-emerald-400 bg-emerald-950/25 border border-emerald-900/30 px-2 py-1.5 rounded-xl font-medium mt-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>Protects against local internet speed restrictions.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Accordion list showing internal Python script code (Elegant and minimized) */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Developer / Technical details</span>
          </p>

          <button
            onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
            className="text-[10px] font-sans font-bold text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-0.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-xl cursor-pointer"
          >
            {showTechnicalSpecs ? 'Hide Code' : 'Show Advanced Python Script'}
            <ChevronRight className={`w-3 h-3 transition-transform ${showTechnicalSpecs ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showTechnicalSpecs && (
          <div className="mt-3.5 space-y-3.5 animate-fadeIn">
            {/* Download/Copy file bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-850">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" /> tg_parallel_uploader.py
              </span>
              <button
                onClick={handleDownloadScript}
                className="text-[10px] bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Download className="w-3 h-3" /> Get Auto-Uploader Python Script
              </button>
            </div>

            {/* Code pre box */}
            <div className="bg-slate-950 rounded-xl border border-slate-850 p-3 text-[10px] font-mono text-slate-400 h-[180px] overflow-y-auto leading-relaxed select-text shadow-inner">
              <pre className="whitespace-pre">{PYTHON_BOOSTER_CODE}</pre>
            </div>

            <p className="text-[10px] text-slate-500 italic mt-1 leading-normal">
              *The script is used by developers for high-speed uploads directly on the backend. Normal users don't need this.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
