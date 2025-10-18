import React, { useEffect, useState } from 'react';

export default function FloatingHearts({ isActive }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setHearts([]);
      return;
    }

    // Create initial floating hearts
    const createHearts = () => {
      const newHearts = [];
      for (let i = 0; i < 15; i++) { // Increased from 10 to 15
        newHearts.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: 100, // Start from bottom
          color: ['#ff6b9d', '#f8bbd9', '#ffb3ba'][Math.floor(Math.random() * 3)], // Softer colors
          size: Math.random() * 10 + 20, // Increased size
          delay: Math.random() * 1, // Reduced delay
          duration: 5 // Fixed 5 seconds duration to match CSS
        });
      }
      return newHearts;
    };

    // Initial hearts
    const initialHearts = createHearts();
    setHearts(initialHearts);

    // Create new hearts every 1.5 seconds for continuous effect
    const interval = setInterval(() => {
      setHearts(prev => {
        const newHearts = createHearts();
        // Keep all hearts and add new ones for continuous effect
        return [...prev, ...newHearts];
      });
    }, 1500);

    // Clean up old hearts every 6 seconds to prevent memory issues
    const cleanupInterval = setInterval(() => {
      setHearts(prev => {
        // Remove hearts older than 8 seconds (hearts animation is 5 seconds)
        const now = Date.now();
        const filtered = prev.filter(heart => now - heart.id < 8000);
        return filtered;
      });
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || hearts.length === 0) return null;

  return (
    <div className="floating-hearts">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            color: heart.color,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}
