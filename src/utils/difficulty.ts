import { Question } from '../types';
import { StarterDifficulty } from '../components/DifficultySelector';

/**
 * Adjusts initial mastery scores based on starter difficulty and question difficulty
 * This makes the adaptive learning system start at an appropriate level
 */
export function applyStarterDifficulty(
  questions: Question[],
  starterDifficulty: StarterDifficulty
): Question[] {
  return questions.map(question => {
    let adjustedMastery = question.mastery;

    // Adjust mastery based on starter difficulty
    // Beginner: Start with higher mastery on easy questions, lower on hard
    // Intermediate: Balanced mastery across all difficulties
    // Advanced: Lower mastery to challenge from the start

    switch (starterDifficulty) {
      case 'beginner':
        if (question.difficulty === 'easy') {
          // Easy questions start with higher mastery (60-70)
          adjustedMastery = Math.max(question.mastery, 60);
        } else if (question.difficulty === 'medium') {
          // Medium questions start at default or slightly lower (45-55)
          adjustedMastery = Math.max(question.mastery - 5, 45);
        } else {
          // Hard questions start lower (30-40)
          adjustedMastery = Math.min(question.mastery, 40);
        }
        break;

      case 'intermediate':
        // Balanced: slight adjustments based on difficulty
        if (question.difficulty === 'easy') {
          adjustedMastery = Math.max(question.mastery - 5, 50);
        } else if (question.difficulty === 'medium') {
          // Keep medium as-is or slight boost
          adjustedMastery = question.mastery;
        } else {
          // Hard questions slightly lower
          adjustedMastery = Math.min(question.mastery, 45);
        }
        break;

      case 'advanced':
        // Challenge from the start: lower mastery across the board
        if (question.difficulty === 'easy') {
          adjustedMastery = Math.min(question.mastery, 50);
        } else if (question.difficulty === 'medium') {
          adjustedMastery = Math.min(question.mastery, 40);
        } else {
          // Hard questions start very low for maximum challenge
          adjustedMastery = Math.min(question.mastery, 30);
        }
        break;
    }

    // Ensure mastery stays within valid range
    adjustedMastery = Math.max(0, Math.min(100, adjustedMastery));

    return {
      ...question,
      mastery: adjustedMastery,
    };
  });
}
