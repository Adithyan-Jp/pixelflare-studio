import React, { useState, useEffect } from 'react';
import { Wand2, Send, Loader2, Maximize2, Trash, Search, Download, Share2, Heart, Sparkles, Zap, Image as ImageIcon, Moon, Sun, Settings, Grid3x3, LayoutGrid, History, TrendingUp } from 'lucide-react';

// ⭐ EXTENDED STYLE PRESETS
const STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic film still, 8k, professional lighting, photorealistic', icon: '🎬', color: '#ef4444' },
  { id: 'anime', label: 'Anime', suffix: 'high quality anime art style, vibrant colors, studio ghibli style', icon: '🎨', color: '#ec4899' },
  { id: 'pixel', label: 'Pixel Art', suffix: 'high quality pixel art, 8-bit aesthetic, detailed', icon: '👾', color: '#8b5cf6' },
  { id: 'realistic', label: 'Realistic', suffix: 'ultra-realistic portrait, highly detailed, 8k resolution', icon: '📸', color: '#3b82f6' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: 'cyberpunk aesthetic, neon city lights, futuristic', icon: '🌆', color: '#06b6d4' },
  { id: '3d-render', label: '3D Render', suffix: 'unreal engine 5 render, 3d isometric, blender style', icon: '🎲', color: '#10b981' },
  { id: 'oil', label: 'Oil Painting', suffix: 'classical oil painting, visible brushstrokes, textured', icon: '🖼️', color: '#f59e0b' },
  { id: 'watercolor', label: 'Watercolor', suffix: 'watercolor painting, soft colors, artistic', icon: '🎨', color: '#14b8a6' },
  { id: 'sketch', label: 'Sketch', suffix: 'detailed pencil sketch, hand-drawn, artistic', icon: '✏️', color: '#6366f1' },
  { id: 'fantasy', label: 'Fantasy', suffix: 'fantasy art, magical, ethereal lighting', icon: '✨', color: '#a855f7' },
];

// 🎨 PREMIUM STYLES
const styles = {
  // Container
  app: (darkMode) => ({
    display: 'flex',
    height: '100vh',
    background: darkMode 
      ? 'linear-gradient(135deg, #0a0a0b 0%, #1a0a1f 50%, #0a0a0b 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
    color: darkMode ? 'white' : '#1e293b',
    fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  }),

  // Animated Background
  animatedBg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
    animation: 'pulse 4s ease-in-out infinite',
    pointerEvents: 'none',
  },

  // Sidebar
  sidebar: (darkMode) => ({
    width: '320px',
    borderRight: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    background: darkMode 
      ? 'rgba(10, 10, 11, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    boxShadow: darkMode 
      ? '4px 0 24px rgba(0,0,0,0.3)' 
      : '4px 0 24px rgba(0,0,0,0.05)',
    position: 'relative',
    zIndex: 10,
  }),

  // Logo Container
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },

  logo: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
    animation: 'float 3s ease-in-out infinite',
  },

  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },

  subtitle: (darkMode) => ({
    fontSize: '11px',
    color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  }),

  // Navigation
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  navBtn: (active, darkMode, color = '#10b981') => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: '16px',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: active 
      ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` 
      : darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: active ? 'translateX(4px)' : 'translateX(0)',
    boxShadow: active 
      ? `0 8px 24px ${color}40` 
      : 'none',
  }),

  // Stats Card
  statsCard: (darkMode) => ({
    background: darkMode 
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
    padding: '20px',
    borderRadius: '20px',
    border: darkMode ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }),

  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statLabel: (darkMode) => ({
    fontSize: '12px',
    color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    fontWeight: '500',
  }),

  statValue: (darkMode) => ({
    fontSize: '18px',
    fontWeight: 'bold',
    color: darkMode ? '#10b981' : '#059669',
  }),

  // Main Content
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 5,
  },

  // Header
  header: (darkMode) => ({
    height: '90px',
    borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: darkMode 
      ? 'rgba(10, 10, 11, 0.6)' 
      : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    boxShadow: darkMode 
      ? '0 4px 24px rgba(0,0,0,0.2)' 
      : '0 4px 24px rgba(0,0,0,0.03)',
  }),

  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '-0.02em',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  iconBtn: (darkMode, active = false) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: 'none',
    background: active 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    boxShadow: active ? '0 4px 16px rgba(16, 185, 129, 0.3)' : 'none',
  }),

  // Content Area
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '40px',
    paddingBottom: '320px',
  },

  // Message Container
  messageContainer: (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '32px',
    animation: 'slideUp 0.5s ease-out',
  }),

  message: (isUser, darkMode) => ({
    padding: '18px 24px',
    borderRadius: '24px',
    maxWidth: '600px',
    background: isUser 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : darkMode 
        ? 'rgba(255,255,255,0.08)' 
        : 'rgba(0,0,0,0.05)',
    color: isUser ? 'white' : darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    fontSize: '15px',
    lineHeight: '1.6',
    boxShadow: isUser 
      ? '0 8px 32px rgba(16, 185, 129, 0.3)' 
      : darkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.05)',
  }),

  // Image Card (Premium)
  imageCard: (darkMode) => ({
    position: 'relative',
    width: '480px',
    height: '480px',
    borderRadius: '32px',
    overflow: 'hidden',
    border: darkMode 
      ? '2px solid rgba(255,255,255,0.1)' 
      : '2px solid rgba(0,0,0,0.1)',
    boxShadow: darkMode 
      ? '0 20px 60px rgba(0,0,0,0.5)' 
      : '0 20px 60px rgba(0,0,0,0.15)',
    background: darkMode ? '#000' : '#fff',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  }),

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    opacity: 0,
    transition: 'opacity 0.3s',
  }),

  imageActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },

  imageActionBtn: {
    padding: '14px',
    background: 'rgba(255,255,255,0.95)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    color: '#000',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  imageInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  imagePrompt: {
    fontSize: '13px',
    color: 'white',
    fontWeight: '500',
    lineHeight: '1.5',
  }),

  imageStyle: {
    fontSize: '11px',
    color: '#10b981',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  }),
};
import React, { useState, useEffect } from 'react';
import { Wand2, Send, Loader2, Maximize2, Trash, Search, Download, Share2, Heart, Sparkles, Moon, Sun, Grid3x3, History, Copy, Check } from 'lucide-react';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: '✨ Welcome to Premium Pixelflare! Ready to create stunning AI art?', type: 'text' }]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredImage, setHoveredImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [history, setHistory] = useState([]);

  const totalGenerations = messages.filter(m => m.type === 'image').length;

  const handleSend = async () => {
    if (!input.trim() || generating) return;
    
    const prompt = input;
    const timestamp = new Date().toLocaleString();
    setInput('');
    setGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: prompt, type: 'text' }]);
    setHistory(prev => [...prev, { prompt, style, timestamp }]);

    try {
      const styleData = STYLE_PRESETS.find(s => s.id === style);
      const full = `${prompt}, ${styleData?.suffix}`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?nologo=true&width=1024&height=1024&seed=${Date.now()}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          type: 'image', 
          content: url, 
          prompt, 
          style: styleData?.label,
          id: Date.now(),
          timestamp
        }]);
        setGenerating(false);
      }, 2000);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Generation failed. Please try again!', type: 'text' }]);
      setGenerating(false);
    }
  };

  const saveToVault = (item) => {
    setVault(prev => [...prev, { ...item, id: Date.now(), savedAt: new Date().toLocaleString() }]);
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const downloadImage = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `pixelflare-${prompt.substring(0, 20)}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredVault = vault.filter(item => 
    (item.prompt || '').toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    app: {
      display: 'flex',
      height: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0a0a0b 0%, #1a0a1f 50%, #0a0a0b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
      color: darkMode ? 'white' : '#1e293b',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    },
    sidebar: {
      width: '320px',
      borderRight: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      background: darkMode ? 'rgba(10, 10, 11, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      boxShadow: darkMode ? '4px 0 24px rgba(0,0,0,0.3)' : '4px 0 24px rgba(0,0,0,0.05)',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    stats: {
      background: darkMode 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)',
      padding: '20px',
      borderRadius: '20px',
      border: darkMode ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.15)',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    navBtn: (active) => ({
      width: '100%',
      padding: '14px 16px',
      borderRadius: '16px',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: active 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        : darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      transition: 'all 0.3s',
      boxShadow: active ? '0 8px 24px rgba(16, 185, 129, 0.4)' : 'none',
    }),
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      height: '80px',
      borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: darkMode ? 'rgba(10, 10, 11, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(20px)',
    },
    iconBtn: (active = false) => ({
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      border: 'none',
      background: active 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
    }),
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '40px',
      paddingBottom: '320px',
    },
    message: (isUser) => ({
      padding: '18px 24px',
      borderRadius: '24px',
      maxWidth: '600px',
      background: isUser 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      color: isUser ? 'white' : darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
      marginBottom: '32px',
      marginLeft: isUser ? 'auto' : 0,
      marginRight: isUser ? 0 : 'auto',
      boxShadow: isUser ? '0 8px 32px rgba(16, 185, 129, 0.3)' : 'none',
    }),
    imageCard: {
      position: 'relative',
      width: '500px',
      height: '500px',
      borderRadius: '32px',
      overflow: 'hidden',
      border: darkMode ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      marginBottom: '32px',
    },
    imageOverlay: (visible) => ({
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '24px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s',
    }),
    actionBtn: {
      padding: '12px',
      background: 'rgba(255,255,255,0.95)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#000',
      transition: 'all 0.3s',
    },
    inputArea: {
      position: 'fixed',
      bottom: 0,
      left: '320px',
      right: 0,
      padding: '24px 40px',
      background: darkMode 
        ? 'linear-gradient(to top, #0a0a0b 0%, transparent 100%)'
        : 'linear-gradient(to top, #f8fafc 0%, transparent 100%)',
    },
    inputBox: {
      maxWidth: '1100px',
      margin: '0 auto',
      background: darkMode 
        ? 'rgba(255,255,255,0.05)' 
        : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      padding: '20px',
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    styleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginBottom: '16px',
    },
    styleBtn: (active, color) => ({
      padding: '12px',
      borderRadius: '14px',
      border: `2px solid ${active ? color : 'transparent'}`,
      background: active 
        ? `${color}15` 
        : darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: active ? color : darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
    input: {
      width: '100%',
      padding: '16px 50px 16px 20px',
      background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
      border: 'none',
      borderRadius: '16px',
      color: darkMode ? 'white' : '#000',
      fontSize: '15px',
      outline: 'none',
    },
    sendBtn: (disabled) => ({
      position: 'absolute',
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      background: disabled ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(16, 185, 129, 0.4)',
    }),
    vaultGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    },
    vaultItem: {
      background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: '20px',
      padding: '12px',
      transition: 'all 0.3s',
      cursor: 'pointer',
      border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
    },
  };

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>✨</div>
          <div>
            <div style={s.title}>Pixelflare</div>
            <div style={{ fontSize: '10px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontWeight: '600' }}>PREMIUM STUDIO</div>
          </div>
        </div>

        <div style={s.stats}>
          <div style={s.statRow}>
            <span style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Generations</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{totalGenerations}</span>
          </div>
          <div style={s.statRow}>
            <span style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Saved</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{vault.length}</span>
          </div>
          <div style={{ ...s.statRow, marginBottom: 0 }}>
            <span style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Favorites</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{favorites.length}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button style={s.navBtn(activeTab === 'engine')} onClick={() => setActiveTab('engine')}>
            <Sparkles size={18} />
            AI Engine
          </button>
          <button style={s.navBtn(activeTab === 'library')} onClick={() => setActiveTab('library')}>
            <Grid3x3 size={18} />
            Vault ({vault.length})
          </button>
          <button style={s.navBtn(activeTab === 'history')} onClick={() => setActiveTab('history')}>
            <History size={18} />
            History
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <header style={s.header}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {activeTab === 'engine' ? '✨ AI Generation Studio' : activeTab === 'library' ? '🖼️ Your Vault' : '📜 Generation History'}
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={s.iconBtn()} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {activeTab === 'engine' && (
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={s.content}>
              {messages.map((msg, i) => (
                msg.type === 'text' ? (
                  <div key={i} style={s.message(msg.role === 'user')}>
                    {msg.content}
                  </div>
                ) : (
                  <div 
                    key={i}
                    style={s.imageCard}
                    onMouseEnter={() => setHoveredImage(i)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img src={msg.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Generated" />
                    <div style={s.imageOverlay(hoveredImage === i)}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', color: 'white', marginBottom: '8px' }}>{msg.prompt}</div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{msg.style}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={s.actionBtn} onClick={() => downloadImage(msg.content, msg.prompt)}>
                          <Download size={18} />
                        </button>
                        <button style={s.actionBtn} onClick={() => copyToClipboard(msg.content)}>
                          {copiedUrl === msg.content ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <button style={{ ...s.actionBtn, background: favorites.includes(msg.id) ? '#ef4444' : 'rgba(255,255,255,0.95)' }} onClick={() => toggleFavorite(msg.id)}>
                          <Heart size={18} fill={favorites.includes(msg.id) ? 'white' : 'none'} color={favorites.includes(msg.id) ? 'white' : '#000'} />
                        </button>
                        <button style={s.actionBtn} onClick={() => saveToVault(msg)}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
              {generating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontSize: '16px', fontWeight: '600' }}>
                  <Loader2 className="animate-spin" size={24} />
                  Crafting your masterpiece...
                </div>
              )}
            </div>

            <div style={s.inputArea}>
              <div style={s.inputBox}>
                <div style={s.styleGrid}>
                  {STYLE_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setStyle(preset.id)}
                      style={s.styleBtn(style === preset.id, preset.color)}
                    >
                      <span>{preset.icon}</span>
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    style={s.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your vision in detail..."
                    disabled={generating}
                  />
                  <button style={s.sendBtn(!input.trim() || generating)} onClick={handleSend} disabled={!input.trim() || generating}>
                    {generating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div style={s.content}>
            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} size={18} />
              <input
                style={{ ...s.input, paddingLeft: '50px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your vault..."
              />
            </div>
            {filteredVault.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 20px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {vault.length === 0 ? '🎨 No images saved yet. Start creating!' : '🔍 No results found.'}
              </div>
            ) : (
              <div style={s.vaultGrid}>
                {filteredVault.map(item => (
                  <div key={item.id} style={s.vaultItem}>
                    <div style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                      <img src={item.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.prompt} />
                    </div>
                    <div style={{ fontSize: '12px', color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)', marginBottom: '4px' }}>
                      {item.prompt?.substring(0, 50)}...
                    </div>
                    <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>{item.style}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={s.content}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 20px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                📜 No generation history yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {history.reverse().map((h, i) => (
                  <div key={i} style={{ padding: '20px', background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: '16px', border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: darkMode ? 'white' : '#000' }}>{h.prompt}</div>
                    <div style={{ fontSize: '11px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                      {h.style} • {h.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
}
