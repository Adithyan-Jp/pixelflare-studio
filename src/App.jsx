import React, { useState, useEffect } from 'react';
import { Send, Loader2, Download, Heart, Sparkles, Moon, Sun, Grid, History, Copy, Check, AlertCircle, Search, Wand2, Settings, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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

// 🎨 PROMPT TEMPLATES
const PROMPT_TEMPLATES = [
  {
    category: 'Portrait',
    templates: [
      { name: 'Professional Headshot', prompt: 'professional corporate headshot, business attire, clean background, natural lighting, 8k, sharp focus' },
      { name: 'Fantasy Character', prompt: 'epic fantasy character portrait, intricate armor, mystical background, dramatic lighting, highly detailed' },
      { name: 'Artistic Portrait', prompt: 'artistic portrait painting, expressive brushstrokes, vibrant colors, emotional depth, museum quality' },
    ]
  },
  {
    category: 'Landscape',
    templates: [
      { name: 'Mountain Vista', prompt: 'majestic mountain landscape, golden hour lighting, misty valleys, epic scale, nature photography, 8k' },
      { name: 'Futuristic City', prompt: 'futuristic cityscape at night, neon lights, flying vehicles, cyberpunk aesthetic, ultra detailed' },
      { name: 'Fantasy World', prompt: 'magical fantasy landscape, floating islands, waterfalls, ethereal lighting, dreamlike atmosphere' },
    ]
  },
  {
    category: 'Abstract',
    templates: [
      { name: 'Geometric Art', prompt: 'abstract geometric art, vibrant colors, mathematical patterns, modern design, minimalist' },
      { name: 'Fluid Motion', prompt: 'abstract fluid art, swirling colors, dynamic movement, organic forms, high contrast' },
      { name: 'Digital Glitch', prompt: 'glitch art aesthetic, distorted reality, digital artifacts, vibrant colors, experimental' },
    ]
  },
  {
    category: 'Character',
    templates: [
      { name: 'Superhero', prompt: 'powerful superhero character, dynamic pose, dramatic cape, heroic lighting, comic book style' },
      { name: 'Anime Character', prompt: 'anime character design, detailed outfit, expressive eyes, dynamic hair, vibrant colors' },
      { name: 'Sci-Fi Warrior', prompt: 'futuristic warrior, advanced armor, energy weapons, battle stance, cinematic lighting' },
    ]
  },
  {
    category: 'Nature',
    templates: [
      { name: 'Wildlife Close-up', prompt: 'wildlife photography, animal close-up, natural habitat, golden hour, shallow depth of field, 8k' },
      { name: 'Tropical Paradise', prompt: 'tropical beach paradise, crystal clear water, palm trees, sunset sky, vacation vibes' },
      { name: 'Forest Scene', prompt: 'enchanted forest, sun rays through trees, moss covered ground, magical atmosphere, detailed foliage' },
    ]
  },
];

// 🎯 ASPECT RATIOS
const ASPECT_RATIOS = [
  { id: 'square', label: '1:1', value: '1:1', width: 1024, height: 1024, icon: '⬜' },
  { id: 'landscape', label: '16:9', value: '16:9', width: 1024, height: 576, icon: '🖼️' },
  { id: 'portrait', label: '9:16', value: '9:16', width: 576, height: 1024, icon: '📱' },
  { id: 'wide', label: '21:9', value: '21:9', width: 1024, height: 438, icon: '📺' },
];

// 📏 IMAGE SIZES
const IMAGE_SIZES = [
  { id: 'small', label: 'Draft', value: 512, description: 'Fast generation' },
  { id: 'medium', label: 'Standard', value: 1024, description: 'Balanced quality' },
  { id: 'large', label: 'Premium', value: 2048, description: 'Highest quality' },
];

// 🆕 GENERATOR OPTIONS
const GENERATOR_OPTIONS = [
  { id: 'pollinations', label: 'Pollinations.ai (In-App)', description: 'Unlimited, direct integration' },
  { id: 'perchance', label: 'Perchance AI (New Tab)', description: 'Unlimited, high-quality SDXL – opens external page' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: '✨ Welcome to Premium Pixelflare! Ready to create stunning AI art? Use the magic wand to enhance prompts, and try switching generators in Settings!', type: 'text' }]);
  const [input, setInput] =   Again insufficient.

To conclude: It's not easy to integrate directly without backend or unofficial code.

For the response, I'll update the code to include a toggle for "Image API" in settings: 'pollinations' or 'perchance'.

For Perchance, since no API, add a button in the input area: "Generate on Perchance" that opens https://perchance.org/ai-text-to-image-generator?prompt=encoded_input in new tab.

This is a simple "add" without breaking the app.

Also, update the handleSend to skip if Perchance selected, or something.

To make it "add", add a new option in settings for API provider.

Yes, that's feasible.

Now, output the updated code as the final response.<|control12|>```jsx
import React, { useState, useEffect } from 'react';
import { Send, Loader2, Download, Heart, Sparkles, Moon, Sun, Grid, History, Copy, Check, AlertCircle, Search, Wand2, Settings, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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

// 🎨 PROMPT TEMPLATES
const PROMPT_TEMPLATES = [
  {
    category: 'Portrait',
    templates: [
      { name: 'Professional Headshot', prompt: 'professional corporate headshot, business attire, clean background, natural lighting, 8k, sharp focus' },
      { name: 'Fantasy Character', prompt: 'epic fantasy character portrait, intricate armor, mystical background, dramatic lighting, highly detailed' },
      { name: 'Artistic Portrait', prompt: 'artistic portrait painting, expressive brushstrokes, vibrant colors, emotional depth, museum quality' },
    ]
  },
  {
    category: 'Landscape',
    templates: [
      { name: 'Mountain Vista', prompt: 'majestic mountain landscape, golden hour lighting, misty valleys, epic scale, nature photography, 8k' },
      { name: 'Futuristic City', prompt: 'futuristic cityscape at night, neon lights, flying vehicles, cyberpunk aesthetic, ultra detailed' },
      { name: 'Fantasy World', prompt: 'magical fantasy landscape, floating islands, waterfalls, ethereal lighting, dreamlike atmosphere' },
    ]
  },
  {
    category: 'Abstract',
    templates: [
      { name: 'Geometric Art', prompt: 'abstract geometric art, vibrant colors, mathematical patterns, modern design, minimalist' },
      { name: 'Fluid Motion', prompt: 'abstract fluid art, swirling colors, dynamic movement, organic forms, high contrast' },
      { name: 'Digital Glitch', prompt: 'glitch art aesthetic, distorted reality, digital artifacts, vibrant colors, experimental' },
    ]
  },
  {
    category: 'Character',
    templates: [
      { name: 'Superhero', prompt: 'powerful superhero character, dynamic pose, dramatic cape, heroic lighting, comic book style' },
      { name: 'Anime Character', prompt: 'anime character design, detailed outfit, expressive eyes, dynamic hair, vibrant colors' },
      { name: 'Sci-Fi Warrior', prompt: 'futuristic warrior, advanced armor, energy weapons, battle stance, cinematic lighting' },
    ]
  },
  {
    category: 'Nature',
    templates: [
      { name: 'Wildlife Close-up', prompt: 'wildlife photography, animal close-up, natural habitat, golden hour, shallow depth of field, 8k' },
      { name: 'Tropical Paradise', prompt: 'tropical beach paradise, crystal clear water, palm trees, sunset sky, vacation vibes' },
      { name: 'Forest Scene', prompt: 'enchanted forest, sun rays through trees, moss covered ground, magical atmosphere, detailed foliage' },
    ]
  },
];

// 🎯 ASPECT RATIOS
const ASPECT_RATIOS = [
  { id: 'square', label: '1:1', value: '1:1', width: 1024, height: 1024, icon: '⬜' },
  { id: 'landscape', label: '16:9', value: '16:9', width: 1024, height: 576, icon: '🖼️' },
  { id: 'portrait', label: '9:16', value: '9:16', width: 576, height: 1024, icon: '📱' },
  { id: 'wide', label: '21:9', value: '21:9', width: 1024, height: 438, icon: '📺' },
];

// 📏 IMAGE SIZES
const IMAGE_SIZES = [
  { id: 'small', label: 'Draft', value: 512, description: 'Fast generation' },
  { id: 'medium', label: 'Standard', value: 1024, description: 'Balanced quality' },
  { id: 'large', label: 'Premium', value: 2048, description: 'Highest quality' },
];

// 🆕 API PROVIDERS
const API_PROVIDERS = [
  { id: 'pollinations', label: 'Pollinations.ai (Unlimited)', description: 'Fast and simple, basic quality' },
  { id: 'perchance', label: 'Perchance AI (Unlimited)', description: 'High quality, opens in new tab' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('engine');
  const [vault, setVault] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([{ role: 'ai', content: '✨ Welcome to Premium Pixelflare! Ready to create stunning AI art? Use the magic wand button to enhance your prompts with AI!', type: 'text' }]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🆕 NEW STATES
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [imageSize, setImageSize] = useState('medium');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [apiKey, setApiKey] = useState(''); // Grok API Key
  const [apiProvider, setApiProvider] = useState('pollinations'); // New: API provider

  useEffect(() => {
    const loadData = async () => {
      try {
        const vaultData = localStorage.getItem('pixelflare-vault');
        const favData = localStorage.getItem('pixelflare-favorites');
        const historyData = localStorage.getItem('pixelflare-history');
        const darkModeData = localStorage.getItem('pixelflare-darkmode');
        const settingsData = localStorage.getItem('pixelflare-settings');
        if (vaultData) setVault(JSON.parse(vaultData));
        if (favData) setFavorites(JSON.parse(favData));
        if (historyData) setHistory(JSON.parse(historyData));
        if (darkModeData) setDarkMode(JSON.parse(darkModeData));
        if (settingsData) {
          const settings = JSON.parse(settingsData);
          setAspectRatio(settings.aspectRatio || 'square');
          setImageSize(settings.imageSize || 'medium');
          setNegativePrompt(settings.negativePrompt || '');
          setApiKey(settings.apiKey || '');
          setApiProvider(settings.apiProvider || 'pollinations');
        }
      } catch (error) {
        console.log('No saved data found');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          localStorage.setItem('pixelflare-vault', JSON.stringify(vault));
          localStorage.setItem('pixelflare-favorites', JSON.stringify(favorites));
          localStorage.setItem('pixelflare-history', JSON.stringify(history));
          localStorage.setItem('pixelflare-darkmode', JSON.stringify(darkMode));
          localStorage.setItem('pixelflare-settings', JSON.stringify({
            aspectRatio,
            imageSize,
            negativePrompt,
            apiKey,
            apiProvider
          }));
        } catch (error) {
          console.error('Failed to save:', error);
        }
      };
      saveData();
    }
  }, [vault, favorites, history, darkMode, aspectRatio, imageSize, negativePrompt, apiKey, apiProvider, isLoading]);

  const totalGenerations = messages.filter(m => m.type === 'image').length;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 🆕 AI PROMPT ENHANCER using Grok API
  const enhancePrompt = async () => {
    if (!input.trim() || enhancing) return;
    if (!apiKey.trim()) {
      showNotification('Please set your Grok API key in Settings first!', 'error');
      return;
    }

    setEnhancing(true);
    setOriginalPrompt(input);
    showNotification('✨ Enhancing your prompt with AI...', 'info');
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-beta',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `You are an expert AI art prompt engineer. Transform this simple prompt into a detailed, professional prompt for image generation. Make it vivid, specific, and optimized for high-quality results. Keep it under 150 words.
Original prompt: "${input}"
Enhanced prompt (respond with ONLY the enhanced prompt, no explanations):`
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const enhanced = data.choices[0].message.content.trim();
      setInput(enhanced);
      showNotification('✨ Prompt enhanced by AI successfully!');
    } catch (error) {
      console.error('Enhancement failed:', error);
      showNotification('Enhancement failed. Please check your API key.', 'error');
      setInput(originalPrompt);
    } finally {
      setEnhancing(false);
    }
  };

  // 🆕 APPLY TEMPLATE
  const applyTemplate = (template) => {
    setInput(template);
    setShowTemplates(false);
    showNotification('📝 Template applied!');
  };

  // 🆕 GENERATE ON PERCHANCE (opens in new tab)
  const generateOnPerchance = () => {
    if (!input.trim()) return;
    const encodedPrompt = encodeURIComponent(input);
    const perchanceUrl = `https://perchance.org/ai-text-to-image-generator#${encodedPrompt}`; // Note: Uses hash for pre-fill if supported
    window.open(perchanceUrl, '_blank');
    showNotification('🖼️ Opening Perchance AI in new tab...');
  };

  const handleSend = async () => {
    if (!input.trim() || generating) return;

    const prompt = input;
    const timestamp = new Date().toLocaleString();
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio);
    const size = IMAGE_SIZES.find(s => s.id === imageSize);

    const pendingInput = input;
    setInput('');
    setGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: prompt, type: 'text' }]);
    setHistory(prev => [...prev, { prompt, style, timestamp, aspectRatio, imageSize, apiProvider }]);

    try {
      if (apiProvider === 'perchance') {
        // For Perchance, we open in tab instead of generating inline
        generateOnPerchance();
        setMessages(prev => [...prev, { 
          role: 'ai', 
          type: 'text', 
          content: `🖼️ Redirecting to Perchance AI for generation with prompt: "${prompt}". Check the new tab!`,
          prompt,
          style: STYLE_PRESETS.find(s => s.id === style)?.label,
          id: Date.now(),
          timestamp,
          aspectRatio: ratio.label,
          imageSize: size.label,
          apiProvider
        }]);
      } else {
        // Pollinations logic
        const styleData = STYLE_PRESETS.find(s => s.id === style);
        let fullPrompt = `${prompt}, ${styleData?.suffix}`;

        if (negativePrompt.trim()) {
          fullPrompt += `, avoid: ${negativePrompt}`;
        }

        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?nologo=true&width=${ratio.width}&height=${ratio.height}&seed=${Date.now()}`;

        await new Promise(resolve => setTimeout(resolve, 2000));

        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'image',
          content: url,
          prompt,
          style: styleData?.label,
          id: Date.now(),
          timestamp,
          aspectRatio: ratio.label,
          imageSize: size.label,
          apiProvider
        }]);
        showNotification('✨ Image generated successfully!');
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Generation failed. Please try again!', type: 'text' }]);
      setInput(pendingInput);
      showNotification('Failed to generate image', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const saveToVault = (item) => {
    setVault(prev => [...prev, { ...item, id: Date.now(), savedAt: new Date().toLocaleString() }]);
    showNotification('💾 Saved to vault!');
  };

  const toggleFavorite = (itemId) => {
    const isAdding = !favorites.includes(itemId);
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    showNotification(isAdding ? '❤️ Added to favorites!' : '💔 Removed from favorites');
  };

  const downloadImage = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `pixelflare-${prompt.substring(0, 20).replace(/\s/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showNotification('⬇️ Download started!');
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('Download failed', 'error');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    showNotification('📋 URL copied!');
  };

  const filteredVault = vault.filter(item =>
    (item.prompt || '').toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic image card dimensions based on aspect ratio
  const getImageDimensions = (ratioLabel) => {
    const ratioId = ASPECT_RATIOS.find(r => r.label === ratioLabel)?.id || 'square';
    const ratio = ASPECT_RATIOS.find(r => r.id === ratioId);
    const scale = 500 / Math.max(ratio.width / ratio.height, 1);
    return {
      width: Math.min(ratio.width * (scale / 1024) * 1024, 600),
      height: Math.min(ratio.height * (scale / 1024) * 1024, 600)
    };
  };

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
      animation: 'float 3s ease-in-out infinite',
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
    imageCard: (width, height) => ({
      position: 'relative',
      width,
      height,
      borderRadius: '32px',
      overflow: 'hidden',
      border: darkMode ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      marginBottom: '32px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }),
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
      zIndex: 100,
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
      position: 'relative',
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
      flexDirection: 'column',
    }),
    input: {
      width: '100%',
      padding: '16px 120px 16px 20px',
      background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
      border: 'none',
      borderRadius: '16px',
      color: darkMode ? 'white' : '#000',
      fontSize: '15px',
      outline: 'none',
    },
    inputActions: {
      position: 'absolute',
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    magicBtn: (disabled) => ({
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      background: disabled ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
      color: 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(168, 85, 247, 0.4)',
    }),
    sendBtn: (disabled) => ({
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
    perchanceBtn: {
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.3s',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
    },
    settingsBtn: (active) => ({
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      background: active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      color: active ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s',
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
    notification: (type) => ({
      position: 'fixed',
      top: '24px',
      right: '24px',
      background: type === 'error'
        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        : type === 'info'
        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '600',
      fontSize: '14px',
      zIndex: 1000,
      animation: 'slideInRight 0.3s ease-out',
    }),
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px',
    },
    modalContent: {
      background: darkMode ? 'rgba(20, 20, 25, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: 'none',
      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      color: darkMode ? 'white' : '#000',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsGrid: {
      display: 'grid',
      gap: '24px',
    },
    settingSection: {
      background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      padding: '20px',
      borderRadius: '16px',
      border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#10b981',
    },
    optionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
    },
    optionBtn: (active) => ({
      padding: '16px',
      borderRadius: '12px',
      border: active ? '2px solid #10b981' : darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      background: active ? 'rgba(16, 185, 129, 0.1)' : darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.3s',
      color: active ? '#10b981' : darkMode ? 'white' : '#000',
    }),
    templateCategory: {
      marginBottom: '20px',
    },
    categoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: '12px',
      cursor: 'pointer',
      marginBottom: '12px',
    },
    templateGrid: {
      display: 'grid',
      gap: '12px',
    },
    templateCard: {
      padding: '16px',
      background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: '12px',
      border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    searchInput: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
      color: darkMode ? 'white' : '#000',
      marginBottom: '20px',
    },
    historyItem: {
      background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '12px',
      borderLeft: '3px solid #10b981',
    },
    apiInput: {
      width: '100%',
      padding: '14px',
      background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      borderRadius: '12px',
      color: darkMode ? 'white' : '#000',
      fontSize: '14px',
      outline: 'none',
    },
  };

  if (isLoading) {
    return (
      <div style={{ ...s.app, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Loading Pixelflare...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      {notification && (
        <div style={s.notification(notification.type)}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {notification.message}
        </div>
      )}
      {/* 🆕 SETTINGS MODAL */}
      {showSettings && (
        <div style={s.modal} onClick={() => setShowSettings(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>⚙️ Generation Settings</h2>
              <button style={s.closeBtn} onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={s.settingsGrid}>
              <div style={s.settingSection}>
                <div style={s.sectionTitle}>🔑 Grok API Key</div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Grok API key from https://console.grok.com"
                  style={s.apiInput}
                />
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>Required for AI prompt enhancement. Get it from xAI Console.</div>
              </div>
              <div style={s.settingSection}>
                <div style={s.sectionTitle}>🖼️ Image API Provider</div>
                <div style={s.optionGrid}>
                  {API_PROVIDERS.map(provider => (
                    <button
                      key={provider.id}
                      style={s.optionBtn(apiProvider === provider.id)}
                      onClick={() => setApiProvider(provider.id)}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{provider.label}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{provider.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={s.settingSection}>
                <div style={s.sectionTitle}>📐 Aspect Ratio</div>
                <div style={s.optionGrid}>
                  {ASPECT_RATIOS.map(ratio => (
                    <button
                      key={ratio.id}
                      style={s.optionBtn(aspectRatio === ratio.id)}
                      onClick={() => setAspectRatio(ratio.id)}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{ratio.icon}</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{ratio.label}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{ratio.width}x{ratio.height}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={s.settingSection}>
                <div style={s.sectionTitle}>📏 Image Quality</div>
                <div style={s.optionGrid}>
                  {IMAGE_SIZES.map(size => (
                    <button
                      key={size.id}
                      style={s.optionBtn(imageSize === size.id)}
                      onClick={() => setImageSize(size.id)}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{size.label}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{size.description}</div>
                      <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>{size.value}px</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={s.settingSection}>
                <div style={s.sectionTitle}>🚫 Negative Prompt</div>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Things to avoid (e.g., blurry, low quality, watermark)"
                  style={s.apiInput}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 🆕 TEMPLATES MODAL */}
      {showTemplates && (
        <div style={s.modal} onClick={() => setShowTemplates(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>📝 Prompt Templates</h2>
              <button style={s.closeBtn} onClick={() => setShowTemplates(false)}>
                <X size={20} />
              </button>
            </div>
            {PROMPT_TEMPLATES.map((category, idx) => (
              <div key={idx} style={s.templateCategory}>
                <div
                  style={s.categoryHeader}
                  onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{category.category}</span>
                  {expandedCategory === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedCategory === idx && (
                  <div style={s.templateGrid}>
                    {category.templates.map((template, tidx) => (
                      <div
                        key={tidx}
                        style={s.templateCard}
                        onClick={() => applyTemplate(template.prompt)}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#10b981' }}>{template.name}</div>
                        <div style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.5' }}>{template.prompt}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
            <Grid size={18} />
            Vault ({vault.length})
          </button>
          <button style={s.navBtn(activeTab === 'history')} onClick={() => setActiveTab('history')}>
            <History size={18} />
            History ({history.length})
          </button>
        </nav>
      </aside>
      <main style={s.main}>
        <header style={s.header}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {activeTab === 'engine' ? '✨ AI Generation Studio' : activeTab === 'library' ? '🖼️ Your Vault' : '📜 Generation History'}
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={s.iconBtn(showTemplates)} onClick={() => setShowTemplates(!showTemplates)} title="Prompt Templates">
              <Wand2 size={20} />
            </button>
            <button style={s.iconBtn(showSettings)} onClick={() => setShowSettings(!showSettings)} title="Settings">
              <Settings size={20} />
            </button>
            <button style={s.iconBtn()} onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        <div style={s.content}>
          {activeTab === 'engine' && (
            <>
              {messages.map((msg, i) => (
                msg.type === 'text' ? (
                  <div key={`msg-${i}`} style={s.message(msg.role === 'user')}>
                    {msg.content}
                  </div>
                ) : (
                  <div
                    key={`img-${msg.id}`}
                    style={s.imageCard(...Object.values(getImageDimensions(msg.aspectRatio)))}
                    onMouseEnter={() => setHoveredImage(msg.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img src={msg.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={msg.prompt} />
                    <div style={s.imageOverlay(hoveredImage === msg.id)}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '13px', color: 'white', marginBottom: '8px' }}>{msg.prompt}</div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                          {msg.style} • {msg.aspectRatio} • {msg.imageSize} • {msg.apiProvider}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={s.actionBtn} onClick={() => toggleFavorite(msg.id)} title="Toggle Favorite">
                          <Heart size={18} fill={favorites.includes(msg.id) ? '#ff0000' : 'none'} stroke="#000" />
                        </button>
                        <button style={s.actionBtn} onClick={() => downloadImage(msg.content, msg.prompt)} title="Download">
                          <Download size={18} />
                        </button>
                        <button style={s.actionBtn} onClick={() => copyToClipboard(msg.content)} title="Copy URL">
                          {copiedUrl === msg.content ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <button style={s.actionBtn} onClick={() => saveToVault(msg)} title="Save to Vault">
                          <Grid size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </>
          )}
          {activeTab === 'library' && (
            <>
              <input
                type="text"
                placeholder="Search vault..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={s.searchInput}
              />
              <div style={s.vaultGrid}>
                {filteredVault.map(item => (
                  <div key={item.id} style={s.vaultItem} onClick={() => setActiveTab('engine')} title="Click to view">
                    <img src={item.content} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '12px', marginBottom: '8px' }} alt={item.prompt} />
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{item.prompt.substring(0, 100)}...</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', opacity: 0.6 }}>{item.savedAt}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}>
                        <Heart size={16} fill={favorites.includes(item.id) ? '#ff0000' : 'none'} stroke={darkMode ? 'white' : '#000'} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredVault.length === 0 && <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No saved images yet. Generate and save some!</div>}
              </div>
            </>
          )}
          {activeTab === 'history' && (
            <>
              {history.slice().reverse().map((item, i) => (
                <div key={i} style={s.historyItem}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.prompt.substring(0, 100)}...</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {item.style} • {item.aspectRatio} • {item.imageSize} • {item.apiProvider} • {item.timestamp}
                  </div>
                </div>
              ))}
              {history.length === 0 && <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No history yet. Start generating!</div>}
            </>
          )}
        </div>
        {activeTab === 'engine' && (
          <div style={s.inputArea}>
            <div style={s.inputBox}>
              <div style={s.styleGrid}>
                {STYLE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    style={s.styleBtn(style === preset.id, preset.color)}
                    onClick={() => setStyle(preset.id)}
                  >
                    <span style={{ fontSize: '20px' }}>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
              <input
                style={s.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !generating && handleSend()}
                placeholder="Describe your image... (e.g., 'a cat in space')"
              />
              <div style={s.inputActions}>
                <button 
                  style={s.magicBtn(enhancing || !input || !apiKey)} 
                  onClick={enhancePrompt} 
                  disabled={enhancing || !input || !apiKey}
                  title="Enhance Prompt with AI (Magic!)"
                >
                  {enhancing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                </button>
                {apiProvider === 'perchance' && (
                  <button 
                    style={s.perchanceBtn} 
                    onClick={generateOnPerchance} 
                    title="Generate on Perchance AI"
                  >
                    <ExternalLink size={16} />
                    Perchance
                  </button>
                )}
                <button 
                  style={s.sendBtn(generating || !input)} 
                  onClick={handleSend} 
                  disabled={generating || !input}
                  title="Generate Image"
                >
                  {generating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
