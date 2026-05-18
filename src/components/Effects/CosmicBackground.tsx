import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface CosmicBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export default function CosmicBackground({ intensity = 'high' }: CosmicBackgroundProps) {
  const stars = useMemo(() => {
    const count = intensity === 'high' ? 100 : intensity === 'medium' ? 60 : 30;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      maxOpacity: Math.random() * 0.7 + 0.3,
    }));
  }, [intensity]);

  const particles = useMemo(() => {
    const count = intensity === 'high' ? 6 : intensity === 'medium' ? 4 : 2;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 400 + 200,
      color: i % 2 === 0 ? 'rgba(79, 70, 229, 0.05)' : 'rgba(147, 51, 234, 0.05)',
      duration: Math.random() * 20 + 10,
    }));
  }, [intensity]);

  return (
    <div className="fixed inset-0 bg-main-bg overflow-hidden pointer-events-none z-0">
      {/* Nebula base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-black to-purple-950/20" />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            '--max-opacity': star.maxOpacity,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating Nebula Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute blur-[100px] rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
          }}
        />
      ))}

      {/* Grid overlay for tech look */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
