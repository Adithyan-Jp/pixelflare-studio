// App.jsx
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
  doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// 1. CONFIG & API
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = import.meta.env.VITE_APP_ID || 'pixelflare-studio-production';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// 2. STYLE PRESETS
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

// 3. GEMINI API UTILS
const callGemini = async (userQuery, systemPrompt) => {
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    if (!response.ok) throw new Error('Gemini API error');
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
};

// 4. GLOBAL STYLES (unchanged)
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background: #070708; color: white; margin: 0; overflow: hidden; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #10b981; }
    .glass { background: rgba(15, 15, 17, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .chat-gradient { background: linear-gradient(to bottom, transparent, #070708 90%); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    @keyframes rim-loading { 0% { transform: rotate(0deg); stroke-dashoffset: 280; } 50% { stroke-dashoffset: 140; } 100% { transform: rotate(360deg); stroke-dashoffset: 0; } }
    .animate-rim-loading { animation: rim-loading 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
    .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
    @keyframes status-shine { from { text-shadow: 0 0 2px rgba(16, 185, 129, 0.2); opacity: 0.8; } to { text-shadow: 0 0 14px rgba(16, 185, 129, 1); opacity: 1; } }
    .flare-active-glow { color: #10b981; font-weight: 700; animation: status-shine 1.8s ease-in-out infinite alternate; }
  `}</style>
);

// ... (keep all your sub-components here: PixelflareLogo, SidebarBtn, ThreadItem, HubView, AuthPage, ChatInputBar, ArtifactView, UploadView)
// Note: You should move them to separate files later, but for prototype it's fine to keep in one file

// 6. MAIN APP
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
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ... (keep your existing useEffect hooks for threads, vault, messages)

  const handleRefinePrompt = async (current) => {
    if (!current.trim()) return current;
    setIsRefining(true);
    const res = await callGemini(
      current,
      "Rewrite the user short idea into a professional cinematic image prompt. 50 words max. Output ONLY prompt text."
    );
    setIsRefining(false);
    return res || current;
  };

  const handleSend = async (content, style) => {
    if (!user || !activeThreadId || !content.trim()) return;
    setIsGenerating(true);

    const msgRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId, 'messages');

    await addDoc(msgRef, { role: 'user', type: 'text', content, timestamp: Date.now() });

    // Auto-name first message thread
    if (chatMessages.length <= 1) {
      const threadName = await callGemini(content, "Generate a cool 2-word title for this session. No extra text.");
      if (threadName) {
        updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'chat_threads', activeThreadId), { name: threadName });
      }
    }

    try {
      const styleData = STYLE_PRESETS.find(s => s.id === style);
      const fullPrompt = encodeURIComponent(`${content}, ${styleData?.suffix || ''}`);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?seed=${seed}&width=1024&height=1024&nologo=true&enhance=true`;

      await addDoc(msgRef, {
        role: 'ai',
        type: 'image',
        content: imageUrl,
        prompt: content,
        style,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error('Generation error:', e);
      await addDoc(msgRef, {
        role: 'ai',
        type: 'text',
        content: 'Sorry, image generation failed. Please try again.',
        timestamp: Date.now()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToVault = async (item) => {
    if (!user) return;
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'asset_vault');
    await addDoc(vaultRef, { ...item, date: new Date().toISOString().split('T')[0], timestamp: Date.now() });
    setActiveTab('library');
  };

  const handleNewChat = async () => {
    if (!user) return;
    const tr = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'chat_threads'), {
      name: 'New Session...',
      timestamp: Date.now()
    });
    setActiveThreadId(tr.id);
    setActiveTab('engine');
    setIsHistoryOpen(true);
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-[#070708] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <GlobalStyles />
        <AuthPage authError={authError} setAuthError={setAuthError} />
      </>
    );
  }

  // Rest of your JSX - sidebar, main content, etc.
  return (
    <div className="flex h-screen bg-[#070708] text-white overflow-hidden antialiased">
      <GlobalStyles />
      {/* ... your sidebar, header, main content, ArtifactView modal ... */}
      {/* Keep all your existing JSX structure here */}
    </div>
  );
}
