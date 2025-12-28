import React, { useState, useEffect } from 'react';
import { 
  Send, Loader2, Download, Heart, Sparkles, Moon, Sun, Grid, 
  History, Copy, Check, AlertCircle, Search, Wand2, Settings, 
  X, ChevronDown, ChevronUp, ExternalLink, Maximize2 
} from 'lucide-react';

// --- CONFIGURATION ---

const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, photorealistic', icon: '🎬', color: '#ef4444' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, vibrant colors, studio ghibli style', icon: '🎨', color: '#ec4899' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit aesthetic, detailed', icon: '👾', color: '#8b5cf6' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed, 8k resolution', icon: '📸', color: '#3b82f6' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city lights, futuristic', icon: '🌆', color: '#06b6d4' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, 3d isometric, blender style', icon: '🎲', color: '#10b981' },
  { id: 'watercolor', label: 'Watercolor', suffix: 'watercolor painting, soft colors, artistic', icon: '🎨', color: '#14b8a6' },
  { id: 'fantasy', label: 'Fantasy', suffix: 'fantasy art, magical, ethereal lighting', icon: '✨', color: '#a855f7' },
];

const ASPECT_RATIOS = [
  { id: 'square', label: '1:1', value: '1:1', width: 1024, height: 1024, icon: '⬜' },
  { id: 'landscape', label: '16:9', value: '16:9', width: 1024, height: 576, icon: '🖼️' },
  { id: 'portrait', label: '9:16', value: '9:16', width: 576, height: 1024, icon: '📱' },
];

const API_PROVIDERS = [
  { id: 'pollinations', label: 'Pollinations (Inline)', description: 'Fast, unlimited, basic SD' },
  { id: 'perchance', label: 'Perchance (Studio)', description: 'High-quality SDXL in-app' },
];

// --- MAIN APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: '✨ Welcome to Pixelflare Studio! Select your engine in settings and start creating.', type: 'text' }]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced States
  const [showSettings, setShowSettings] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('square');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [apiKey, setApiKey] = useState(''); // Grok Key
  const [apiProvider, setApiProvider] = useState('pollinations');
  const [iframeUrl, setIframeUrl] = useState(null); // For Perchance Studio

  // --- DATA PERSISTENCE ---

  useEffect(() => {
    const savedVault = localStorage.getItem('px-vault');
    const savedSettings = localStorage.getItem('px-settings');
    if (savedVault) setVault(JSON.parse(savedVault));
    if (savedSettings) {
      const s = JSON.parse(savedSettings);
      setApiKey(s.apiKey || '');
      setApiProvider(s.apiProvider || 'pollinations');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('px-vault', JSON.stringify(vault));
    localStorage.setItem('px-settings', JSON.stringify({ apiKey, apiProvider }));
  }, [vault, apiKey, apiProvider]);

  // --- LOGIC FUNCTIONS ---

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const enhancePrompt = async () => {
    if (!input || !apiKey) return showNotification('Add Grok API key in settings!', 'error');
    setEnhancing(true);
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: `Expand this into a vivid AI image prompt: ${input}` }]
        })
      });
      const data = await res.json();
      setInput(data.choices[0].message.content.trim());
      showNotification('✨ Prompt Enhanced!');
    } catch (e) {
      showNotification('AI Enhancement failed', 'error');
    } finally { setEnhancing(false); }
  };

  const handleSend = async () => {
    if (!input.trim() || generating) return;
    
    const styleData = STYLE_PRESETS.find(s => s.id === style);
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio);
    let fullPrompt = `${input}, ${styleData.suffix}`;
    if (negativePrompt) fullPrompt += `, avoid: ${negativePrompt}`;

    setGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: input, type: 'text' }]);

    if (apiProvider === 'perchance') {
      const url = `https://perchance.org/ai-text-to-image-generator?prompt=${encodeURIComponent(fullPrompt)}`;
      setIframeUrl(url);
      setGenerating(false);
      showNotification('Studio Loaded', 'info');
    } else {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${ratio.width}&height=${ratio.height}&nologo=true&seed=${Date.now()}`;
      await new Promise(r => setTimeout(r, 2000));
      setMessages(prev => [...prev, {
        role: 'ai', type: 'image', content: url, prompt: input, id: Date.now(), style: styleData.label
      }]);
      setGenerating(false);
    }
    setHistory(prev => [{ prompt: input, time: new Date().toLocaleTimeString() }, ...prev]);
    setInput('');
  };

  // --- STYLES ---

  const s = {
    container: {
      display: 'flex', height: '100vh', background: darkMode ? '#0a0a0c' : '#f8fafc', color: darkMode ? 'white' : '#1e293b', fontFamily: 'Inter, sans-serif'
    },
    sidebar: {
      width: '280px', background: darkMode ? '#111114' : '#ffffff', borderRight: '1px solid rgba(128,128,128,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
    },
    main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
    header: { padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(128,128,128,0.1)' },
    content: { flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' },
    inputContainer: { padding: '24px 40px', background: darkMode ? '#0a0a0c' : 'white' },
    inputBox: { 
      background: darkMode ? '#1a1a1f' : '#f1f5f9', borderRadius: '20px', padding: '12px', border: '1px solid rgba(128,128,128,0.2)', display: 'flex', gap: '10px', alignItems: 'center' 
    },
    iframeBox: {
      width: '100%', height: '600px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
    },
    navBtn: (active) => ({
      width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', background: active ? '#10b981' : 'transparent', color: active ? 'white' : 'inherit', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s'
    }),
    styleBtn: (active) => ({
      padding: '8px 16px', borderRadius: '10px', border: active ? '2px solid #10b981' : '1px solid transparent', background: darkMode ? '#1a1a1f' : '#f1f5f9', cursor: 'pointer', fontSize: '12px'
    }),
    imageCard: { borderRadius: '24px', overflow: 'hidden', maxWidth: '600px', alignSelf: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }
  };

  return (
    <div style={s.container}>
      {notification && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '12px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Check size={18} /> {notification.message}
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside style={s.sidebar}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles fill="#10b981" /> Pixelflare
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button style={s.navBtn(activeTab === 'engine')} onClick={() => setActiveTab('engine')}><Maximize2 size={18} /> Engine</button>
          <button style={s.navBtn(activeTab === 'vault')} onClick={() => setActiveTab('vault')}><Grid size={18} /> Vault ({vault.length})</button>
          <button style={s.navBtn(activeTab === 'history')} onClick={() => setActiveTab('history')}><History size={18} /> History</button>
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', fontSize: '12px' }}>
          Engine: <b>{apiProvider.toUpperCase()}</b>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main style={s.main}>
        <header style={s.header}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{activeTab.toUpperCase()}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div style={s.content}>
          {activeTab === 'engine' && (
            <>
              {messages.map((m, i) => (
                m.type === 'text' ? (
                  <div key={i} style={{ padding: '12px 20px', background: m.role === 'user' ? '#10b981' : 'rgba(128,128,128,0.1)', borderRadius: '15px', maxWidth: '80%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {m.content}
                  </div>
                ) : (
                  <div key={i} style={s.imageCard}>
                    <img src={m.content} style={{ width: '100%' }} alt="Generated" />
                    <div style={{ padding: '12px', background: '#111', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', opacity: 0.6 }}>{m.style}</span>
                      <button onClick={() => setVault([...vault, m])} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><Heart size={18} /></button>
                    </div>
                  </div>
                )
              ))}
              
              {/* --- 🆕 PERCHANCE IFRAME STUDIO --- */}
              {iframeUrl && apiProvider === 'perchance' && (
                <div style={s.iframeBox}>
                  <div style={{ padding: '8px 16px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#10b981' }}>LIVE STUDIO CANVAS</span>
                    <button onClick={() => setIframeUrl(null)} style={{ background: 'none', border: 'none', color: 'white' }}><X size={16} /></button>
                  </div>
                  <iframe src={iframeUrl} width="100%" height="100%" frameBorder="0" title="Studio" />
                </div>
              )}
            </>
          )}

          {activeTab === 'vault' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {vault.map((v, i) => (
                <div key={i} style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(128,128,128,0.2)' }}>
                  <img src={v.content} style={{ width: '100%' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- INPUT AREA --- */}
        {activeTab === 'engine' && (
          <div style={s.inputContainer}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '8px' }}>
              {STYLE_PRESETS.map(p => (
                <button key={p.id} onClick={() => setStyle(p.id)} style={s.styleBtn(style === p.id)}>
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
            <div style={s.inputBox}>
              <button onClick={enhancePrompt} disabled={enhancing} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer' }}>
                {enhancing ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
              </button>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe what you want to create..."
                style={{ flex: 1, background: 'none', border: 'none', color: 'inherit', outline: 'none', fontSize: '15px' }}
              />
              <button onClick={handleSend} disabled={generating} style={{ background: '#10b981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {generating ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> {apiProvider === 'perchance' ? 'Studio' : 'Generate'}</>}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- SETTINGS MODAL --- */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: darkMode ? '#1a1a1f' : 'white', padding: '32px', borderRadius: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Studio Settings</h3>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: 'inherit' }}><X /></button>
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.6 }}>API Engine</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                {API_PROVIDERS.map(p => (
                  <button key={p.id} onClick={() => setApiProvider(p.id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: apiProvider === p.id ? '2px solid #10b981' : '1px solid gray', background: 'none', color: 'inherit', cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.6 }}>Grok API Key (for Magic Wand)</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', marginTop: '8px', background: 'rgba(128,128,128,0.1)', border: 'none', color: 'inherit' }} placeholder="xai-..." />
            </div>
            <button onClick={() => setShowSettings(false)} style={{ background: '#10b981', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
