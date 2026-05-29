import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- IMAGE STAGE ASSETS ---
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

const STAGES = [
  JB1, JB_licked1, JB_licked2, JB_licked3, JB_licked4, JB_licked5,
  JB_licked6, JB_licked7, JB_licked8, JB_licked9, JB_licked10, JB_licked11,
  JB_licked12, JB_licked13, JB_licked14, JB_licked15, JB_licked16
];

// --- HARD-CODED PROGRESSION MILESTONES ---
const LAYER_MILESTONES = [
  1,        // Layer 0 dissolves at 1 lick
  25,       // Layer 1
  50,       // Layer 2
  100,      // Layer 3 (Milestone reached)
  250,      // Layer 4
  500,      // Layer 5
  1000,     // Layer 6 (Milestone reached)
  2500,     // Layer 7
  5000,     // Layer 8
  10000,    // Layer 9 (Milestone reached)
  25000,    // Layer 10
  50000,    // Layer 11
  100000,   // Layer 12
  250000,   // Layer 13
  500000,   // Layer 14
  1000000   // Layer 15 dissolves, exposing the core skin
];

type UpgradeType = 'tongue' | 'scraper' | 'grandma' | 'factory' | 'saliva' | 'quantum';

interface VisualEffect {
  id: string;
  x: number;
  y: number;
}

export function App() {
  // --- CORE SYSTEM GAME STATES ---
  const [count, setCount] = useState(0);
  const [totalLicks, setTotalLicks] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [isLicking, setIsLicking] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<VisualEffect[]>([]);
  const [ripples, setRipples] = useState<VisualEffect[]>([]);
  
  const [costs, setCosts] = useState<Record<UpgradeType, number>>({ 
    tongue: 15, scraper: 100, grandma: 500, factory: 3000, saliva: 12000, quantum: 85000 
  });
  
  const [owned, setOwned] = useState<Record<UpgradeType, number>>({
    tongue: 0, scraper: 0, grandma: 0, factory: 0, saliva: 0, quantum: 0
  });

  const effectIdCounter = useRef(0);

  // --- DYNAMIC BALANCE ENGINE ---
  const licksPerClick = 1 + owned.tongue * 1 + owned.scraper * 8;
  const licksPerSecond = (owned.grandma * 4) + (owned.factory * 32) + (owned.saliva * 150) + (owned.quantum * 900);

  // Smooth clicker loop processing at high frame rates (10hz checks)
  useEffect(() => {
    if (licksPerSecond <= 0) return;
    const timer = setInterval(() => {
      setCount(prev => prev + licksPerSecond / 10);
      setTotalLicks(prev => prev + licksPerSecond / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [licksPerSecond]);

  // --- INTERACTION HANDLER ---
  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCount(prev => prev + licksPerClick);
    setTotalLicks(prev => prev + licksPerClick);
    setClicksCount(prev => prev + 1);
    setIsLicking(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    effectIdCounter.current += 1;
    const dynamicId = `${Date.now()}-${effectIdCounter.current}`;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFloatingTexts(prev => [...prev, { id: dynamicId, x, y }]);
    setRipples(prev => [...prev, { id: dynamicId, x, y }]);
    setTimeout(() => setIsLicking(false), 80);
  };

  const buyUpgrade = (type: UpgradeType) => {
    const cost = costs[type];
    if (count < cost) return;

    setCount(prev => prev - cost);
    setOwned(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setCosts(prev => ({ ...prev, [type]: Math.floor(prev[type] * 1.15) }));
  };

  // --- COOKIE CLICKER STRUCTURAL SHOPS DATA ---
  const shopItems = [
    { id: 'tongue', name: 'Sandpaper Tongue', icon: '👅', benefit: '+1 / Click', cost: costs.tongue },
    { id: 'scraper', name: 'Diamond Scraper', icon: '💎', benefit: '+8 / Click', cost: costs.scraper },
    { id: 'grandma', name: 'Candy Grandma', icon: '👵', benefit: '+4 / Sec', cost: costs.grandma },
    { id: 'factory', name: 'Refinery Plant', icon: '🏭', benefit: '+32 / Sec', cost: costs.factory },
    { id: 'saliva', name: 'Radioactive Drool', icon: '🧪', benefit: '+150 / Sec', cost: costs.saliva },
    { id: 'quantum', name: 'Subatomic Dissolver', icon: '🌌', benefit: '+900 / Sec', cost: costs.quantum },
  ] as const;

  const tickerMessage = 
    totalLicks < 100 ? "🍬 Fresh jawbreaker arrived in the test chamber." :
    totalLicks < 1000 ? "👵 Local grandmas are volunteering to help lick." :
    totalLicks < 10000 ? "🦷 Dentists worldwide are signing a formal protest." :
    "💥 Critical mass achieved! The candy fabric is tearing apart!";

  return (
    <div className="game-layout">
      {/* LEFT COLUMN PANEL */}
      <div className="panel left-panel">
        <div className="cookie-bakery-heading">
          <h2>JAWBREAKER CLICKER</h2>
          <p className="subheading">Survive the sour center!</p>
        </div>
        
        <div className="counter-section">
          <p className="licks">{Math.floor(count).toLocaleString()} 👅</p>
          <p className="stats-per-sec">per second: <span className="neon-cyan">{licksPerSecond.toLocaleString()}</span></p>
        </div>

        <div className="candy-wrapper">
          <div className={`candy-container ${isLicking ? 'animate-lick' : ''}`} onClick={handleMainClick}>
            {STAGES.map((asset, idx) => {
              const requiredLicks = LAYER_MILESTONES[idx] || 0;
              const dissolved = totalLicks >= requiredLicks && idx !== STAGES.length - 1;
              return <img key={idx} src={asset} className={`candy-layer layer-${idx} ${dissolved ? 'dissolved' : ''}`} alt="" />;
            }).reverse()}
            
            {ripples.map(r => (
              <span key={r.id} className="click-ripple" style={{ left: r.x, top: r.y }} onAnimationEnd={() => setRipples(p => p.filter(i => i.id !== r.id))} />
            ))}
            {floatingTexts.map(t => (
              <span key={t.id} className="floating-text" style={{ left: t.x, top: t.y }} onAnimationEnd={() => setFloatingTexts(p => p.filter(i => i.id !== t.id))}>+{licksPerClick}</span>
            ))}
          </div>
        </div>
        <div className="bottom-spacing" />
      </div>

      {/* MIDDLE COLUMN INFO */}
      <div className="panel middle-panel">
        <div className="news-ticker">
          <p className="news-title">📰 THE DAILY CRUNCH</p>
          <p className="news-text">{tickerMessage}</p>
        </div>
        <div className="stats-content">
          <h3>📊 RADAR STATISTICS</h3>
          <div className="stats-card">
            <p>🧬 Lifetime Licks: <span className="neon-value">{Math.floor(totalLicks).toLocaleString()}</span></p>
            <p>⚡ Current Lick Power: <span className="neon-value">+{licksPerClick}</span></p>
            <p>🖱️ Total Manual Clicks: <span className="neon-value">{clicksCount}</span></p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN SHOP */}
      <div className="panel right-panel">
        <div className="store-header">
          <h3>🛒 SWEET SHOP</h3>
        </div>
        <div className="upgrades-list">
          {shopItems.map(item => (
            <button key={item.id} className="store-item" onClick={() => buyUpgrade(item.id)} disabled={count < item.cost}>
              <div className="item-icon">{item.icon}</div>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-cost">💰 {item.cost.toLocaleString()}</span>
              </div>
              <div className="item-meta">
                <span className="item-owned">x{owned[item.id]}</span>
                <span className="item-benefit">{item.benefit}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
