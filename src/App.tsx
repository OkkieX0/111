import { useState, useEffect } from 'react';
import './App.css';
import JB1 from './assets/JB1.png';
import JB_licked1 from './assets/JB stg.2.png';
import JB_licked2 from './assets/JB stg.3.png';
import JB_licked3 from './assets/JB stg.4.png';
import JB_licked4 from './assets/JB stg.5.png';
import JB_licked5 from './assets/JB Stg.6.png';

type UpgradeType = 'tongue' | 'scraper' | 'saliva';

function App() {
  const [count, setCount] = useState<number>(0);
  const [totalLicks, setTotalLicks] = useState<number>(0);
  const [licksPerClick, setLicksPerClick] = useState<number>(1);
  const [acidSalivaMulti, setAcidSalivaMulti] = useState<number>(1);
  const [autoLicksPerSecond, setAutoLicksPerSecond] = useState<number>(0);
  const [isLicking, setIsLicking] = useState<boolean>(false);
  
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

  const handleMainClick = () => {
    setCount((prev) => prev + licksPerClick);
    setTotalLicks((prev) => prev + licksPerClick);
    setIsLicking(true);
    setTimeout(() => setIsLicking(false), 100);
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
    <section id="main">
      <div className="jbm">
        <h1>THE JAW BREAKER</h1>
        
        {/* The Container holds all the overlapping layers */}
        <div 
          className={`candy-container ${isLicking ? 'animate-lick' : ''}`}
          onClick={handleMainClick}
        >
          {/* Inner Core (Always visible at the bottom of the stack) */}
          <img src={JB_licked5} className="candy-layer layer-5" alt="core" />
          
          {/* Outer Shells disappear in order as totalLicks increase */}
          <img src={JB_licked4} className={`candy-layer layer-4 ${totalLicks >= 15 ? 'dissolved' : ''}`} alt="stage 5" />
          <img src={JB_licked3} className={`candy-layer layer-3 ${totalLicks >= 12 ? 'dissolved' : ''}`} alt="stage 4" />
          <img src={JB_licked2} className={`candy-layer layer-2 ${totalLicks >= 9 ? 'dissolved' : ''}`} alt="stage 3" />
          <img src={JB_licked1} className={`candy-layer layer-1 ${totalLicks >= 6 ? 'dissolved' : ''}`} alt="stage 2" />
          <img src={JB1} className={`candy-layer layer-0 ${totalLicks >= 3 ? 'dissolved' : ''}`} alt="fresh jawbreaker" />
        </div>
        
        <p className="licks">Current Licks: {Math.floor(count)}</p>
        <p className="stats">Power: {licksPerClick} per click | Auto: {autoLicksPerSecond}/sec</p>
      </div> 

      <div className="upgrades">
        <h3>Upgrades</h3>
        <button onClick={() => buyUpgrade('tongue')} disabled={count < costs.tongue}>
          Rougher Tongue (+1) <br /> 
          Cost: {costs.tongue} 
        </button>
        
        <button onClick={() => buyUpgrade('scraper')} disabled={count < costs.scraper}>
          Metal Scraper (+5) <br /> 
          Cost: {costs.scraper} 
        </button>
        
        <button onClick={() => buyUpgrade('saliva')} disabled={count < costs.saliva}>
          Acidic Saliva (+{Math.floor(10 * acidSalivaMulti)}/sec) <br /> 
          Cost: {costs.saliva} 
        </button>
      </div>
    </section>
  );
}

export default App;
