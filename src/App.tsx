import { useState, useEffect } from 'react';
import './App.css';
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

type UpgradeType = 'tongue' | 'scraper' | 'saliva';

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface VisualRipple {
  id: number;
  x: number;
  y: number;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const [totalLicks, setTotalLicks] = useState<number>(0);
  const [licksPerClick, setLicksPerClick] = useState<number>(1);
  const [acidSalivaMulti, setAcidSalivaMulti] = useState<number>(1);
  const [autoLicksPerSecond, setAutoLicksPerSecond] = useState<number>(0);
  const [isLicking, setIsLicking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [ripples, setRipples] = useState<VisualRipple[]>([]);
  
  const [costs, setCosts] = useState({ 
    tongue: 10, 
    scraper: 50, 
    saliva: 100 
  });

  useEffect(() => {
    if (autoLicksPerSecond > 0) {
      const timer = setInterval(() => {
        setCount((prev) => prev + autoLicksPerSecond);
        setTotalLicks((prev) => prev + autoLicksPerSecond);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [autoLicksPerSecond]);

  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCount((prev) => prev + licksPerClick);
    setTotalLicks((prev) => prev + licksPerClick);
    setIsLicking(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const timestamp = Date.now() + Math.random();
    
    setFloatingTexts((prev) => [...prev, { id: timestamp, text: `+${licksPerClick}`, x, y }]);
    setRipples((prev) => [...prev, { id: timestamp, x, y }]);
    
    setTimeout(() => setIsLicking(false), 100);
  };

  const removeFloatingText = (id: number) => {
    setFloatingTexts((prev) => prev.filter(t => t.id !== id));
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter(r => r.id !== id));
  };

  const buyUpgrade = (type: UpgradeType) => {
    const cost = costs[type];
    if (count >= cost) {
      setCount((prev) => prev - cost);
      
      if (type === 'tongue') {
        setLicksPerClick((prev) => prev + 1);
      } else if (type === 'scraper') {
        setLicksPerClick((prev) => prev + 5);
      } else if (type === 'saliva') {
        setAutoLicksPerSecond((prev) => prev + Math.floor(10 * acidSalivaMulti));
        setAcidSalivaMulti((prev) => prev + 0.5);
      }
      
      setCosts(prev => ({ ...prev, [type]: Math.floor(prev[type] * 1.5) }));
    }
  };

  return (
    <div className="game-layout">
      {/* LEFT COLUMN */}
      <div className="panel left-panel">
        <div className="cookie-bakery-heading">
          <h2>THE CANDY LAB</h2>
          <p className="subheading">dissolving sweet boundaries...</p>
        </div>
        
        <div className="counter-section">
          <p className="licks">{Math.floor(count).toLocaleString()} Licks</p>
          <p className="stats-per-sec">per second: <span className="neon-cyan">{autoLicksPerSecond}</span></p>
        </div>

        <div className="candy-wrapper">
          <div 
            className={`candy-container ${isLicking ? 'animate-lick' : ''}`}
            onClick={handleMainClick}
          >
            <img src={JB_licked5} className="candy-layer layer-5" alt="core" />
            <img src={JB_licked4} className={`candy-layer layer-4 ${totalLicks >= 15 ? 'dissolved' : ''}`} alt="stage 5" />
            <img src={JB_licked3} className={`candy-layer layer-3 ${totalLicks >= 12 ? 'dissolved' : ''}`} alt="stage 4" />
            <img src={JB_licked2} className={`candy-layer layer-2 ${totalLicks >= 9 ? 'dissolved' : ''}`} alt="stage 3" />
            <img src={JB_licked1} className={`candy-layer layer-1 ${totalLicks >= 6 ? 'dissolved' : ''}`} alt="stage 2" />
            <img src={JB1} className={`candy-layer layer-0 ${totalLicks >= 3 ? 'dissolved' : ''}`} alt="fresh jawbreaker" />
            
            {ripples.map((r) => (
              <span 
                key={r.id}
                className="click-ripple"
                style={{ left: r.x, top: r.y }}
                onAnimationEnd={() => removeRipple(r.id)}
              />
            ))}

            {floatingTexts.map((t) => (
              <span 
                key={t.id} 
                className="floating-text"
                style={{ left: t.x, top: t.y }}
                onAnimationEnd={() => removeFloatingText(t.id)}
              >
                {t.text}
              </span>
            ))}
          </div>
        </div>
        
        <div className="milk-container">
          <div className="milk-wave wave-back"></div>
          <div className="milk-wave wave-front"></div>
        </div>
      </div>

      {/* MIDDLE COLUMN */}
      <div className="panel middle-panel">
        <div className="news-ticker">
          <p className="news-title">🔴 Live Labs Ticker</p>
          <p className="news-text">
            {totalLicks < 5 ? "🔬 Subject experimental wrapper peeled open clean." : 
             totalLicks < 12 ? "⚠️ Dental advisory status raised to critical level red." : 
             "🌌 Outer core compromised! Center crystals emerging!"}
          </p>
        </div>
        <div className="stats-content">
          <h3>LAB SPECIFICATIONS</h3>
          <div className="stats-card">
            <p>🧬 Total Lifetime Licks: <span className="neon-value">{totalLicks}</span></p>
            <p>⚡ Manual Lick Potency: <span className="neon-value">+{licksPerClick}</span></p>
            <p>🧪 Acid Concentration: <span className="neon-value">{acidSalivaMulti.toFixed(1)}x</span></p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="panel right-panel">
        <div className="store-header">
          <h3>UPGRADES SHOP</h3>
        </div>
        
        <div className="upgrades-list">
          <button 
            className="store-item" 
            onClick={() => buyUpgrade('tongue')} 
            disabled={count < costs.tongue}
          >
            <div className="item-icon">👅</div>
            <div className="item-info">
              <span className="item-name">Rougher Tongue</span>
              <span className="item-cost">🧬 {costs.tongue}</span>
            </div>
            <span className="item-benefit">+1/c</span>
          </button>
          
          <button 
            className="store-item" 
            onClick={() => buyUpgrade('scraper')} 
            disabled={count < costs.scraper}
          >
            <div className="item-icon">🪒</div>
            <div className="item-info">
              <span className="item-name">Metal Scraper</span>
              <span className="item-cost">🧬 {costs.scraper}</span>
            </div>
            <span className="item-benefit">+5/c</span>
          </button>
          
          <button 
            className="store-item" 
            onClick={() => buyUpgrade('saliva')} 
            disabled={count < costs.saliva}
          >
            <div className="item-icon">🧪</div>
            <div className="item-info">
              <span className="item-name">Acidic Saliva</span>
              <span className="item-cost">🧬 {costs.saliva}</span>
            </div>
            <span className="item-benefit">+{Math.floor(10 * acidSalivaMulti)}/s</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
