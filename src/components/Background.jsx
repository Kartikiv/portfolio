import React from 'react';
import './Background.css';

const Background = () => {
  return (
    <div className="animated-background">
      <div className="grid-overlay" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
    </div>
  );
};

export default Background;
