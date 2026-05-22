import { useState, useEffect } from "react";
import "./App.css";
import JB1 from "./assets/JB1.png";
import JB_licked1 from "./assets/JB stg.2.png";
import JB_licked2 from "./assets/JB stg.3.png";
import JB_licked3 from "./assets/JB stg.4.png";
import JB_licked4 from "./assets/JB stg.5.png";
import JB_licked5 from "./assets/JB Stg.6.png";
import acid_ring from "./assets/JB1.png"; 

type UpgradeType = "tongue" | "scraper" | "saliva";

function App() {
  const [count, setCount] = useState<number>(0);
  const [totalLicks, setTotalLicks] = useState<number>(0);
  const [licksPerClick, setLicksPerClick] = useState<number>(1);
  const [acidSalivaMulti, setAcidSalivaMulti] = useState<number>(1);
  const [autoLicksPerSecond, setAutoLicksPerSecond] = useState<number>(0);
  const [isLicking, setIsLicking] = useState<boolean>(false);
  const [hasAcidRing, setHasAcidRing] = useState<boolean>(false);
  const [costs, setCosts] = useState({ tongue: 10, scraper: 50, saliva: 100 });

  useEffect(() => {
    if (autoLicksPerSecond === 0) return;
    
    const interval = setInterval(() => {
      setCount((prev) => prev + autoLicksPerSecond);
      setTotalLicks((prev) => prev + autoLicksPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoLicksPerSecond]);

  const getJawbreakerImage = () => {
    if (totalLicks >= 1001) return  JB_licked5;
    if (totalLicks >= 1000) return JB_licked4;
    if (totalLicks >= 100) return JB_licked3 ;
    if (totalLicks >= 10) return JB_licked2;
    if (totalLicks >= 1) return JB_licked1;
    return JB1;
  };

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
      
      if (type === "tongue") {
        setLicksPerClick((prev) => prev + 1);
      } else if (type === "scraper") {
        setLicksPerClick((prev) => prev + 5);
      } else if (type === "saliva") {
        setAutoLicksPerSecond((prev) => prev + Math.floor(10 * acidSalivaMulti));
        setHasAcidRing(true);
        setAcidSalivaMulti((prev) => prev + 0.5);
      }
      
      setCosts((prev) => ({
        ...prev,
        [type]: Math.floor(prev[type] * 1.5)
      }));
    }
  };

  return (
    <div className="App">
      <h1>Jawbreaker Clicker</h1>
      
      <div className="game-body">
        <div className="jbm">
          <div className="licks">Licks: {count}</div>
          
          <div 
            className={`jb-container ${isLicking ? "animate-lick" : ""}`} 
            onClick={handleMainClick}
          >
            <img 
              src={getJawbreakerImage()} 
              alt="Jawbreaker" 
              className="candy" 
            />
            {hasAcidRing && (
              <img 
                src={acid_ring} 
                alt="Acid Ring Aura" 
                className="acid-ring" 
              />
            )}
          </div>
        </div>
        <div className="upgrades">
          <h2>Shop Menu</h2>
          
          <button 
            onClick={() => buyUpgrade("tongue")} 
            disabled={count < costs.tongue}
            className="shop-btn"
          >
            Upgrade Tongue (+1) <span className="cost">{costs.tongue} Licks</span>
          </button>

          <button 
            onClick={() => buyUpgrade("scraper")} 
            disabled={count < costs.scraper}
            className="shop-btn"
          >
            Buy Scraper (+5) <span className="cost">{costs.scraper} Licks</span>
          </button>

          <button 
            onClick={() => buyUpgrade("saliva")} 
            disabled={count < costs.saliva}
            className="shop-btn special"
          >
            Acid Saliva (Auto) <span className="cost">{costs.saliva} Licks</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
