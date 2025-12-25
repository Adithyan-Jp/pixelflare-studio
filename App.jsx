import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Library, Plus, Maximize2, Cpu, History, 
  Bell, User, X, Clock, LogOut, Lock, AtSign, MessageSquare, 
  Trash, Paperclip, Wand2, BrainCircuit, Send, Loader2,
  ChevronDown, ArrowRight
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  doc, deleteDoc, updateDoc, query, orderBy 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// --- 1. CONFIG & API ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'pixelflare-studio-production';

// Securely access the API key for both local and Vercel environments
const getApiKey = () => {
  try {
    // Vercel/Vite standard
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
    // Node/Process fallback
    if (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
      return process.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    // Fallback for restricted environments
  }
  return ""; 
};

const apiKey = getApiKey();

// --- 2. STYLE PRESETS ---
const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, masterpiece, sharp focus' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, studio ghibli aesthetic, vibrant, hand-drawn' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit, detailed sprites, retro aesthetic' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed skin texture, 85mm lens, sharp' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city, synthwave colors, futuristic glow' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, octane render, 3d isometric, high fidelity' },
  { id: 'oil', label: 'Oil Painting', suffix: 'classical oil painting, visible brushstrokes, canvas texture, masterpiece' },
  { id: 'sketch', label: 'Sketch', suffix: 'charcoal sketch, hand-drawn on textured paper, artistic shading' },
  { id: 'vaporwave', label: 'Vaporwave', suffix: 'vaporwave aesthetic, 80s retro, pastel colors, glitch art' },
];

// --- 3. GEMINI API UTILS ---

const callGemini = async (userQuery, systemPrompt) => {
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    return null;
  }
};

const analyzeImageGemini = async (base64Data, prompt) => {
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const data = base64Data.split(',')[1] || base64Data;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: "image/png", data: data } }] }]
      })
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    return null;
  }
};

// --- 4. GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background: #070708; color: white; margin: 0; overflow: hidden; text-align: left; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #10b981; }
    .glass { background: rgba(15, 15, 17, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .chat-gradient { background: linear-gradient(to bottom, transparent, #070708 90%); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    
    @keyframes rim-loading {
      0% { transform: rotate(0deg); stroke-dashoffset: 280; }
      50% { stroke-dashoffset: 140; }
      100% { transform: rotate(360deg); stroke-dashoffset: 0; }
    }
    .animate-rim-loading { animation: rim-loading 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    
    @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
    .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
    
    @keyframes status-shine { from { text-shadow: 0 0 2px rgba(16, 185, 129, 0.2); opacity: 0.8; } to { text-shadow: 0 0 14px rgba(16, 185, 129, 1); opacity: 1; } }
    .flare-active-glow { color: #10b981; font-weight: 700; animation: status-shine 1.8s ease-in-out infinite alternate; }
  `}</style>
);

// --- 5. SUB-COMPONENTS (Safe Load Order) ---

function PixelflareLogo({ className = "", size = 32, igniting = false }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size + 20, height: size + 20 }}>
      {igniting && (
        <svg width={size + 14} height={size + 14} viewBox="0 0 100 100" className="absolute animate-rim-loading">
          <circle 
            cx="50" cy="50" r="45" 
            stroke="url(#rimGrad)" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray="140 140"
          />
          <defs>
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
      )}
      <div className={`absolute inset-0 bg-emerald-500/10 rounded-full transition-all duration-1000 ${igniting ? 'animate-pulse-glow opacity-100' : 'opacity-20'}`} />
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="relative z-10">
        <rect x="5" y="5" width="30" height="30" rx="8" stroke="#10b981" strokeWidth="2.5" opacity="0.4" />
        <path d="M20 8L22.5 17.5L32 20L22.5 22.5L20 32L17.5 22.5L8 20L17.5 17.5L20 8Z" fill="#10b981" />
        <rect x="18.5" y="18.5" width="3" height="3" rx="0.5" fill="white" />
      </svg>
    </div>
  );
}

function SidebarBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-950/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'}`}>
      <Icon size={18} />
      <span className="font-semibold text-sm tracking-tight text-left">{label}</span>
    </button>
  );
}

function ThreadItem({ thread, active, onClick, onDelete }) {
  return (
    <div className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all ${active ? 'bg-white/5 text-white shadow-xl' : 'text-zinc-600 hover:bg-white/[0.02] hover:text-zinc-300'} cursor-pointer`} onClick={onClick}>
      <div className="flex items-center space-x-3 overflow-hidden text-left">
        <MessageSquare size={14} className={active ? 'text-emerald-400' : 'text-zinc-800'} />
        <span className="text-xs font-medium truncate">{thread.name || 'Untitled session'}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDelete(thread.id); }} className="p-1.5 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash size={12} />
      </button>
    </div>
  );
}

function HubView({ setTab, vaultCount, userEmail }) {
  const email = userEmail || 'Guest';
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-white text-left p-12 max-w-6xl mx-auto">
      <div className="relative p-14 bg-[#0c0c0e] border border-white/5 rounded-[48px] overflow-hidden group shadow-2xl text-left">
        <div className="relative z-10 space-y-8 max-w-2xl text-left text-white">
          <div className="space-y-4 text-left">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-emerald-500/20 shadow-md">Studio Verified</span>
            <h1 className="text-6xl font-bold leading-tight tracking-tighter text-white text-left text-balance">Welcome back,<br/><span className="text-emerald-400 italic text-left">{email.split('@')[0]}</span>.</h1>
          </div>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-lg text-left text-balance">Your private workstation is active. Start a neural conversation to manifest vision artifacts.</p>
          <button onClick={() => setTab('engine')} className="px-10 py-4 bg-emerald-600 rounded-[24px] font-bold flex items-center hover:bg-emerald-50 transition-all text-base active:scale-95 shadow-xl text-white text-nowrap">
            Launch Engine Interface <ArrowRight size={20} className="ml-3 inline" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-left text-white">
         <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl text-left text-white"><Library size={24} className="text-zinc-700" /><div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Archive</p><h3 className="text-3xl font-bold text-center tracking-tight text-white">{vaultCount} Assets</h3></div></div>
         <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl text-left text-white"><Cpu size={24} className="text-emerald-400" /><div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Node</p><h3 className="text-3xl font-bold text-emerald-400 text-center tracking-tight text-white">Active</h3></div></div>
         <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl cursor-pointer hover:bg-rose-500/5 transition-colors group text-left text-white" onClick={() => signOut(auth)}>
           <LogOut size={24} className="text-rose-500 group-hover:scale-110 transition-transform text-left text-white" />
           <div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center text-white">Identity</p><h3 className="text-3xl font-bold text-center tracking-tight text-white">Logout</h3></div>
         </div>
      </div>
    </div>
  );
}

function AuthPage({ authError, setAuthError }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); setAuthError('');
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) { setAuthError(err.message.replace('Firebase:', '').trim()); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070708] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/[0.05] rounded-full blur-[250px] text-left" />
      <div className="w-full max-w-md glass rounded-[56px] p-10 space-y-8 shadow-2xl relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-500 text-left text-white">
        <div className="text-center space-y-4">
          <PixelflareLogo className="mx-auto mb-6 transform scale-150 rotate-12 text-left" size={40} />
          <h1 className="text-4xl font-bold tracking-tighter text-white">Pixelflare</h1>
          <p className="text-zinc-500 text-sm font-medium">Neural Studio Workspace</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5 text-left text-white">
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 text-left text-white">Identity</label><div className="relative text-left text-white"><AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="email@address.com" /></div></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 text-left text-white">Keyphrase</label><div className="relative text-left text-white"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="••••••••" /></div></div>
          {authError && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-semibold text-left">{authError}</div>}
          <button type="submit" disabled={loading} className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-50 text-white font-bold rounded-[22px] shadow-xl text-white">{loading ? <Loader2 className="animate-spin mx-auto text-white" size={20} /> : <span className="text-white">Sign In / Initialise</span>}</button>
        </form>
        <div className="space-y-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-zinc-500 text-xs font-semibold hover:text-emerald-400 transition-colors uppercase tracking-widest text-white">{isLogin ? "Need a node? Register" : "Have an ID? Login"}</button>
          <div className="h-px bg-white/5 w-full" />
          <button onClick={() => signInAnonymously(auth)} className="w-full text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white text-white text-center text-nowrap">Continue as Guest</button>
        </div>
      </div>
    </div>
  );
}

function ChatInputBar({ onSend, isGenerating, isRefining, onRefine, onUpload }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const fileRef = useRef(null);

  const handleEnter = (e) => { if(e.key === 'Enter') send(); };
  const send = () => { if(!input.trim() || isGenerating) return; onSend(input, style); setInput(''); };
  const refine = async () => { const res = await onRefine(input); if(res) setInput(res); };
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpload({ title: 'Chat Attachment', url: reader.result, style: 'Manual' });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute bottom-0 inset-x-0 p-8 chat-gradient pointer-events-none text-left text-white">
      <div className="max-w-4xl mx-auto pointer-events-auto text-left text-white">
        <div className="glass rounded-[36px] p-3.5 shadow-2xl flex flex-col space-y-3.5 border border-white/10 text-left text-white">
          <div className="flex items-center space-x-3 px-5 pb-3 border-b border-white/5 overflow-x-auto scrollbar-hide text-left text-white">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mr-2 text-nowrap text-left text-white">Neural Cluster:</span>
            {STYLE_PRESETS.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap text-white ${style === s.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-white/5 text-zinc-500 border-white/5 hover:text-white'}`}>{s.label}</button>
            ))}
          </div>
          <div className="flex items-center space-x-3 pl-5 pr-1 text-left text-white text-white">
            <button onClick={() => fileRef.current.click()} className="p-3 text-zinc-600 hover:text-emerald-400 transition-colors text-white"><Paperclip size={22} /><input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} /></button>
            <input className="flex-1 bg-transparent outline-none text-white font-medium text-lg placeholder:text-zinc-800 text-left text-white text-white" placeholder="Ignite a vision..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleEnter} />
            <button onClick={refine} disabled={isRefining || !input.trim()} className={`p-3 transition-all text-white ${isRefining ? 'animate-pulse text-emerald-400' : 'text-zinc-600 hover:text-emerald-400'}`} title="Smart Refine ✨"><Wand2 size={22} className="text-white" /></button>
            <button onClick={send} disabled={!input.trim() || isGenerating} className={`w-12 h-12 rounded-[18px] flex items-center justify-center bg-emerald-500 text-white shadow-xl active:scale-95 text-white ${!input.trim() || isGenerating ? 'opacity-40 grayscale' : ''}`}><Send size={22} className="text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtifactView({ flare, onClose, onSave }) {
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeImageGemini(flare.url, "Explain visual DNA in 3 points. Suggest a prompt.");
    setAnalysis(result);
    setAnalyzing(false);
  };

  if (!flare) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={onClose} />
      <div className="relative w-full max-w-5xl glass rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl h-[75vh] border border-white/10 text-left text-white">
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img src={flare.url} className="max-w-full max-h-full object-contain p-4" alt="View" />
        </div>
        <div className="w-[380px] border-l border-white/5 flex flex-col p-10 space-y-8 bg-[#0c0c0e] text-left overflow-y-auto scrollbar-hide text-white">
          <div><h2 className="text-2xl font-bold text-white tracking-tight">{flare.title || 'Artifact'}</h2><p className="text-emerald-500 font-bold uppercase text-[9px] tracking-[0.2em]">{flare.style || 'Neural'}</p></div>
          <div className="space-y-4 text-white">
            <button onClick={runAnalysis} disabled={analyzing} className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center space-x-3 text-xs font-bold text-emerald-400 active:scale-95">
              {analyzing ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
              <span>Analyze visual dna ✨</span>
            </button>
            {analysis && <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-xs text-zinc-300 leading-relaxed text-white">{analysis}</div>}
          </div>
          <button onClick={onClose} className="mt-auto py-4 bg-white text-black font-bold rounded-2xl text-sm shadow-xl hover:bg-emerald-400 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
}

function UploadView({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async () => {
    if (!preview) return;
    setLoading(true);
    await onUpload({ title: title || 'Manual Artifact', url: preview, style: 'Upload' });
    setLoading(false); setPreview(null); setTitle('');
  };

  return (
    <div className="h-full flex items-center justify-center p-12 text-left text-white">
      <div className="w-full max-w-4xl glass rounded-[48px] p-12 flex flex-col items-center space-y-10 border border-white/5">
        <div className="text-center space-y-3">
          <h2 className="text-5xl font-bold tracking-tighter text-white text-center">Manual Upload</h2>
          <p className="text-zinc-500 text-xl font-medium text-center">Add reference artifacts to your private vault.</p>
        </div>
        {!preview ? (
          <label className="w-full aspect-video border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center space-y-4 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group text-center">
            <Paperclip size={48} className="text-zinc-600 group-hover:text-emerald-400 transition-transform group-hover:scale-110 mx-auto" />
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest text-center">Select Image</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
          </label>
        ) : (
          <div className="w-full space-y-8 animate-in zoom-in-95 duration-500 text-left">
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center">
              <img src={preview} className="max-w-full max-h-full object-contain" alt="Preview" />
              <button onClick={() => setPreview(null)} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex space-x-4 text-white">
               <input value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 bg-zinc-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 text-left" placeholder="Artifact Name..." />
               <button onClick={handleFinish} disabled={loading} className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 text-white">{loading ? <Loader2 className="animate-spin text-white" /> : <span className="text-white">Add to Vault</span>}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 6. MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [vaultItems, setVaultItems] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedFlare, setSelectedFlare] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const threadsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads');
    const unsubThreads = onSnapshot(threadsRef, snap => {
      const ts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      ts.sort((a, b) => b.timestamp - a.timestamp);
      setThreads(ts);
      if (ts.length > 0 && !activeThreadId) setActiveThreadId(ts[0].id);
    });
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'asset_vault');
    const unsubVault = onSnapshot(vaultRef, snap => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => b.timestamp - a.timestamp);
      setVaultItems(items);
    });
    return () => { unsubThreads(); unsubVault(); };
  }, [user]);

  useEffect(() => {
    if (!user || !activeThreadId) { 
      setChatMessages([{ role: 'ai', type: 'text', content: 'Neural workshop standing by.' }]); 
      return; 
    }
    const msgRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId, 'messages');
    const unsubMsgs = onSnapshot(msgRef, snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => a.timestamp - b.timestamp);
      setChatMessages(msgs.length > 0 ? msgs : [{ role: 'ai', type: 'text', content: 'Flare is ready. Ignite your vision ✨' }]);
    });
    return () => unsubMsgs();
  }, [user, activeThreadId]);

  const handleRefinePrompt = async (current) => {
    if (!current.trim()) return current;
    setIsRefining(true);
    const res = await callGemini(current, "Rewrite the user short idea into a professional cinematic image prompt. 50 words max. Output ONLY prompt text.");
    setIsRefining(false);
    return res || current;
  };

  const handleSend = async (content, style) => {
    if (!user || !activeThreadId) return;
    setIsGenerating(true);
    const msgRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId, 'messages');
    await addDoc(msgRef, { role: 'user', type: 'text', content, timestamp: Date.now() });

    if (chatMessages.length <= 1) {
      const threadName = await callGemini(content, "Generate a cool 2-word title for this session. No extra text.");
      if (threadName) updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId), { name: threadName });
    }

    try {
      const styleData = STYLE_PRESETS.find(s => s.id === style);
      const full = encodeURIComponent(`${content}, ${styleData?.suffix}`);
      const imageUrl = `https://image.pollinations.ai/prompt/${full}?seed=${Math.floor(Math.random()*1000000)}&width=1024&height=1024&nologo=true`;
      await addDoc(msgRef, { role: 'ai', type: 'image', content: imageUrl, prompt: content, style, timestamp: Date.now() });
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const saveToVault = async (item) => {
    if (!user) return;
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'asset_vault');
    await addDoc(vaultRef, { ...item, date: new Date().toISOString().split('T')[0], timestamp: Date.now() });
    setActiveTab('library');
  };

  const handleNewChat = async () => {
    if (!user) return;
    const tr = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads'), { name: 'New Session...', timestamp: Date.now() });
    setActiveThreadId(tr.id); 
    setActiveTab('engine');
    setIsHistoryOpen(true);
  };

  if (authLoading) return <div className="h-screen bg-[#070708] flex items-center justify-center text-left text-white"><Loader2 className="animate-spin text-emerald-500 text-white" size={48} /></div>;
  if (!user) return <><GlobalStyles /><AuthPage authError={authError} setAuthError={setAuthError} /></>;

  return (
    <div className="flex h-screen bg-[#070708] text-white overflow-hidden text-left antialiased text-white">
      <GlobalStyles />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"><div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.05] rounded-full blur-[180px] text-left text-white text-white" /></div>

      <aside className="w-[320px] border-r border-white/5 bg-[#070708]/80 backdrop-blur-3xl flex flex-col p-8 space-y-12 z-20 text-left text-white text-white">
        <div className="flex items-center space-x-4 text-left cursor-pointer text-white text-white text-white" onClick={() => setActiveTab('dashboard')}><PixelflareLogo igniting={isGenerating} size={36} className="text-white" /><span className="text-3xl font-bold tracking-tighter text-white text-white">Pixelflare</span></div>
        <nav className="space-y-3 text-left text-white">
          <SidebarBtn icon={LayoutDashboard} label="Hub" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarBtn icon={Plus} label="New Engine Thread" active={activeTab === 'engine'} onClick={handleNewChat} />
          <SidebarBtn icon={Upload} label="Upload Artifact" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
          <SidebarBtn icon={Library} label="Asset Vault" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        </nav>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden text-left text-white">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="flex items-center justify-between px-2 w-full hover:bg-white/5 p-2 rounded-xl transition-all group">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-left group-hover:text-emerald-400">Neural History</span>
            <div className={`transition-transform duration-300 ${isHistoryOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={14} className="text-zinc-500" />
            </div>
          </button>
          
          {isHistoryOpen && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-1 scrollbar-hide text-left animate-in slide-in-from-top-2 duration-300 max-h-[40vh]">
              {threads.map(t => (
                <ThreadItem 
                  key={t.id} 
                  thread={t} 
                  active={activeThreadId === t.id} 
                  onClick={() => { setActiveThreadId(t.id); setActiveTab('engine'); }} 
                  onDelete={tid => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', tid))} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="glass p-8 rounded-[32px] relative overflow-hidden shadow-2xl border border-emerald-500/10 text-left text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 text-left">Authorization</p>
          <div className="flex items-center font-bold text-base truncate text-white"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-4 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />{user.isAnonymous ? 'Guest' : (user.email ? user.email.split('@')[0] : 'Guest')}</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden text-left text-white">
        <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-16 bg-[#070708]/50 backdrop-blur-3xl text-left text-white">
           <div className="flex items-center space-x-10 text-left text-white text-white text-white">
             <div className="flex flex-col items-start text-left text-white">
               <span className="text-2xl font-bold tracking-tight text-white">Studio Workspace</span>
               <span className="text-[11px] uppercase tracking-[0.2em] flex items-center flare-active-glow">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
                 Flare active
               </span>
             </div>
           </div>
           <div className="flex items-center space-x-8 text-left text-white text-white text-white text-white">
             <div className="w-16 h-16 rounded-[24px] glass flex items-center justify-center text-zinc-500 hover:text-white transition-all text-left shadow-xl cursor-pointer text-white" onClick={() => setActiveTab('dashboard')}><User size={32} className="text-white" /></div>
             <button onClick={() => signOut(auth)} className="text-zinc-600 hover:text-rose-500 transition-colors text-white text-white text-white text-white text-white"><LogOut size={24} className="text-white" /></button>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative text-left text-white text-white">
          {activeTab === 'dashboard' && <HubView setTab={setActiveTab} vaultCount={vaultItems.length} userEmail={user.email} />}
          {activeTab === 'upload' && <UploadView onUpload={saveToVault} />}
          {activeTab === 'engine' && (
            <div className="flex flex-col h-full bg-[#070708] text-left text-white text-white">
              <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide pb-56 text-left text-white text-white text-white text-white">
                <div className="max-w-4xl mx-auto space-y-12 text-white text-white text-white text-white">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-6 duration-700 w-full text-left text-white text-white`}>
                      {msg.role === 'user' ? <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-[28px] rounded-tr-sm max-w-xl text-lg font-medium text-emerald-400 shadow-lg text-left text-white text-white text-white text-white">{msg.content}</div> : 
                      <div className="space-y-6 w-full text-left text-white text-white text-white">
                        <div className="flex items-center space-x-3 text-zinc-700 text-left text-white text-white text-white text-white text-white"><div className="w-8 h-8 bg-emerald-500/10 rounded-[10px] flex items-center justify-center text-emerald-400 text-white text-white text-white text-white"><Cpu size={16} className="text-white" /></div><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white text-white text-white text-white">Pixelflare Node</span></div>
                        {msg.type === 'image' ? (
                          <div className="space-y-10 group text-left text-white text-white text-white text-white text-white">
                            <div className="relative rounded-[48px] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950 aspect-square w-full max-w-2xl text-left text-white text-white text-white text-white text-white text-white">
                              <img src={msg.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 text-left text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white" alt="Vision" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-left text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white">
                                <button onClick={() => window.open(msg.content, '_blank')} className="p-5 bg-white text-black rounded-3xl hover:bg-emerald-400 transition-all transform hover:scale-110 shadow-2xl text-left text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white">
                                  <Maximize2 size={24} className="text-white" />
                                </button>
                              </div>
                            </div>
                            <button onClick={() => saveToVault({ title: msg.prompt?.substring(0, 15) || 'Artifact', url: msg.content, prompt: msg.prompt, style: msg.style, timestamp: Date.now() })} className="opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-4 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-[22px] hover:bg-emerald-50 shadow-xl active:scale-95 text-sm text-left text-white text-white text-white text-white text-white">Save to Vault</button>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold tracking-tight text-white leading-snug max-w-2xl text-left text-white">{msg.content}</div>
                        )}
                      </div>}
                    </div>
                  ))}
                  {isGenerating && <div className="flex items-center space-x-5 text-emerald-400 text-left text-white"><PixelflareLogo igniting size={32} className="text-white" /><span className="text-lg font-bold uppercase tracking-tight text-white">Processing Neural DNA...</span></div>}
                </div>
              </div>
              <ChatInputBar onSend={handleSend} isGenerating={isGenerating} isRefining={isRefining} onRefine={handleRefinePrompt} onUpload={saveToVault} />
            </div>
          )}
          {activeTab === 'library' && (
            <div className="h-full overflow-y-auto scrollbar-hide text-left p-16 max-w-7xl mx-auto text-white text-white text-white">
              <h2 className="text-6xl font-bold tracking-tighter text-white">The Vault</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 text-white text-white text-white">
                {vaultItems.map(item => (
                  <div key={item.id} onClick={() => setSelectedFlare(item)} className="group cursor-pointer relative bg-[#0c0c0e] border border-white/5 rounded-[40px] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 shadow-2xl p-4 text-white text-white text-white">
                    <div className="aspect-[4/5] overflow-hidden relative rounded-[28px] border border-white/5 text-left text-white">
                      <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 text-left text-white" alt={item.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-left text-white text-white text-white text-white">
                        <Maximize2 className="text-white text-left text-white" size={36} />
                      </div>
                    </div>
                    <div className="p-5 space-y-1.5 text-left text-white text-white text-white">
                      <h5 className="font-bold text-lg truncate text-white leading-tight text-left">{item.title}</h5>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] text-left">{item.style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ArtifactView flare={selectedFlare} onClose={() => setSelectedFlare(null)} onSave={saveToVault} />
    </div>
  );
}
