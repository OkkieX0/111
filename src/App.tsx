import { useState, useEffect } from 'react';
import './App.css';
import JB1 from './assets/JB1.png';
import JB_licked1 from './assets/JB stg.2.png';
import JB_licked2 from './assets/JB stg.3.png';   
import JB_licked3 from './assets/JB stg.4.png';   
import JB_licked4 from './assets/JB stg.5.png';   
import JB_licked5 from './assets/JB Stg.6.png';   

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

  const getJawbreakerImage = () => {
    if (totalLicks >= 1000000) return JB_licked5, JB_licked4, JB_licked3, JB_licked2, JB_licked1;
    if (totalLicks >= 100000) return JB_licked4, JB_licked3, JB_licked2, JB_licked1;
    if (totalLicks >= 10000) return JB_licked3, JB_licked2, JB_licked1;
    if (totalLicks >= 1000) return JB_licked2, JB_licked1;
    if (totalLicks >= 100) return JB_licked1;
    return JB1;
  };

  const handleMainClick = () => {
    setCount((prev) => prev + licksPerClick);
    setTotalLicks((prev) => prev + licksPerClick);
    setIsLicking(true);
    setTimeout(() => setIsLicking(false), 100);
  };

  const buyUpgrade = (type: 'tongue' | 'scraper' | 'saliva') => {
    const cost = costs[type];
    if (count >= cost) {
      setCount((prev) => prev - cost);
      
      if (type === 'tongue') {
        setLicksPerClick((prev) => prev + 1);
      } else if (type === 'scraper') {
        setLicksPerClick((prev) => prev + 5);
      } else if (type === 'saliva') {
        setAutoLicksPerSecond((prev) => prev + (10 * acidSalivaMulti));
      }

      setCosts(prev => ({
        ...prev,
        [type]: Math.floor(prev[type] * 1.5)
      }));
    }
  };

  return (
    <section id="main">
      <div className="jbm">
        <h1>THE JAW BREAKER</h1>
        <img 
          src={getJawbreakerImage()} 
          className={`candy ${isLicking ? 'animate-lick' : ''}`} 
          alt="jawbreaker" 
          onClick={handleMainClick} 
          style={{ cursor: 'pointer', width: '200px' }} 
        />
        <p className="licks">Current Licks: {Math.floor(count)}</p>
        <p>Power: {licksPerClick} per click | Auto: {autoLicksPerSecond}/sec</p>
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

        <button 
          onClick={() => {
            buyUpgrade('saliva'); setAcidSalivaMulti(prev => prev + 0.5);
          }} 
          disabled={count < costs.saliva}
        >
          Acidic Saliva (+{10 * acidSalivaMulti}/sec) <br /> 
          Cost: {costs.saliva}
        </button>
      </div>
    </section>
  );
}

export default App;