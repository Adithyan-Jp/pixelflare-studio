import React, { useState } from 'react';
import { Wand2, Send, Loader2, Maximize2, Trash, Library, Grid, Folder, Search } from 'lucide-react';

const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, photorealistic' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, vibrant colors, studio ghibli style' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit aesthetic, detailed' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed, 8k resolution' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city lights, futuristic' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, 3d isometric, blender style' },
];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Space Grotesk', sans-serif; background: #070708; color: white; margin: 0; overflow: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
  `}</style>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: 'Ready to create! 🎨', type: 'text' }]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');

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
    <div className="flex h-screen bg-[#070708] text-white">
      <GlobalStyles />
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 p-6 flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Pixelflare</h1>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('engine')} 
            className={`w-full p-3 rounded-xl text-left ${activeTab === 'engine' ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
          >
            🎨 AI Engine
          </button>
          <button 
            onClick={() => setActiveTab('library')} 
            className={`w-full p-3 rounded-xl text-left ${activeTab === 'library' ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
          >
            📚 Vault ({vault.length})
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/10 flex items-center px-8">
          <h2 className="text-2xl font-bold">
            {activeTab === 'engine' ? 'AI Generation' : 'Your Vault'}
          </h2>
        </header>

        {activeTab === 'engine' ? (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-60">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'text' ? (
                    <div className={`px-6 py-3 rounded-2xl max-w-xl ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white/10'
                    }`}>
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-4 group">
                      <div className="relative w-96 h-96 rounded-3xl overflow-hidden border border-white/10">
                        <img src={msg.content} className="w-full h-full object-cover" alt="Generated" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => window.open(msg.content, '_blank')}
                            className="p-3 bg-white text-black rounded-xl hover:bg-emerald-400"
                          >
                            <Maximize2 size={20} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => saveToVault(msg)}
                        className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all"
                      >
                        Save to Vault
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {generating && (
                <div className="flex items-center gap-3 text-emerald-400">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Generating...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-72 right-0 p-6 bg-gradient-to-t from-[#070708] to-transparent">
              <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
                {/* Style Buttons */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {STYLE_PRESETS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                        style === s.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                
                {/* Input */}
                <div className="flex items-center gap-3 bg-black/30 rounded-2xl p-3">
                  <Wand2 size={20} className="text-zinc-500" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your vision..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    disabled={generating}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || generating}
                    className={`p-3 rounded-xl ${
                      !input.trim() || generating
                        ? 'bg-white/5 text-zinc-600 cursor-not-allowed'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {generating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vault View */
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your creations..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {filteredVault.length === 0 ? (
                <div className="col-span-4 text-center py-20 text-zinc-500">
                  No images saved yet. Create some AI art!
                </div>
              ) : (
                filteredVault.map(item => (
                  <div key={item.id} className="group relative bg-white/5 rounded-2xl p-3 hover:bg-white/10 transition-all">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3">
                      <img src={item.content} className="w-full h-full object-cover" alt={item.prompt} />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-400 truncate">{item.prompt}</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">{item.style}</p>
                      </div>
                      <button
                        onClick={() => setVault(prev => prev.filter(v => v.id !== item.id))}
                        className="p-2 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
