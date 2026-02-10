import { Question } from '../types';
import { calculateSelectionWeight } from './mastery';

/**
 * Selects questions using weighted random selection based on mastery scores
 * Questions with lower mastery have higher probability of being selected
 * 
 * SOURCE: All questions come from entrepreneurship_1.json via App.tsx
 * This function only selects a subset based on mastery scores (adaptive learning)
 * 
 * @param questions Array of all available questions (from entrepreneurship_1.json)
 * @param count Number of questions to select
 * @returns Array of selected questions
 */
export function selectQuestions(questions: Question[], count: number): Question[] {
  if (count >= questions.length) {
    console.log(`📊 Returning all ${questions.length} questions (requested: ${count})`);
    return [...questions]; // Return all questions if requested count >= total
  }
  
  console.log(`🎲 Selecting ${count} questions from ${questions.length} available using weighted selection`);
  
  const selected: Question[] = [];
  const available = [...questions];
  
  while (selected.length < count && available.length > 0) {
    // Calculate weights for all available questions
    // Lower mastery = higher weight = more likely to be selected
    const weights = available.map(q => calculateSelectionWeight(q.mastery));
    
    // Calculate total weight
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    // Select a random value between 0 and totalWeight
    let random = Math.random() * totalWeight;
    
    // Find which question this random value corresponds to
    for (let i = 0; i < available.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const selectedQ = available[i];
        console.log(`  ✓ Selected: ${selectedQ.id} (mastery: ${selectedQ.mastery}, difficulty: ${selectedQ.difficulty})`);
        selected.push(selectedQ);
        available.splice(i, 1);
        break;
      }
    }
  }
  
  return selected;
}

/**
 * Shuffles the order of questions using Fisher-Yates algorithm
 * @param questions Array of questions to shuffle
 * @returns Shuffled array
 */
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
