import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Rating } from '../types';
import { Flashcard } from '../components/Card';
import { X } from 'lucide-react';
import { scheduleCard } from '../fsrs';
import { StorageService } from '../services/storage';

interface StudySessionProps {
  cards: Card[];
  onComplete: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ cards, onComplete }) => {
  const [queue, setQueue] = useState<Card[]>(cards);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Lock interaction during animation
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Determine active and next cards
  const currentCard = queue[0];
  const nextCard = queue[1];

  // Sound Effect Logic
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'swipe' | 'success' | 'fail' | 'neutral') => {
      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'success') {
          // High pitch "ding"
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
      } else if (type === 'fail') {
          // Low pitch "thud"
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
      } else if (type === 'neutral') {
          // Mid pitch
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
      } else if (type === 'swipe') {
          // Whoosh noise (simulated with low freq sine slide)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.linearRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      }
  };

  useEffect(() => {
    if (queue.length === 0) {
      onComplete();
    }
  }, [queue, onComplete]);

  const handleRating = useCallback((rating: Rating) => {
    if (!currentCard) return;

    // Play Sound based on rating
    if (rating === Rating.Easy) playSound('success');
    else if (rating === Rating.Again) playSound('fail');
    else playSound('neutral');

    // Apply FSRS algorithm
    const updatedCard = scheduleCard(currentCard, rating);
    
    // Log Review
    StorageService.logReview({
        id: crypto.randomUUID(),
        cardId: updatedCard.id,
        rating,
        state: currentCard.state,
        due: updatedCard.due,
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsed_days: updatedCard.elapsed_days,
        last_elapsed_days: updatedCard.elapsed_days,
        scheduled_days: updatedCard.scheduled_days,
        review: Date.now()
    });

    // Save Card
    StorageService.updateCard(updatedCard);

    // Reset UI state for next card *before* the queue updates to prevent flash
    setIsFlipped(false);
    setDragOffset({ x: 0, y: 0 });
    setIsProcessing(false); // Unlock input

    // Update Queue
    // We remove the current card and optionally re-add it if needed
    let newQueue = queue.slice(1);
    
    if (rating === Rating.Again || updatedCard.scheduled_days === 0) {
        // Re-insert at end or some position
        newQueue = [...newQueue, updatedCard];
    }
    
    setQueue(newQueue);

  }, [currentCard, queue]);

  // Touch/Mouse Handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isProcessing) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isProcessing) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragOffset({
      x: clientX - startPos.x,
      y: clientY - startPos.y,
    });
  };

  const handleEnd = () => {
    if (isProcessing) return;
    setIsDragging(false);
    
    const threshold = 100;
    const screenWidth = window.innerWidth;
    
    let rating: Rating | null = null;
    let endX = 0;
    let endY = 0;

    // Determine swipe direction and destination
    if (dragOffset.x > threshold) {
      rating = Rating.Easy; // Right
      endX = screenWidth + 200; // Fly off screen right
    } else if (dragOffset.x < -threshold) {
      rating = Rating.Good; // Left
      endX = -(screenWidth + 200); // Fly off screen left
    } else if (dragOffset.y < -threshold) {
      rating = Rating.Hard; // Up
      endY = -(screenWidth + 200); // Fly off screen up
    } else if (dragOffset.y > threshold) {
      rating = Rating.Again; // Down
      endY = screenWidth + 200; // Fly off screen down
    }

    if (rating) {
        // 1. Lock interaction
        setIsProcessing(true);
        playSound('swipe');
        // 2. Animate card off screen (CSS transition will handle the movement)
        setDragOffset({ x: endX, y: endY });
        
        // 3. Wait for animation to finish, then process logic
        setTimeout(() => {
            handleRating(rating as Rating);
        }, 300); // Matches CSS duration + buffer
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (!currentCard) return <div className="flex items-center justify-center h-full font-bold text-slate-500">Bitti!</div>;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4">
        <button onClick={onComplete} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <X size={24} className="text-slate-600"/>
        </button>
        <div className="text-sm font-bold text-slate-500">
            {queue.length} Kaldı
        </div>
        <div className="w-8"></div>
      </div>

      {/* Card Area */}
      <div 
        className="flex-1 flex items-center justify-center p-6 overflow-hidden relative"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div className="relative w-full max-w-sm aspect-[3/4]">
            
            {/* Background Card (Next in queue) - Render first so it's behind */}
            {nextCard && (
                <div className="absolute inset-0 z-0">
                    <Flashcard
                        key={nextCard.id} // Important: Key ensures it's a distinct instance
                        card={nextCard}
                        isFlipped={false} // Always start face down
                        onFlip={() => {}}
                        dragOffset={{ x: 0, y: 0 }}
                        className="transition-all duration-300 ease-in-out transform scale-95 translate-y-4 opacity-60 pointer-events-none"
                        disabled={true}
                    />
                </div>
            )}

            {/* Foreground Card (Active) */}
            <div className="absolute inset-0 z-10">
                <Flashcard 
                    key={currentCard.id}
                    card={currentCard} 
                    isFlipped={isFlipped} 
                    onFlip={() => !isDragging && !isProcessing && setIsFlipped(!isFlipped)} 
                    dragOffset={dragOffset}
                    // When dragging, remove transition for instant follow. When released/animating out, add transition.
                    className={isDragging ? 'cursor-grabbing' : 'transition-all duration-300 ease-out cursor-grab'}
                    style={{ zIndex: 10 }}
                />
            </div>
        </div>
        
        {/* Swipe Hint Overlay */}
        {isDragging && (
           <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-10 opacity-30 z-20">
               <div className="text-center font-bold text-slate-500 uppercase tracking-widest">Zor</div>
               <div className="flex justify-between font-bold text-slate-500 uppercase tracking-widest">
                   <span>İyi</span>
                   <span>Kolay</span>
               </div>
               <div className="text-center font-bold text-red-500 uppercase tracking-widest">Tekrar</div>
           </div> 
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-white border-t border-slate-200 pb-8 min-h-[120px]">
        {!isFlipped ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                {/* No button, just hint text if needed, or empty */}
            </div>
        ) : (
            <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                     <button onClick={() => !isProcessing && handleRating(Rating.Again)} className="p-3 rounded-xl bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors border border-red-100">
                        Tekrar
                     </button>
                     <span className="text-xs text-center text-slate-400">1dk</span>
                </div>
                <div className="flex flex-col gap-1">
                     <button onClick={() => !isProcessing && handleRating(Rating.Hard)} className="p-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors border border-slate-200">
                        Zor
                     </button>
                     <span className="text-xs text-center text-slate-400">2g</span>
                </div>
                <div className="flex flex-col gap-1">
                     <button onClick={() => !isProcessing && handleRating(Rating.Good)} className="p-3 rounded-xl bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition-colors border border-amber-100">
                        İyi
                     </button>
                     <span className="text-xs text-center text-slate-400">4g</span>
                </div>
                <div className="flex flex-col gap-1">
                     <button onClick={() => !isProcessing && handleRating(Rating.Easy)} className="p-3 rounded-xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-colors border border-green-100">
                        Kolay
                     </button>
                     <span className="text-xs text-center text-slate-400">7g</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};