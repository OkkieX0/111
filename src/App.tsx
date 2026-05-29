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

const LAYER_MILESTONES = [1, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

type UpgradeType = 'tongue' | 'scraper' | 'grandma' | 'factory' | 'saliva' | 'quantum';
type PrestigeUpgradeType = 'cosmicTongue' | 'sugarRush';

interface VisualEffect { id: string; x: number; y: number; }
interface GoldenCandy { id: string; x: number; y: number; type: 'frenzy' | 'burst'; emoji: string; }

export function App() {
  // --- STATE SYSTEM ---
  const [count, setCount] = useState(0);
  const [totalLicks, setTotalLicks] = useState(0);
  const [lifetimeLicks, setLifetimeLicks] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [raddatz, setRaddatz] = useState(0);
  
  // UI Panels / VFX
  const [isLicking, setIsLicking] = useState(false);
  const [showPrestigeMenu, setShowPrestigeMenu] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<VisualEffect[]>([]);
  const [ripples, setRipples] = useState<VisualEffect[]>([]);
  const [goldenCandies, setGoldenCandies] = useState<GoldenCandy[]>([]);
  
  // Buffs & Multipliers
  const [multiplier, setMultiplier] = useState(1);
  const [frenzyActive, setFrenzyActive] = useState(false);

  // Shop Ownership States
  const [costs, setCosts] = useState<Record<UpgradeType, number>>({ 
    tongue: 15, scraper: 100, grandma: 500, factory: 3000, saliva: 12000, quantum: 85000 
  });
  const [owned, setOwned] = useState<Record<UpgradeType, number>>({
    tongue: 0, scraper: 0, grandma: 0, factory: 0, saliva: 0, quantum: 0
  });

  // Prestige Upgrades
  const [prestigeOwned, setPrestigeOwned] = useState<Record<PrestigeUpgradeType, number>>({
    cosmicTongue: 0, sugarRush: 0
  });

  const effectIdCounter = useRef(0);

  // --- CORE SYSTEM COMPUTATIONS ---
  const prestigeBonus = 1 + (raddatz * 0.02); // Each Raddatz currency owned boosts global MPS/MPC by +2%
  const baseLicksPerClick = 1 + owned.tongue * 1 + owned.scraper * 8;
  
  const cosmicTongueBonus = 1 + (prestigeOwned.cosmicTongue * 0.5); // +50% click power per level
  const licksPerClick = baseLicksPerClick * multiplier * prestigeBonus * cosmicTongueBonus;

  const baseLicksPerSecond = (owned.grandma * 4) + (owned.factory * 32) + (owned.saliva * 150) + (owned.quantum * 900);
  const sugarRushBonus = 1 + (prestigeOwned.sugarRush * 0.1); // +10% passive production per level
  const licksPerSecond = baseLicksPerSecond * multiplier * prestigeBonus * sugarRushBonus;

  const claimableRaddatz = lifetimeLicks >= 50000 ? Math.floor(Math.sqrt(lifetimeLicks / 50000)) : 0;

  // Passive game loop heartbeat ticking
  useEffect(() => {
    if (licksPerSecond <= 0) return;
    const timer = setInterval(() => {
      setCount(prev => prev + licksPerSecond / 10);
      setTotalLicks(prev => prev + licksPerSecond / 10);
      setLifetimeLicks(prev => prev + licksPerSecond / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [licksPerSecond]);

  // Spawn loop generator for interactive cookie clicker golden candy drops
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (Math.random() < 0.4) {
        effectIdCounter.current += 1;
        const types: Array<'frenzy' | 'burst'> = ['frenzy', 'burst'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const candyEmojis = ['⭐', '🍭', '✨', '🍪', '🍩'];
        
        const newCandy: GoldenCandy = {
          id: `candy-${Date.now()}-${effectIdCounter.current}`,
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          type: chosenType,
          emoji: candyEmojis[Math.floor(Math.random() * candyEmojis.length)]
        };
        
        setGoldenCandies(prev => [...prev, newCandy]);
        // Auto remove candy drops after 12 seconds if unclicked
        setTimeout(() => {
          setGoldenCandies(prev => prev.filter(c => c.id !== newCandy.id));
        }, 12000);
      }
    }, 25000);

    return () => clearInterval(spawnTimer);
  }, []);

  // --- ACTIONS ---
  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCount(prev => prev + licksPerClick);
    setTotalLicks(prev => prev + licksPerClick);
    setLifetimeLicks(prev => prev + licksPerClick);
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

  const clickGoldenCandy = (candy: GoldenCandy) => {
    setGoldenCandies(prev => prev.filter(c => c.id !== candy.id));
    
    if (candy.type === 'frenzy') {
      setMultiplier(77);
      setFrenzyActive(true);
      setTimeout(() => {
        setMultiplier(1);
        setFrenzyActive(false);
      }, 15000); // 77x multiplier lasts for 15 seconds
    } else {
      const instantReward = Math.max(770, licksPerSecond * 77);
      setCount(prev => prev + instantReward);
      setTotalLicks(prev => prev + instantReward);
      setLifetimeLicks(prev => prev + instantReward);
    }
  };

  const buyUpgrade = (type: UpgradeType) => {
    const cost = costs[type];
    if (count < cost) return;
    setCount(prev => prev - cost);
    setOwned(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setCosts(prev => ({ ...prev, [type]: Math.floor(prev[type] * 1.15) }));
  };

  const buyPrestigeUpgrade = (type: PrestigeUpgradeType, baseCost: number) => {
    const currentLevel = prestigeOwned[type];
    const cost = baseCost * Math.pow(2, currentLevel);
    if (raddatz < cost) return;
    setRaddatz(prev => prev - cost);
    setPrestigeOwned(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const executePrestigeReset = () => {
    if (claimableRaddatz <= 0) return;
    setRaddatz(prev => prev + claimableRaddatz);
    setCount(0);
    setTotalLicks(0);
    setOwned({ tongue: 0, scraper: 0, grandma: 0, factory: 0, saliva: 0, quantum: 0 });
    setCosts({ tongue: 15, scraper: 100, grandma: 500, factory: 3000, saliva: 12000, quantum: 85000 });
    setShowPrestigeMenu(false);
  };

  // --- DATA LAYERS ---
  const shopItems = [
    { id: 'tongue', name: 'Sandpaper Tongue', icon: '👅', benefit: '+1 / Click', cost: costs.tongue },
    { id: 'scraper', name: 'Diamond Scraper', icon: '💎', benefit: '+8 / Click', cost: costs.scraper },
    { id: 'grandma', name: 'Candy Grandma', icon: '👵', benefit: '+4 / Sec', cost: costs.grandma },
    { id: 'factory', name: 'Refinery Plant', icon: '🏭', benefit: '+32 / Sec', cost: costs.factory },
    { id: 'saliva', name: 'Radioactive Drool', icon: '🧪', benefit: '+150 / Sec', cost: costs.saliva },
    { id: 'quantum', name: 'Subatomic Dissolver', icon: '🌌', benefit: '+900 / Sec', cost: costs.quantum },
  ] as const;

  const tickerMessage = 
    frenzyActive ? "🔥 SUGAR FRENZY BLOWOUT ACTIVE! Lick at 77x velocity!" :
    totalLicks < 100 ? "🍬 Fresh jawbreaker arrived in the test chamber." :
    totalLicks < 1000 ? "👵 Local grandmas are volunteering to help lick." :
    totalLicks < 10000 ? "🦷 Dentists worldwide are signing a formal protest." :
    "💥 Critical mass achieved! The candy fabric is tearing apart!";

  return (
    <div className={`game-layout cc-cookie-sky-theme ${frenzyActive ? 'frenzy-panic' : ''}`}>
      {/* Dynamic Floating Candy Elements */}
      {goldenCandies.map(candy => (
        <button key={candy.id} className="golden-candy-drop" style={{ left: `${candy.x}%`, top: `${candy.y}%` }} onClick={() => clickGoldenCandy(candy)}>
          <span className="candy-emoji-graphic">{candy.emoji}</span>
          <span className="candy-glow-halo" />
        </button>
      ))}

      {/* LEFT PANEL */}
      <div className="panel left-panel">
        <div className="cookie-bakery-heading">
          <h2>JAWBREAKER CLICKER</h2>
          <p className="subheading">Survive the sour center!</p>
        </div>
        
        <div className="counter-section">
          <p className="licks">{Math.floor(count).toLocaleString()} 👅</p>
          <p className="stats-per-sec">per second: <span className="neon-cyan">{licksPerSecond.toLocaleString(undefined, {maximumFractionDigits: 1})}</span></p>
        </div>

        <div className="candy-wrapper">
          <div className="cc-cookie-blur-wheel" />
          <div className={`candy-container ${isLicking ? 'animate-lick' : ''}`} onClick={handleMainClick}>
            {STAGES.map((asset, idx) => {
              const requiredLicks = LAYER_MILESTONES[idx] || 0;
              const dissolved = totalLicks >= requiredLicks && idx !== STAGES.length - 1;
return <img key={idx} src={asset} className={candy-layer layer-${idx} ${dissolved ? 'dissolved' : ''}} alt="" />;}).reverse()}{ripples.map(r => (<span key={r.id} className="click-ripple" style={{ left: r.x, top: r.y }} onAnimationEnd={() => setRipples(p => p.filter(i => i.id !== r.id))} />))}{floatingTexts.map(t => (<span key={t.id} className="floating-text" style={{ left: t.x, top: t.y }} onAnimationEnd={() => setFloatingTexts(p => p.filter(i => i.id !== t.id))}>+{Math.floor(licksPerClick).toLocaleString()}))}<button className="prestige-panel-toggle-btn" onClick={() => setShowPrestigeMenu(!showPrestigeMenu)}>🌌 Cosmic Ascension Menu ({raddatz} Raddatz){/* MIDDLE PANEL */}{showPrestigeMenu ? (🌌 COSMIC PRESTIGEAscending resets your current licks, grandmas, and structural items, mutating them into Raddatz Candy Crystals. Each crystal grants a permanent +2% global speed multiplier.Total Lifetime Licks: {Math.floor(lifetimeLicks).toLocaleString()}Raddatz Crystals to Claim: 💎 {claimableRaddatz}<button className="execute-reset-prestige-action-btn" disabled={claimableRaddatz <= 0} onClick={executePrestigeReset}>{claimableRaddatz > 0 ? "Bake Reset and Mutate Matrix!" : "Requires 50,000+ Lifetime Licks"}💎 RADDATZ UPGRADE LABCosmic Sandpaper (Lv. {prestigeOwned.cosmicTongue})+50% Click Power per level<button className="buy-prestige-btn" disabled={raddatz < (1 * Math.pow(2, prestigeOwned.cosmicTongue))} onClick={() => buyPrestigeUpgrade('cosmicTongue', 1)}>💎 {1 * Math.pow(2, prestigeOwned.cosmicTongue)}Hyper-Sugar Rush (Lv. {prestigeOwned.sugarRush})+10% Passive Item Generation per level<button className="buy-prestige-btn" disabled={raddatz < (2 * Math.pow(2, prestigeOwned.sugarRush))} onClick={() => buyPrestigeUpgrade('sugarRush', 2)}>💎 {2 * Math.pow(2, prestigeOwned.sugarRush)}) : (<>📰 THE DAILY CRUNCH{tickerMessage}📊 RADAR STATISTICS🧬 Current Session Licks: {Math.floor(count).toLocaleString()}🌌 Global Lifetime Licks: {Math.floor(lifetimeLicks).toLocaleString()}⚡ Current Lick Power: +{Math.floor(licksPerClick).toLocaleString()}💎 Raddatz Boost: +{((prestigeBonus - 1) * 100).toFixed(0)}% Speed🖱️ Total Manual Clicks: {clicksCount}</>)}{/* RIGHT PANEL */}🛒 SWEET SHOP{shopItems.map(item => (<button key={item.id} className="store-item" onClick={() => buyUpgrade(item.id)} disabled={count < item.cost}>{item.icon}{item.name}💰 {item.cost.toLocaleString()}x{owned[item.id]}{item.benefit}))});}export default App;