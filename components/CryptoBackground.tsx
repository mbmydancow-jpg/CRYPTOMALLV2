import React, { useMemo } from 'react';

const CryptoBackground: React.FC = () => {
  const particles = useMemo(() => {
    const particleArray = [];
    const particleCount = 50; // Number of particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.floor(Math.random() * 3) + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 20 + 10; // 10s to 30s
      particleArray.push({
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${Math.random() * animationDuration}s`,
        },
      });
    }
    return particleArray;
  }, []);

  return (
    <div className="crypto-background">
      {particles.map((p) => (
        <span key={p.id} className="particle" style={p.style}></span>
      ))}
    </div>
  );
};

export default CryptoBackground;
