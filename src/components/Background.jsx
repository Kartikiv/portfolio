import React, { useEffect, useRef } from 'react';
import './Background.css';

// Floating particle dots
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 15 + Math.random() * 20,
  opacity: 0.15 + Math.random() * 0.25,
}));

const Background = () => {
  return (
    <div className="animated-background">
      <div className="grid-overlay" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
