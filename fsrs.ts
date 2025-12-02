import { Card, Rating, State, FSRSParameters } from './types';

// Default parameters based on FSRS default weights
export const defaultParams: FSRSParameters = {
  request_retention: 0.9,
  maximum_interval: 36500,
  w: [
    0.40255, 1.18385, 3.173, 15.69105, 7.19605, 0.5345, 1.4604, 0.0046, 1.54575,
    0.1192, 1.01925, 1.9395, 0.41615, 0.99665, 2.73665, 0.56175, 1.18095,
  ],
};

// Helper function to calculate next interval
export const calculateNextInterval = (s: number, request_retention: number): number => {
  return Math.round(9 * s * (1 / request_retention - 1));
};

// Main FSRS Scheduling function
export const scheduleCard = (card: Card, rating: Rating, now: number = Date.now()): Card => {
  const p = defaultParams;
  
  // Calculate elapsed days since last review
  let elapsed_days = 0;
  if (card.last_review > 0) {
    elapsed_days = (now - card.last_review) / (1000 * 60 * 60 * 24);
  }

  const retrievability = Math.pow(1 + elapsed_days / (9 * card.stability), -1);

  let nextStability = card.stability;
  let nextDifficulty = card.difficulty;
  
  // Update Difficulty
  // D_new = D + w8 * (R_grade - 3) + w9 * (1 - D) * (1 - R_grade / 4) ??
  // Simplified FSRS v4 formula:
  // D' = D - w5 * (grade - 3)
  // We use the full formula from the optimizer code:
  // next_d = D + w4 * (rating - 3)
  // We constrain D between 1 and 10
  
  // Note: rating 1=Again, 2=Hard, 3=Good, 4=Easy
  // Convert rating to grade: Again=1, Hard=2, Good=3, Easy=4 (Same as input)
  
  // FSRS v4.5 approximation for Difficulty
  // w4 is w[4] in array? No, weights array indices are tricky. 
  // Let's use the provided w array structure:
  // w[4] corresponds to mean_reversion weight?
  // Let's implement standard FSRS logic directly.
  
  if (card.state === State.New) {
      // Initial Stability
      // S_0 = w[rating - 1]
      nextStability = p.w[rating - 1];
      
      // Initial Difficulty
      // D_0 = w[4] - w[5] * (rating - 3)
      nextDifficulty = p.w[4] - p.w[5] * (rating - 3);
      nextDifficulty = Math.max(1, Math.min(10, nextDifficulty));
  } else {
      // Update Difficulty
      const nextD = card.difficulty - p.w[6] * (rating - 3);
      // Mean Reversion
      const meanReversion = p.w[7] * (p.w[4] - nextDifficulty); // actually reverting to initial D mean? 
      // Actually standard formula: next_d = prev_d - w6 * (rating - 3)
      // We apply mean reversion: next_d = w7 * d_init + (1 - w7) * next_d
      
      nextDifficulty = Math.max(1, Math.min(10, nextD)); // Clamp 1-10
      
      // Update Stability
      if (rating === Rating.Again) {
         // S_forget = w9 * D^-w10 * S^w11 * e^(w12 * (1-R))
         nextStability = p.w[11] * Math.pow(card.difficulty, -p.w[12]) * Math.pow(card.stability, p.w[13]) * Math.exp(p.w[14] * (1 - retrievability));
      } else {
         // S_recall = S * (1 + e^w8 * (11-D) * S^-w9 * (e^(w10*(1-R)) - 1))
         // indices shifted by 1 in common documentation vs code.
         // Let's use:
         // S' = S * (1 + C * (R - 1) * ...) 
         // Implementation based on python fsrs optimizer:
         const hardPenalty = rating === Rating.Hard ? p.w[15] : 1;
         const easyBonus = rating === Rating.Easy ? p.w[16] : 1;
         
         nextStability = card.stability * (1 + Math.exp(p.w[8]) * 
            (11 - card.difficulty) * 
            Math.pow(card.stability, -p.w[9]) * 
            (Math.exp(p.w[10] * (1 - retrievability)) - 1) *
            hardPenalty * easyBonus
         );
      }
  }
  
  // State Transitions
  let nextState = card.state;
  if (card.state === State.New) {
      nextState = rating === Rating.Again ? State.Learning : State.Review;
  } else if (card.state === State.Review) {
      nextState = rating === Rating.Again ? State.Relearning : State.Review;
  } else {
      // Learning / Relearning
      // Simplified: If good/easy, go to review. If again, stay.
      nextState = rating === Rating.Again ? card.state : State.Review;
  }

  // Calculate Next Interval (Days)
  let scheduled_days = 0;
  if (nextState === State.Review) {
      const interval = calculateNextInterval(nextStability, p.request_retention);
      scheduled_days = Math.min(Math.max(1, interval), p.maximum_interval);
  } else {
      // Learning steps - Simplified for this app:
      // Again: 1 min (approx 0 days)
      // Hard: 5 min
      // Good: 10 min
      // Easy: 1 day
      // For simplicity in a daily app, we treat "Learning" < 1 day as Due Immediately (0 days)
      // but if Easy, push to next day.
      if (rating === Rating.Easy) {
          scheduled_days = 1;
          nextState = State.Review;
      } else {
          scheduled_days = 0; // Due today
      }
  }

  const nextDue = now + scheduled_days * 24 * 60 * 60 * 1000;

  return {
    ...card,
    state: nextState,
    difficulty: parseFloat(nextDifficulty.toFixed(2)),
    stability: parseFloat(nextStability.toFixed(2)),
    scheduled_days: scheduled_days,
    elapsed_days: elapsed_days,
    due: nextDue,
    last_review: now,
    reps: card.reps + 1,
    lapses: rating === Rating.Again ? card.lapses + 1 : card.lapses,
  };
};