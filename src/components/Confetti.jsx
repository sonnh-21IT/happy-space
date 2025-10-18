import React, { useEffect, useState } from 'react';

export default function Confetti({ isActive, duration = 3000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Create initial confetti particles
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 25; i++) { // Increased for better preview
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: -10,
          color: ['#ff1744', '#00e676', '#2196f3', '#4caf50', '#ffeb3b', '#e91e63', '#9c27b0', '#ff9800', '#795548', '#607d8b'][Math.floor(Math.random() * 10)],
          rotation: Math.random() * 360,
          size: Math.random() * 8 + 10, // Slightly smaller particles
          delay: Math.random() * 0.5, // Much faster delay
          shape: Math.random() > 0.5 ? 'circle' : 'square'
        });
      }
      return newParticles;
    };

    // Initial particles - create immediately
    const initialParticles = createParticles();
    setParticles(initialParticles);

    // Create new particles every 2 seconds for continuous effect (faster for preview)
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = createParticles();
        // Keep all particles and add new ones for continuous effect
        return [...prev, ...newParticles];
      });
    }, 2000); // Faster for preview

    // Clean up old particles every 6 seconds to prevent memory issues
    const cleanupInterval = setInterval(() => {
      setParticles(prev => {
        // Remove particles older than 8 seconds (animation is 7 seconds)
        const now = Date.now();
        return prev.filter(particle => now - particle.id < 8000);
      });
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`confetti ${particle.shape}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
}
