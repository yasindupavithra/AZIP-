'use client';

import React, { useRef, useState, useCallback } from 'react';

interface AntiGravityCardProps {
  children: React.ReactNode;
  className?: string;
  levitate?: boolean;
  intensity?: number;
  glowOnHover?: boolean;
}

export default function AntiGravityCard({
  children,
  className = '',
  levitate = false,
  intensity = 10,
  glowOnHover = true,
}: AntiGravityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles: inverted Y for natural tilt
      const rotateX = ((centerY - y) / centerY) * intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      setRotation({ x: rotateX, y: rotateY });

      // Calculate shine position
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      setShine({ x: shineX, y: shineY, opacity: 0.35 });
    },
    [intensity]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setShine({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 ${className} ${
        levitate && !isHovered ? 'antigravity-levitate' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out transform-style-3d relative rounded-none"
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x.toFixed(2)}deg) rotateY(${rotation.y.toFixed(2)}deg) translateZ(12px) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          boxShadow:
            isHovered && glowOnHover
              ? '0 0 25px rgba(0, 196, 216, 0.4), 0 15px 35px rgba(0, 196, 216, 0.2)'
              : undefined,
          borderColor: isHovered && glowOnHover ? '#00C4D8' : undefined,
        }}
      >
        {/* Specular Holographic Glare Sheen Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-none overflow-hidden"
          style={{
            opacity: shine.opacity,
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(0, 229, 255, 0.45) 0%, rgba(255, 255, 255, 0.2) 25%, transparent 65%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Card Content with 3D Pop Out */}
        <div className="w-full h-full transform-style-3d">{children}</div>
      </div>
    </div>
  );
}
