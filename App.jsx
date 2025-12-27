import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Library, Plus, Maximize2, Cpu, 
  User, X, LogOut, Lock, AtSign, MessageSquare, 
  Trash, Paperclip, Wand2, BrainCircuit, Send, Loader2,
  ChevronDown, ArrowRight, Folder, Filter, Grid, List, Search,
  Zap, Database, HardDrive, Clock
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  doc, deleteDoc, updateDoc, query, orderBy 
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// --- 1. CONFIG & INITIALIZATION ---

// UPDATED: Your specific Firebase Configuration
const firebaseConfig = {
  const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}');
  authDomain: "pixelflare-studio.firebaseapp.com",
  projectId: "pixelflare-studio",
  storageBucket: "pixelflare-studio.firebasestorage.app",
  messagingSenderId: "482965484916",
  appId: "1:482965484916:web:4e26abf0700fec00126821",
  measurementId: "G-PGBG4GL9TQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'pixelflare-studio-pro-v2'; // Unique ID for this app version's data structure

// Optional: Add a Gemini API key here if you want text-based AI responses. 
// Currently, the app uses Pollinations.ai for image generation which works without a key.
const apiKey = ""; 

const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, photorealistic' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, vibrant colors, studio ghibli style' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit aesthetic, detailed' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed, 8k resolution' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city lights, futuristic' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, 3d isometric, blender style' },
  { id: 'oil', label: 'Oil Painting', suffix: 'classical oil painting, visible brushstrokes, textured' },
  { id: 'sketch', label: 'Sketch', suffix: 'charcoal sketch, hand-drawn texture, pencil art' },
  { id: 'vaporwave', label: 'Vaporwave', suffix: 'vaporwave aesthetic, 80s retro colors, synthwave' },
];

// --- 2. GLOBAL STYLES ---
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

// --- 3. SUB-COMPONENTS ---

function PixelflareLogo({ igniting = false, size = 32 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size + 20, height: size + 20 }}>
      {igniting && (
        <svg width={size + 14} height={size + 14} viewBox="0 0 100 100" className="absolute animate-rim-loading">
          <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="140 140" />
        </svg>
      )}
      <div className={`absolute inset-0 bg-emerald-500/10 rounded-full transition-all duration-1000 ${igniting ? 'animate-pulse-glow' : 'opacity-20'}`} />
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="relative z-10">
        <rect x="5" y="5" width="30" height="30" rx="8" stroke="#10b981" strokeWidth="2.5" opacity="0.4" />
        <path d="M20 8L22.5 17.5L32 20L22.5 22.5L20 32L17.5 22.5L8 20L17.5 17.5L20 8Z" fill="#10b981" />
      </svg>
    </div>
  );
}

function SidebarBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-950/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'}`}>
      <Icon size={18} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
    </button>
  );
}

function ThreadItem({ thread, active, onClick, onDelete }) {
  return (
    <div className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all ${active ? 'bg-white/5 text-white shadow-xl' : 'text-zinc-600 hover:bg-white/[0.02] hover:text-zinc-300'} cursor-pointer`} onClick={onClick}>
      <div className="flex items-center space-x-3 overflow-hidden text-left">
        <MessageSquare size={14} className={active ? 'text-emerald-400' : 'text-zinc-800'} />
        <span className="text-xs font-medium truncate">{String(thread.name || 'Untitled session')}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDelete(thread.id); }} className="p-1.5 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash size={12} />
      </button>
    </div>
  );
}

function ArtifactView({ flare, onClose }) {
  if (!flare) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300 text-left">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl glass rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl h-[75vh] border border-white/10">
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden"><img src={flare.url} className="max-w-full max-h-full object-contain p-4" alt="Inspect" /></div>
        <div className="w-[380px] border-l border-white/5 flex flex-col p-10 space-y-8 bg-[#0c0c0e] text-left overflow-y-auto scrollbar-hide">
          <div className="space-y-2"><h2 className="text-2xl font-bold text-white tracking-tight">{String(flare.title || 'Untitled')}</h2><p className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">{String(flare.style || 'Neural')}</p></div>
          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl text-xs text-zinc-400 leading-relaxed italic">"{String(flare.prompt || 'No prompt info')}"</div>
          <button onClick={onClose} className="mt-auto py-4 bg-white text-black font-bold rounded-2xl text-sm hover:bg-emerald-400 transition-all">Dismiss Artifact</button>
        </div>
      </div>
    </div>
  );
}

function VaultPro({ items, onInspect, deleteItem }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const title = String(item.title || "").toLowerCase();
      const prompt = String(item.prompt || "").toLowerCase();
      const style = String(item.style || "").toLowerCase();
      const matchesSearch = title.includes(search.toLowerCase()) || prompt.includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || style === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [items, filter, search]);

  const groupedByStyle = useMemo(() => {
    return items.reduce((acc, item) => {
      const style = String(item.style || 'Uncategorized');
      if (!acc[style]) acc[style] = [];
      acc[style].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="h-full flex flex-col p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tighter">Vault Explorer</h1>
          <p className="text-zinc-500 font-medium text-lg">Neural artifact indexing and cluster management.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-2xl border border-white/5 shadow-xl">
          <button onClick={() => setViewMode('grid')} title="Grid View" className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Grid size={20} /></button>
          <button onClick={() => setViewMode('folder')} title="Folder View" className={`p-3 rounded-xl transition-all ${viewMode === 'folder' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Folder size={20} /></button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all" placeholder="Search neural patterns..." />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
          <button onClick={() => setFilter('all')} className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filter === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-500 border-white/5 hover:text-white'}`}>All Assets</button>
          {STYLE_PRESETS.map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filter === s.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/5 hover:text-white'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] p-3 hover:border-emerald-500/30 transition-all duration-500 shadow-xl cursor-pointer" onClick={() => onInspect(item)}>
                <div className="aspect-[4/5] rounded-[24px] overflow-hidden relative border border-white/5">
                  <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Vault Item" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><Maximize2 className="text-white" size={32} /></div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate text-zinc-200">{String(item.title || 'Untitled')}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{String(item.style || 'Neural')}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-2 text-zinc-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash size={14} /></button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && <div className="col-span-full py-20 text-center text-zinc-600 font-medium italic">No artifacts found in this neural cluster.</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(groupedByStyle).map(([style, styleItems]) => (
              <div key={style} className="glass p-8 rounded-[40px] border border-white/5 space-y-6 hover:border-white/10 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Folder size={24} /></div>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{styleItems.length} Assets</span>
                </div>
                <div><h3 className="text-xl font-bold text-white capitalize">{String(style)}</h3><p className="text-zinc-500 text-xs font-medium">Neural cluster directory</p></div>
                <button onClick={() => { setFilter(style.toLowerCase()); setViewMode('grid'); }} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Open Directory</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) { setErr(error.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070708] relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/[0.05] rounded-full blur-[250px]" />
      <div className="w-full max-w-md glass rounded-[56px] p-12 space-y-8 shadow-2xl relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <PixelflareLogo size={40} />
          <h1 className="text-4xl font-bold tracking-tighter">Studio Access</h1>
          <p className="text-zinc-500 text-sm font-medium">Identify your neural node to continue.</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Identity</label><div className="relative"><AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="email@node.com" /></div></div>
          <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Keyphrase</label><div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="••••••••" /></div></div>
          {err && <p className="text-rose-500 text-[10px] font-bold uppercase text-center">{err}</p>}
          <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-[22px] shadow-xl active:scale-95 transition-all">{loading ? <Loader2 className="animate-spin mx-auto" /> : 'Initialise Studio Session'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all text-center">{isLogin ? "Need a node? Register" : "Have an ID? Login"}</button>
      </div>
    </div>
  );
}

function HubView({ setTab, vaultCount, userEmail }) {
  const displayEmail = String(userEmail || 'Guest');
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-white text-left p-12 max-w-6xl mx-auto">
      <div className="relative p-14 bg-[#0c0c0e] border border-white/5 rounded-[48px] overflow-hidden group shadow-2xl text-left">
        <div className="relative z-10 space-y-8 max-w-2xl text-left text-white">
          <div className="space-y-4 text-left">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-emerald-500/20 shadow-md">Studio Verified</span>
            <h1 className="text-6xl font-bold leading-tight tracking-tighter text-white text-left text-balance">Welcome back,<br/><span className="text-emerald-400 italic">{displayEmail.split('@')[0]}</span>.</h1>
          </div>
          <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-lg text-left text-balance">Your private workstation is active. Start a neural conversation to manifest vision artifacts.</p>
          <button onClick={() => setTab('engine')} className="px-10 py-4 bg-emerald-600 rounded-[24px] font-bold flex items-center hover:bg-emerald-50 transition-all text-base active:scale-95 shadow-xl text-white text-nowrap">
            Launch Engine Interface <ArrowRight size={20} className="ml-3 inline" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-left text-white">
          <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl text-left text-white"><Library size={24} className="text-zinc-700" /><div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Archive</p><h3 className="text-3xl font-bold text-center tracking-tight text-white">{vaultCount} Assets</h3></div></div>
          <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl text-left text-white"><Cpu size={24} className="text-emerald-400" /><div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Node</p><h3 className="text-3xl font-bold text-emerald-400 text-center tracking-tight">Active</h3></div></div>
          <div className="glass p-10 rounded-[40px] flex flex-col justify-center items-center space-y-3 shadow-xl cursor-pointer hover:bg-rose-500/5 transition-colors group text-left text-white" onClick={() => signOut(auth)}>
            <LogOut size={24} className="text-rose-500 group-hover:scale-110 transition-transform" />
            <div><p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Identity</p><h3 className="text-3xl font-bold text-center tracking-tight">Logout</h3></div>
          </div>
      </div>
    </div>
  );
}

// --- 5. MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [vaultItems, setVaultItems] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedFlare, setSelectedFlare] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const threadsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads');
    const unsubThreads = onSnapshot(threadsRef, snap => {
      const ts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      ts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setThreads(ts);
      if (ts.length > 0 && !activeThreadId) setActiveThreadId(ts[0].id);
    });
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'asset_vault');
    const unsubVault = onSnapshot(vaultRef, snap => {
      setVaultItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubThreads(); unsubVault(); };
  }, [user, activeThreadId]);

  useEffect(() => {
    if (!user || !activeThreadId) { setChatMessages([]); return; }
    const msgRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId, 'messages');
    const unsubMsgs = onSnapshot(msgRef, snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setChatMessages(msgs.length > 0 ? msgs : [{ role: 'ai', type: 'text', content: 'Flare is ready. Ignite your vision ✨' }]);
    });
    return () => unsubMsgs();
  }, [user, activeThreadId]);

  const handleSend = async () => {
    if (!user || !activeThreadId || !input.trim() || isGenerating) return;
    const content = input;
    const currentStyle = style;
    setInput('');
    setIsGenerating(true);
    const msgRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId, 'messages');
    await addDoc(msgRef, { role: 'user', type: 'text', content, timestamp: Date.now() });

    try {
      const styleData = STYLE_PRESETS.find(s => s.id === currentStyle);
      const full = encodeURIComponent(`${content}, ${styleData?.suffix}`);
      const imageUrl = `https://image.pollinations.ai/prompt/${full}?nologo=true&width=1024&height=1024&seed=${Math.floor(Math.random()*1000000)}`;
      await addDoc(msgRef, { role: 'ai', type: 'image', content: imageUrl, prompt: content, style: String(styleData?.label), timestamp: Date.now() });
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const saveToVault = async (item) => {
    if (!user) return;
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'asset_vault');
    await addDoc(vaultRef, { ...item, timestamp: Date.now() });
    setActiveTab('library');
  };

  const handleNewChat = async () => {
    if (!user) return;
    const tr = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads'), { name: 'New Session...', timestamp: Date.now() });
    setActiveThreadId(tr.id); setActiveTab('engine');
  };

  if (authLoading) return <div className="h-screen bg-[#070708] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>;
  if (!user) return <><GlobalStyles /><AuthPage /></>;

  return (
    <div className="flex h-screen bg-[#070708] text-white overflow-hidden text-left antialiased">
      <GlobalStyles />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"><div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.05] rounded-full blur-[180px]" /></div>

      <aside className="w-[320px] border-r border-white/5 bg-[#070708]/80 backdrop-blur-3xl flex flex-col p-8 space-y-12 z-20 overflow-hidden text-left">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}><PixelflareLogo igniting={isGenerating} size={36} /><span className="text-3xl font-bold tracking-tighter">Pixelflare</span></div>
        <nav className="space-y-3">
          <SidebarBtn icon={LayoutDashboard} label="Studio Hub" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarBtn icon={Plus} label="New Engine Thread" active={activeTab === 'engine'} onClick={handleNewChat} />
          <SidebarBtn icon={Library} label="Neural Vault" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        </nav>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="flex items-center justify-between px-2 w-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-all">
            <span>Neural History</span>
            <ChevronDown className={`transition-transform duration-300 ${isHistoryOpen ? 'rotate-180' : ''}`} size={14} />
          </button>
          {isHistoryOpen && (
            <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
              {threads.map(t => (
                <ThreadItem key={t.id} thread={t} active={activeThreadId === t.id} onClick={() => { setActiveThreadId(t.id); setActiveTab('engine'); }} onDelete={tid => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', tid))} />
              ))}
            </div>
          )}
        </div>

        <div className="glass p-8 rounded-[32px] relative overflow-hidden shadow-2xl border border-emerald-500/10 text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Authorization</p>
          <div className="flex items-center font-bold text-base truncate"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-4 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />{String(user.email ? user.email.split('@')[0] : 'Guest Node')}</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden text-left">
        <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-16 bg-[#070708]/50 backdrop-blur-xl">
           <div className="flex flex-col items-start text-left">
             <span className="text-2xl font-bold tracking-tight">Studio Workspace</span>
             <span className="text-[11px] uppercase tracking-[0.2em] flex items-center flare-active-glow">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
               Flare active
             </span>
           </div>
           <div className="flex items-center space-x-8">
             <div className="w-16 h-16 rounded-[24px] glass flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer shadow-xl" onClick={() => setActiveTab('dashboard')}><User size={32} /></div>
             <button onClick={() => signOut(auth)} className="text-zinc-600 hover:text-rose-500 transition-colors"><LogOut size={24} /></button>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' && <HubView setTab={setActiveTab} vaultCount={vaultItems.length} userEmail={user.email} />}
          {activeTab === 'library' && <VaultPro items={vaultItems} onInspect={setSelectedFlare} deleteItem={tid => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'asset_vault', tid))} />}
          {activeTab === 'engine' && (
            <div className="flex flex-col h-full bg-[#070708] text-left">
              <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide pb-56">
                <div className="max-w-4xl mx-auto space-y-12">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-700 w-full`}>
                      {msg.role === 'user' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-[28px] rounded-tr-sm max-w-xl text-lg font-medium text-emerald-400 shadow-lg">{String(msg.content)}</div>
                      ) : (
                        <div className="space-y-6 w-full text-left">
                          <div className="flex items-center space-x-3 text-zinc-700"><Cpu size={16} /><span className="text-[9px] font-bold uppercase tracking-[0.2em]">Neural Signal</span></div>
                          {msg.type === 'image' ? (
                            <div className="space-y-10 group text-left">
                              <div className="relative rounded-[48px] overflow-hidden border border-white/5 shadow-2xl bg-zinc-950 aspect-square w-full max-w-2xl">
                                <img src={String(msg.content)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Output" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <button onClick={() => window.open(msg.content, '_blank')} className="p-5 bg-white text-black rounded-3xl hover:bg-emerald-400 transition-all transform hover:scale-110 shadow-2xl"><Maximize2 size={24} /></button>
                                </div>
                              </div>
                              <button onClick={() => saveToVault({ title: msg.prompt?.substring(0, 20) || 'Neural Flare', url: msg.content, prompt: msg.prompt, style: msg.style })} className="opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-4 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-[22px] hover:bg-emerald-500 shadow-xl text-sm">Save to Neural Vault</button>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold tracking-tight text-white leading-snug max-w-2xl">{String(msg.content)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isGenerating && <div className="flex items-center space-x-5 text-emerald-400"><PixelflareLogo igniting size={32} /><span className="text-lg font-bold uppercase tracking-tight">Synthesizing Vision...</span></div>}
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-8 chat-gradient pointer-events-none">
                <div className="max-w-4xl mx-auto pointer-events-auto">
                  <div className="glass rounded-[36px] p-3.5 shadow-2xl flex flex-col space-y-3.5 border border-white/10">
                    <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-1">
                      {STYLE_PRESETS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`
                            px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border
                            ${style === s.id 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                              : 'bg-white/5 text-zinc-500 border-transparent hover:bg-white/10 hover:text-zinc-300'}
                          `}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-3 bg-black/20 rounded-[26px] p-2 pr-2.5 border border-white/5 focus-within:border-emerald-500/30 transition-colors">
                      <div className="pl-4 text-zinc-500">
                        <Wand2 size={20} />
                      </div>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe your vision..."
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-zinc-600 h-12"
                        disabled={isGenerating}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isGenerating}
                        className={`
                          p-3 rounded-[20px] transition-all duration-300 flex items-center justify-center
                          ${!input.trim() || isGenerating 
                            ? 'bg-white/5 text-zinc-600 cursor-not-allowed' 
                            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'}
                        `}
                      >
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-4">
                    Pixelflare Neural Engine v2.5
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <ArtifactView flare={selectedFlare} onClose={() => setSelectedFlare(null)} />
    </div>
  );
}
