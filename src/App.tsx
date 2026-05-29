import { useState, useEffect, useMemo } from 'react';

// --- IMAGE IMPORTS ---
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

// Array mapping your jawbreaker evolution stages smoothly
const JAWBREAKER_STAGES = [
  JB1, JB_licked1, JB_licked2, JB_licked3, JB_licked4, JB_licked5, 
  JB_licked6, JB_licked7, JB_licked8, JB_licked9, JB_licked10, 
  JB_licked11, JB_licked12, JB_licked13, JB_licked14, JB_licked15, JB_licked16
];

type UpgradeType = 'tongue' | 'scraper' | 'saliva';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function App() {
  // --- STATE ---
  const [licks, setLicks] = useState(0);
  const [lifetimeLicks, setLifetimeLicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoLicks, setAutoLicks] = useState(0);
  const [acidMulti, setAcidMulti] = useState(1.0);
  
  const [isLicking, setIsLicking] = useState(false);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [costs, setCosts] = useState({ tongue: 10, scraper: 50, saliva: 100 });

  // --- AUTOMATION ---
  useEffect(() => {
    if (autoLicks <= 0) return;
    const interval = setInterval(() => {
      setLicks(prev => prev + autoLicks);
      setLifetimeLicks(prev => prev + autoLicks);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLicks]);

  // --- CORE LOGIC ---
  const handleLick = (e: React.MouseEvent<HTMLDivElement>) => {
    setLicks(prev => prev + clickPower);
    setLifetimeLicks(prev => prev + clickPower);
    setIsLicking(true);
    setTimeout(() => setIsLicking(false), 80);

    // Capture precise coordinates for click tracking
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setClickEffects(prev => [...prev, { id, x, y, text: `+${clickPower}` }]);
  };

  const cleanEffect = (id: number) => {
    setClickEffects(prev => prev.filter(eff => eff.id !== id));
  };

  const buyUpgrade = (type: UpgradeType) => {
    const cost = costs[type];
    if (licks < cost) return;

    setLicks(prev => prev - cost);
    setCosts(prev => ({ ...prev, [type]: Math.floor(prev[type] * 1.5) }));

    if (type === 'tongue') setClickPower(prev => prev + 1);
    if (type === 'scraper') setClickPower(prev => prev + 5);
    if (type === 'saliva') {
      setAutoLicks(prev => prev + Math.floor(10 * acidMulti));
      setAcidMulti(prev => prev + 0.5);
    }
  };

  // --- DERIVED MEMOIZED VALUES ---
  const currentImage = useMemo(() => {
    const stageIndex = Math.floor(lifetimeLicks / 10);
    return JAWBREAKER_STAGES[Math.min(stageIndex, JAWBREAKER_STAGES.length - 1)];
  }, [lifetimeLicks]);

  const liveTicker = useMemo(() => {
    if (lifetimeLicks < 5) return '🔬 Subject experimental wrapper peeled open clean.';
    if (lifetimeLicks < 12) return '⚠️ Dental advisory status raised to critical level red.';
    return '🌌 Outer core compromised! Center crystals emerging!';
  }, [lifetimeLicks]);

  return (
    <div className="lab-container">
      {/* LEFT SECTION: CENTRAL CORE */}
      <div className="lab-core">
        <header>
          <h1>THE CANDY LAB</h1>
          <p className="ticker">{liveTicker}</p>
        </header>

        <div className={`jawbreaker ${isLicking ? 'active' : ''}`} onClick={handleLick}>
          <img src={currentImage} alt="Jawbreaker Core" className="candy-sprite" />
          
          {clickEffects.map(eff => (
            <div key={eff.id} className="effect-wrapper" style={{ left: eff.x, top: eff.y }} onAnimationEnd={() => cleanEffect(eff.id)}>
              <span className="ripple" />
              <span className="floating-num">{eff.text}</span>
            </div>
          ))}
        </div>

        <div className="dashboard">
          <div className="stat-node">
            <span className="label">CURRENT POOL</span>
            <span className="value text-cyan">{Math.floor(licks).toLocaleString()} Licks</span>
          </div>
          <div className="stat-node">
            <span className="label">AUTO DISSOLVE</span>
            <span className="value text-pink">{autoLicks}/sec</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: OPERATIONS PANEL */}
      <div className="lab-panel">
        <h2>LAB SPECIFICATIONS</h2>
        <div className="spec-card">
          <p>🧬 Lifetime Total: <span>{lifetimeLicks}</span></p>
          <p>⚡ Click Potency: <span>+{clickPower}</span></p>
          <p>🧪 Acid Strength: <span>{acidMulti.toFixed(1)}x</span></p>
        </div>

        <h2>UPGRADES SHOP</h2>
        <div className="shop-grid">
          <button className="shop-btn" disabled={licks < costs.tongue} onClick={() => buyUpgrade('tongue')}>
            <span className="icon">👅</span>
            <div className="meta">
              <strong>Rougher Tongue</strong>
              <span className="cost">🧬 {costs.tongue}</span>
            </div>
            <span className="benefit">+1/c</span>
          </button>

          <button className="shop-btn" disabled={licks < costs.scraper} onClick={() => buyUpgrade('scraper')}>
            <span className="icon">🪒</span>
            <div className="meta">
              <strong>Metal Scraper</strong>
              <span className="cost">🧬 {costs.scraper}</span>
            </div>
            <span className="benefit">+5/c</span>
          </button>

          <button className="shop-btn" disabled={licks < costs.saliva} onClick={() => buyUpgrade('saliva')}>
            <span className="icon">🧪</span>
            <div className="meta">
              <strong>Acidic Saliva</strong>
              <span className="cost">🧬 {costs.saliva}</span>
            </div>
            <span className="benefit">+{Math.floor(10 * acidMulti)}/s</span>
          </button>
        </div>
      </div>
    </div>
  );
}
