import React, { useEffect, useState } from 'react';

export default function FloatingBubbles({ isActive }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setBubbles([]);
      return;
    }

    // Create a single bubble at random position
    const createBubble = () => {
      return {
        id: Date.now() + Math.random() * 10000,
        x: Math.random() * 90 + 5, // 5-95% to avoid edges
        y: Math.random() * 90 + 5, // 5-95% to avoid edges
        size: Math.random() * 60 + 30, // Initial size 30-90px
        maxSize: Math.random() * 100 + 80, // Max size 80-180px
        duration: Math.random() * 2 + 2, // 2-4 seconds
        delay: 0
      };
    };

    // Create initial bubbles
    const initialBubbles = [];
    for (let i = 0; i < 15; i++) {
      const bubble = createBubble();
      bubble.delay = Math.random() * 2; // Stagger initial bubbles
      initialBubbles.push(bubble);
    }
    setBubbles(initialBubbles);

    // Create 2-3 new bubbles every 300ms
    const interval = setInterval(() => {
      const newBubbles = [];
      const count = Math.floor(Math.random() * 2) + 2; // 2-3 bubbles
      for (let i = 0; i < count; i++) {
        newBubbles.push(createBubble());
      }
      setBubbles(prev => [...prev, ...newBubbles]);
    }, 300);

    // Clean up old bubbles
    const cleanupInterval = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        return prev.filter(bubble => now - bubble.id < 5000);
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || bubbles.length === 0) return null;

  return (
    <div className="floating-bubbles">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `bubble-pop ${bubble.duration}s ease-out ${bubble.delay}s forwards`,
            '--max-size': `${bubble.maxSize}px`
          }}
        />
      ))}
    </div>
  );
}

