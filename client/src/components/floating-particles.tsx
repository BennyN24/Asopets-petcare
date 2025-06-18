import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface FloatingParticlesProps {
  show: boolean;
}

export default function FloatingParticles({ show }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 80,
        y: 50 + (Math.random() - 0.5) * 80,
      }));
      setParticles(newParticles);
      
      // Clear particles after animation
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  );
}