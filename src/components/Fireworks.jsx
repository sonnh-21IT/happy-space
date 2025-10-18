import React, { useEffect, useState } from 'react';

export default function Fireworks({ isActive }) {
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setFireworks([]);
      return;
    }

    const createFirework = () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8'];
      const x = Math.random() * 80 + 10; // 10-90% from left
      const y = Math.random() * 60 + 15; // 15-75% from top
      const color = colors[Math.floor(Math.random() * colors.length)];
      const id = Date.now() + Math.random();
      
      // Create particles for explosion - compact size
      const particles = [];
      for (let i = 0; i < 35; i++) { // Reduced from 50 to 35 for smaller burst
        const angle = (Math.PI * 2 * i) / 35;
        particles.push({
          id: `${id}-${i}`,
          x,
          y,
          color,
          angle,
          distance: Math.random() * 70 + 40 // Smaller radius: 40-110px
        });
      }
      
      return {
        id,
        particles,
        createdAt: Date.now()
      };
    };

    // Create initial burst - 4 fireworks at once!
    const initialBurst = [];
    for (let i = 0; i < 4; i++) {
      initialBurst.push(createFirework());
    }
    setFireworks(initialBurst);

    // Create bursts of fireworks every 600ms (very fast!)
    const interval = setInterval(() => {
      // Create 3-4 fireworks at once for spectacular effect
      const burstSize = Math.floor(Math.random() * 2) + 3; // Random 3 or 4
      const newBurst = [];
      for (let i = 0; i < burstSize; i++) {
        newBurst.push(createFirework());
      }
      setFireworks(prev => [...prev, ...newBurst]);
    }, 600); // Very fast - every 600ms

    // Clean up old fireworks
    const cleanupInterval = setInterval(() => {
      setFireworks(prev => {
        const now = Date.now();
        return prev.filter(fw => now - fw.createdAt < 3000);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || fireworks.length === 0) return null;

  return (
    <div className="fireworks-container">
      {fireworks.map((firework) => (
        <div key={firework.id} className="firework">
          {firework.particles.map((particle) => (
            <div
              key={particle.id}
              className="firework-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                '--angle': `${particle.angle}rad`,
                '--distance': `${particle.distance}px`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

