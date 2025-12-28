import React, { useState } from 'react';
import { Wand2, Send, Loader2, Maximize2, Trash, Search } from 'lucide-react';

const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, photorealistic' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, vibrant colors, studio ghibli style' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit aesthetic, detailed' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed, 8k resolution' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city lights, futuristic' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, 3d isometric, blender style' },
];

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    background: '#070708',
    color: 'white',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  sidebar: {
    width: '280px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navBtn: (active) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    background: active ? '#10b981' : 'rgba(255,255,255,0.05)',
    color: active ? 'white' : 'rgba(255,255,255,0.6)',
    transition: 'all 0.3s',
  }),
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: '80px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
    paddingBottom: '280px',
  },
  messageContainer: (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '32px',
  }),
  message: (isUser) => ({
    padding: '16px 24px',
    borderRadius: '20px',
    maxWidth: '600px',
    background: isUser ? '#10b981' : 'rgba(255,255,255,0.1)',
    color: 'white',
  }),
  imageContainer: {
    position: 'relative',
    width: '400px',
    height: '400px',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  saveBtn: {
    marginTop: '16px',
    padding: '12px 24px',
    background: '#10b981',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  inputArea: {
    position: 'fixed',
    bottom: 0,
    left: '280px',
    right: 0,
    padding: '24px',
    background: 'linear-gradient(to top, #070708 0%, transparent 100%)',
  },
  inputBox: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  styleButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  styleBtn: (active) => ({
    padding: '8px 16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    background: active ? '#10b981' : 'rgba(255,255,255,0.1)',
    color: active ? 'white' : 'rgba(255,255,255,0.6)',
  }),
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '16px',
    padding: '12px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '14px',
  },
  sendBtn: (disabled) => ({
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: disabled ? 'rgba(255,255,255,0.1)' : '#10b981',
    color: disabled ? 'rgba(255,255,255,0.3)' : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  vaultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
  },
  vaultItem: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '12px',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  vaultImage: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    objectFit: 'cover',
    marginBottom: '12px',
  },
  searchBox: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    color: 'white',
    outline: 'none',
    marginBottom: '24px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#10b981',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: '✨ Ready to create amazing AI art!', type: 'text' }]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleSend = async () => {
    if (!input.trim() || generating) return;
    
    const prompt = input;
    setInput('');
    setGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: prompt, type: 'text' }]);

    try {
      const styleData = STYLE_PRESETS.find(s => s.id === style);
      const full = `${prompt}, ${styleData?.suffix}`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?nologo=true&width=1024&height=1024&seed=${Date.now()}`;
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        type: 'image', 
        content: url, 
        prompt, 
        style: styleData?.label,
        id: Date.now()
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Failed. Try again!', type: 'text' }]);
    } finally {
      setGenerating(false);
    }
  };

  const saveToVault = (item) => {
    setVault(prev => [...prev, { ...item, id: Date.now() }]);
    setActiveTab('library');
  };

  const filteredVault = vault.filter(item => 
    (item.prompt || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h1 style={styles.title}>Pixelflare</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            style={styles.navBtn(activeTab === 'engine')}
            onClick={() => setActiveTab('engine')}
            onMouseOver={(e) => !activeTab && (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={(e) => !activeTab && (e.target.style.background = 'rgba(255,255,255,0.05)')}
          >
            🎨 AI Engine
          </button>
          <button 
            style={styles.navBtn(activeTab === 'library')}
            onClick={() => setActiveTab('library')}
            onMouseOver={(e) => activeTab !== 'library' && (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={(e) => activeTab !== 'library' && (e.target.style.background = 'rgba(255,255,255,0.05)')}
          >
            📚 Vault ({vault.length})
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>
            {activeTab === 'engine' ? 'AI Generation Studio' : 'Your Vault'}
          </h2>
        </header>

        {activeTab === 'engine' ? (
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={styles.content}>
              {messages.map((msg, i) => (
                <div key={i} style={styles.messageContainer(msg.role === 'user')}>
                  {msg.type === 'text' ? (
                    <div style={styles.message(msg.role === 'user')}>
                      {msg.content}
                    </div>
                  ) : (
                    <div 
                      onMouseEnter={() => setHoveredImage(i)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <div style={styles.imageContainer}>
                        <img src={msg.content} style={styles.image} alt="Generated" />
                        {hoveredImage === i && (
                          <div style={{ ...styles.imageOverlay, opacity: 1 }}>
                            <button 
                              onClick={() => window.open(msg.content, '_blank')}
                              style={{ padding: '12px', background: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                            >
                              <Maximize2 size={20} color="#000" />
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => saveToVault(msg)}
                        style={{ ...styles.saveBtn, opacity: hoveredImage === i ? 1 : 0 }}
                      >
                        Save to Vault
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {generating && (
                <div style={styles.loading}>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Generating your masterpiece...</span>
                </div>
              )}
            </div>

            <div style={styles.inputArea}>
              <div style={styles.inputBox}>
                <div style={styles.styleButtons}>
                  {STYLE_PRESETS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      style={styles.styleBtn(style === s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                
                <div style={styles.inputWrapper}>
                  <Wand2 size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <input
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your vision..."
                    disabled={generating}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || generating}
                    style={styles.sendBtn(!input.trim() || generating)}
                  >
                    {generating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} size={18} />
              <input
                style={styles.searchBox}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your creations..."
              />
            </div>
            
            {filteredVault.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.5)' }}>
                {vault.length === 0 ? 'No images saved yet. Create some AI art!' : 'No results found.'}
              </div>
            ) : (
              <div style={styles.vaultGrid}>
                {filteredVault.map(item => (
                  <div 
                    key={item.id} 
                    style={styles.vaultItem}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <img src={item.content} style={styles.vaultImage} alt={item.prompt} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.prompt}
                        </p>
                        <p style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
                          {item.style}
                        </p>
                      </div>
                      <button
                        onClick={() => setVault(prev => prev.filter(v => v.id !== item.id))}
                        style={{ padding: '8px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
