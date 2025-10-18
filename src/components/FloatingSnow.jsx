import React, { useEffect, useState } from 'react';

export default function FloatingSnow({ isActive }) {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setSnowflakes([]);
      return;
    }

    // Create initial snowflakes
    const createSnowflakes = () => {
      const newSnowflakes = [];
      for (let i = 0; i < 30; i++) { // 30 snowflakes for good coverage
        newSnowflakes.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: -10, // Start from top
          size: Math.random() * 8 + 8, // Size between 8-16px
          delay: Math.random() * 0.5,
          duration: Math.random() * 3 + 5, // Duration between 5-8 seconds
          opacity: Math.random() * 0.6 + 0.4, // Opacity between 0.4-1
          drift: Math.random() * 50 - 25 // Horizontal drift -25 to 25
        });
      }
      return newSnowflakes;
    };

    // Initial snowflakes
    const initialSnowflakes = createSnowflakes();
    setSnowflakes(initialSnowflakes);

    // Create new snowflakes every 1.5 seconds for continuous effect
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const newSnowflakes = createSnowflakes();
        // Keep all snowflakes and add new ones for continuous effect
        return [...prev, ...newSnowflakes];
      });
    }, 1500);

    // Clean up old snowflakes every 6 seconds to prevent memory issues
    const cleanupInterval = setInterval(() => {
      setSnowflakes(prev => {
        // Remove snowflakes older than 10 seconds
        const now = Date.now();
        const filtered = prev.filter(snowflake => now - snowflake.id < 10000);
        return filtered;
      });
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || snowflakes.length === 0) return null;

  return (
    <div className="floating-snow">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake"
          style={{
            left: `${snowflake.x}%`,
            top: `${snowflake.y}%`,
            fontSize: `${snowflake.size}px`,
            animationDelay: `${snowflake.delay}s`,
            animationDuration: `${snowflake.duration}s`,
            opacity: snowflake.opacity,
            '--drift': `${snowflake.drift}px`
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

