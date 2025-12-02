import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  onFlip: () => void;
  dragOffset: { x: number; y: number };
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export const Flashcard: React.FC<CardProps> = ({ 
  card, 
  isFlipped, 
  onFlip, 
  dragOffset, 
  style, 
  className = '',
  disabled = false
}) => {
  // Calculate dynamic styles based on drag
  // If disabled (background card), we ignore dragOffset for rotation
  const x = disabled ? 0 : dragOffset.x;
  const y = disabled ? 0 : dragOffset.y;
  
  // Cap opacity at 0.3 (30%)
  const OPACITY_LIMIT = 0.3;
  const DISTANCE_THRESHOLD = 150; // Pixels to reach max opacity

  // Overlay opacity based on direction
  const rightOpacity = Math.min(OPACITY_LIMIT, Math.max(0, x) / DISTANCE_THRESHOLD); // Green/Easy
  const leftOpacity = Math.min(OPACITY_LIMIT, Math.max(0, -x) / DISTANCE_THRESHOLD); // Yellow/Good
  const upOpacity = Math.min(OPACITY_LIMIT, Math.max(0, -y) / DISTANCE_THRESHOLD); // Gray/Hard
  const downOpacity = Math.min(OPACITY_LIMIT, Math.max(0, y) / DISTANCE_THRESHOLD); // Red/Forgot

  return (
    <div 
      className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer perspective-1000 touch-none select-none ${className}`}
      onClick={!disabled ? onFlip : undefined}
      style={{
        transform: !disabled ? `translateX(${x}px) translateY(${y}px) rotateZ(${x * 0.1}deg)` : undefined,
        ...style
      }}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl backface-hidden flex flex-col items-center justify-center p-8 text-center border border-slate-100 overflow-hidden"
        >
            {/* Color Overlays for Swipe Feedback - Front */}
            <div className="absolute inset-0 bg-green-500 pointer-events-none z-10" style={{ opacity: rightOpacity }} />
            <div className="absolute inset-0 bg-yellow-500 pointer-events-none z-10" style={{ opacity: leftOpacity }} />
            <div className="absolute inset-0 bg-slate-500 pointer-events-none z-10" style={{ opacity: upOpacity }} />
            <div className="absolute inset-0 bg-red-500 pointer-events-none z-10" style={{ opacity: downOpacity }} />

            <div className="relative z-0">
                <span className="text-xs uppercase tracking-widest text-slate-400 mb-4 block">Soru • Ünite {card.unit}</span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug">{card.question}</h2>
            </div>
            {!disabled && (
              <div className="absolute bottom-4 text-slate-300 text-sm animate-pulse">
                  Çevirmek için dokun
              </div>
            )}
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-indigo-50 rounded-2xl shadow-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-center border border-indigo-100 overflow-hidden"
        >
          {/* Color Overlays for Swipe Feedback - Back */}
          <div className="absolute inset-0 bg-green-500 pointer-events-none z-10" style={{ opacity: rightOpacity }} />
          <div className="absolute inset-0 bg-yellow-500 pointer-events-none z-10" style={{ opacity: leftOpacity }} />
          <div className="absolute inset-0 bg-slate-500 pointer-events-none z-10" style={{ opacity: upOpacity }} />
          <div className="absolute inset-0 bg-red-500 pointer-events-none z-10" style={{ opacity: downOpacity }} />

          <div className="relative z-0">
            <span className="text-xs uppercase tracking-widest text-indigo-400 mb-4 block">Cevap</span>
            <p className="text-xl text-indigo-900 leading-relaxed">{card.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};