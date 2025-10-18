import React, { useEffect, useState } from 'react';

export default function FloatingStars({ isActive }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setStars([]);
      return;
    }

    // Create initial stars
    const createStars = () => {
      const newStars = [];
      for (let i = 0; i < 25; i++) {
        newStars.push({
          id: Date.now() + i + Math.random() * 1000, // Better unique ID
          x: Math.random() * 100,
          y: Math.random() * 10 + 100, // Start below screen (100-110vh - hidden)
          size: Math.random() * 15 + 10, // Size between 10-25px
          delay: Math.random() * 2,
          duration: Math.random() * 3 + 6, // Slower: 6-9 seconds
          rotation: Math.random() * 360,
          twinkle: Math.random() * 2 + 1 // Twinkle speed
        });
      }
      return newStars;
    };

    // Initial stars
    const initialStars = createStars();
    setStars(initialStars);

    // Create new stars every 1 second (faster spawn)
    const interval = setInterval(() => {
      setStars(prev => {
        const newStars = createStars();
        return [...prev, ...newStars];
      });
    }, 1000);

    // Clean up old stars
    const cleanupInterval = setInterval(() => {
      setStars(prev => {
        const now = Date.now();
        return prev.filter(star => now - star.id < 8000);
      });
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || stars.length === 0) return null;

  return (
    <div className="floating-stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}vh`,
            fontSize: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            '--rotation': `${star.rotation}deg`,
            '--twinkle-duration': `${star.twinkle}s`
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
}

