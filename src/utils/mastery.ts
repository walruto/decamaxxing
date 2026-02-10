
/**
 * Mastery calculation constants
 */
const MASTERY_INCREMENT = 10; // Points gained for correct answer
const MASTERY_DECREMENT = 15; // Points lost for incorrect answer
const MIN_MASTERY = 0;
const MAX_MASTERY = 100;
const MASTERY_THRESHOLD_HIGH = 80; // Questions above this rarely appear
const MASTERY_THRESHOLD_MASTERED = 90; // Considered "mastered"

/**
 * Updates mastery score after answering a question
 * @param currentMastery Current mastery score (0-100)
 * @param isCorrect Whether the answer was correct
 * @returns New mastery score (clamped between 0-100)
 */
export function updateMastery(currentMastery: number, isCorrect: boolean): number {
  let newMastery: number;
  
  if (isCorrect) {
    newMastery = currentMastery + MASTERY_INCREMENT;
  } else {
    newMastery = currentMastery - MASTERY_DECREMENT;
  }
  
  // Clamp between 0 and 100
  return Math.max(MIN_MASTERY, Math.min(MAX_MASTERY, newMastery));
}

/**
 * Calculates selection weight for a question based on mastery
 * Lower mastery = higher weight (appears more often)
 * Higher mastery = lower weight (appears less often)
 * @param mastery Mastery score (0-100)
 * @returns Weight for selection algorithm
 */
export function calculateSelectionWeight(mastery: number): number {
  // Invert mastery: low mastery (e.g., 20) should have high weight (e.g., 80)
  // High mastery (e.g., 90) should have low weight (e.g., 10)
  const inverted = MAX_MASTERY - mastery;
  
  // Apply exponential scaling to make the difference more pronounced
  // Questions with mastery < 50 get significantly higher weights
  if (mastery < 50) {
    return Math.pow(inverted / 50, 1.5) * 100;
  }
  
  // Questions with mastery >= 50 get lower weights
  // Very mastered questions (>= 90) get minimal weight
  if (mastery >= MASTERY_THRESHOLD_MASTERED) {
    return 5; // Very low chance of appearing
  }
  
  if (mastery >= MASTERY_THRESHOLD_HIGH) {
    return 10; // Low chance of appearing
  }
  
  // For mastery 50-80, use a linear scale
  return inverted;
}

/**
 * Checks if a question is considered "mastered"
 * @param mastery Mastery score
 * @returns True if mastered
 */
export function isMastered(mastery: number): boolean {
  return mastery >= MASTERY_THRESHOLD_MASTERED;
}

/**
 * Checks if a question is considered "high mastery"
 * @param mastery Mastery score
 * @returns True if high mastery
 */
export function isHighMastery(mastery: number): boolean {
  return mastery >= MASTERY_THRESHOLD_HIGH;
}
