import { Question, UserAnswer } from '../types';

const STORAGE_KEYS = {
  QUESTIONS: 'decamaxxing_questions',
  ANSWER_HISTORY: 'decamaxxing_answer_history',
  STARTER_DIFFICULTY: 'decamaxxing_starter_difficulty',
} as const;

/**
 * Loads questions from localStorage
 * NOTE: This is ONLY used to get mastery scores, NOT question content
 * Question content ALWAYS comes from entrepreneurship_1.json
 */
export function loadQuestions(): Question[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!data) return null;
    const parsed = JSON.parse(data);
    console.log('💾 Loading mastery scores from localStorage (NOT question content)');
    return parsed;
  } catch (error) {
    console.error('Failed to load questions from storage:', error);
    return null;
  }
}

/**
 * Saves questions to localStorage
 */
export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (error) {
    console.error('Failed to save questions to storage:', error);
  }
}

/**
 * Updates a single question's mastery in storage
 */
export function updateQuestionMastery(questionId: string, newMastery: number): void {
  const questions = loadQuestions();
  if (!questions) return;
  
  const question = questions.find(q => q.id === questionId);
  if (question) {
    question.mastery = newMastery;
    saveQuestions(questions);
  }
}

/**
 * Updates multiple questions' mastery scores
 */
export function updateQuestionMasteries(updates: Record<string, number>): void {
  const questions = loadQuestions();
  if (!questions) return;
  
  questions.forEach(q => {
    if (updates[q.id] !== undefined) {
      q.mastery = updates[q.id];
    }
  });
  
  saveQuestions(questions);
}

/**
 * Loads answer history from localStorage
 */
export function loadAnswerHistory(): UserAnswer[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANSWER_HISTORY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load answer history from storage:', error);
    return [];
  }
}

/**
 * Saves answer history to localStorage
 */
export function saveAnswerHistory(answers: UserAnswer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWER_HISTORY, JSON.stringify(answers));
  } catch (error) {
    console.error('Failed to save answer history to storage:', error);
  }
}

/**
 * Appends a new answer to the history
 */
export function addAnswerToHistory(answer: UserAnswer): void {
  const history = loadAnswerHistory();
  history.push(answer);
  saveAnswerHistory(history);
}

/**
 * Initializes questions from JSON file data
 */
export function initializeQuestions(questions: Question[]): void {
  saveQuestions(questions);
}

/**
 * Saves starter difficulty preference
 */
export function saveStarterDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STARTER_DIFFICULTY, difficulty);
  } catch (error) {
    console.error('Failed to save starter difficulty:', error);
  }
}

/**
 * Loads starter difficulty preference
 */
export function loadStarterDifficulty(): 'beginner' | 'intermediate' | 'advanced' | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STARTER_DIFFICULTY);
    return data as 'beginner' | 'intermediate' | 'advanced' | null;
  } catch (error) {
    console.error('Failed to load starter difficulty:', error);
    return null;
  }
}
