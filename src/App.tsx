import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// 1. Image Asset Array Definition
import JB1 from './assets/JB1.png';
import JB_licked1 from './assets/JB stg.2.png';
import JB_licked2 from './assets/JB stg.3.png';
import JB_licked3 from './assets/JB stg.4.png';
import JB_licked4 from './assets/JB stg.5.png';
import JB_licked5 from './assets/JB Stg.6.png';
import JB_licked6 from './assets/JB stg.7.png';
import JB_licked7 from './assets/JB stg.8.png';
import JB_licked8 from './assets/JB stg.9.png';
import JB_licked9 from './assets/JB stg.10.png';
import JB_licked10 from './assets/JB stg.11.png';
import JB_licked11 from './assets/JB stg.12.png';
import JB_licked12 from './assets/JB stg.13.png';
import JB_licked13 from './assets/JB stg.14.png';
import JB_licked14 from './assets/JB stg.15.png';
import JB_licked15 from './assets/JB stg.16.png';
import JB_licked16 from './assets/JB stg.17.png';

const JAWBREAKER_STAGES = [
  JB1, JB_licked1, JB_licked2, JB_licked3, JB_licked4, JB_licked5,
  JB_licked6, JB_licked7, JB_licked8, JB_licked9, JB_licked10, JB_licked11,
  JB_licked12, JB_licked13, JB_licked14, JB_licked15, JB_licked16
];

type UpgradeType = 'tongue' | 'scraper' | 'saliva';

interface ClickVFX {
  id: string;
  x: number;
  y: number;
}

export function App() {
  // --- GAME STATE ---
  const [count, setCount] = useState<number>(0);
  const [totalLicks, setTotalLicks] = useState<number>(0);
  const [licksPerClick, setLicksPerClick] = useState<number>(1);
  const [acidSalivaMulti, setAcidSalivaMulti] = useState<number>(1);
  const [autoLicksPerSecond, setAutoLicksPerSecond] = useState<number>(0);
  
  // --- UI & VFX STATE ---
  const [isLicking, setIsLicking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<ClickVFX[]>([]);
  const [ripples, setRipples] = useState<ClickVFX[]>([]);
  const [costs, setCosts] = useState<Record<UpgradeType, number>>({ 
    tongue: 10, 
    scraper: 50, 
    saliva: 100 
  });

  const effectIdCounter = useRef<number>(0);

  // --- AUTOMATED TICKER LOOP ---
  useEffect(() => {
    if (autoLicksPerSecond <= 0) return;
    const timer = setInterval(() => {
      setCount((prev) => prev + autoLicksPerSecond);
      setTotalLicks((prev) => prev + autoLicksPerSecond);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoLicksPerSecond]);

  // --- INTERACTIVE ACTIONS ---
  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCount((prev) => prev + licksPerClick);
    setTotalLicks((prev) => prev + licksPerClick);
    setIsLicking(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    effectIdCounter.current += 1;
    const dynamicId = `${Date.now()}-${effectIdCounter.current}`;
    
    setFloatingTexts((prev) => [...prev, { id: dynamicId, x, y }]);
    setRipples((prev) => [...prev, { id: dynamicId, x, y }]);
    
    setTimeout(() => setIsLicking(false), 100);
  };

  const buyUpgrade = (type: UpgradeType) => {
    const cost = costs[type];
    if (count < cost) return;

    setCount((prev) => prev - cost);
    
    if (type === 'tongue') setLicksPerClick((prev) => prev + 1);
    else if (type === 'scraper') setLicksPerClick((prev) => prev + 5);
    else if (type === 'saliva') {
      setAutoLicksPerSecond((prev) => prev + Math.floor(10 * acidSalivaMulti));
      setAcidSalivaMulti((prev) => prev + 0.5);
    }
    
    setCosts((prev) => ({ ...prev, [type]: Math.floor(prev[type] * 1.5) }));
  };

  // --- DATA LAYERS FOR PLAYFUL UI COMPACTNESS ---
  const upgradeConfig = [
    { id: 'tongue', name: 'Sandpaper Tongue', icon: '👅', benefit: `+1 Lick/Click`, cost: costs.tongue },
    { id: 'scraper', name: 'Candy Laser Grinder', icon: '🦈', benefit: `+5 Licks/Click`, cost: costs.scraper },
    { id: 'saliva', name: 'Radioactive Sour Drool', icon: '🧪', benefit: `+${Math.floor(10 * acidSalivaMulti)} Licks/Sec`, cost: costs.saliva }
  ] as const;

  const tickerMessages = [
    { limit: 5, text: "🍬 Your jawbreaker is shiny, fresh, and completely unlicked!" },
    { limit: 12, text: "🦷 Warning: Your dentist is starting to sweat right now." },
    { limit: Infinity, text: "💥 Sweet mother of candy! The outer shell is melting away!" }
  ];

  const activeTickerMessage = tickerMessages.find(m => totalLicks < m.limit)?.text;

  return (
    <div className="game-layout">
      {/* LEFT COLUMN: MAIN INTERACTION */}
      <div className="panel left-panel">
        <div className="cookie-bakery-heading">
          <h2>JAWBREAKER CRUSHER</h2>
          <p className="subheading">Can you survive the sour center?!</p>
        </div>
        
        <div className="counter-section">
          <p className="licks">{Math.floor(count).toLocaleString()}👅</p>
          <p className="stats-per-sec">licking at <span className="neon-cyan">{autoLicksPerSecond}</span> / sec</p>
        </div>

        <div className="candy-wrapper">
          <div className={`candy-container ${isLicking ? 'animate-lick' : ''}`} onClick={handleMainClick}>
            {JAWBREAKER_STAGES.map((imageAsset, index) => {
              const isDissolved = totalLicks >= index * 10 && index !== JAWBREAKER_STAGES.length - 1;
              return (
                <img 
                  key={index}
                  src={imageAsset} 
                  className={`candy-layer layer-${index} ${isDissolved ? 'dissolved' : ''}`} 
                  alt={`Jawbreaker Stage ${index}`} 
                />
              );
            }).reverse()}
            
            {ripples.map((r) => (
              <span key={r.id} className="click-ripple" style={{ left: r.x, top: r.y }} onAnimationEnd={() => setRipples(prev => prev.filter(item => item.id !== r.id))} />
            ))}

            {floatingTexts.map((t) => (
              <span key={t.id} className="floating-text" style={{ left: t.x, top: t.y }} onAnimationEnd={() => setFloatingTexts(prev => prev.filter(item => item.id !== t.id))}>
                +{licksPerClick}
              </span>
            ))}
          </div>
        </div>
        
        <div className="milk-container">
          <div className="milk-wave wave-back"></div>
          <div className="milk-wave wave-front"></div>
        </div>
      </div>

      {/* MIDDLE COLUMN: STATS AND NEWS */}
      <div className="panel middle-panel">
        <div className="news-ticker">
          <p className="news-title">📣 CANDY FEED</p>
          <p className="news-text">{activeTickerMessage}</p>
        </div>
        <div className="stats-content">
          <h3>📊 TONGUE RADAR</h3>
          <div className="stats-card">
            <p>👅 Lifetime Licks: <span className="neon-value">{totalLicks.toLocaleString()}</span></p>
            <p>⚡ Current Bite Force: <span className="neon-value">+{licksPerClick}</span></p>
            <p>🧪 Flavor Melt Multiplier: <span className="neon-value">{acidSalivaMulti.toFixed(1)}x</span></p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: REFACTORED UPGRADE SHOP */}
      <div className="panel right-panel">
        <div className="store-header">
          <h3>👅 CANDY MUTATIONS</h3>
        </div>
        
        <div className="upgrades-list">
          {upgradeConfig.map((item) => (
            <button 
              key={item.id}
              className="store-item" 
              onClick={() => buyUpgrade(item.id)} 
              disabled={count < item.cost}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-cost">💰 {item.cost.toLocaleString()} Licks</span>
              </div>
              <span className="item-benefit">{item.benefit}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
