export interface Question {
  id: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanations: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastery: number; // 0-100
}

export interface QuestionBank {
  cluster: string;
  version: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timestamp: number;
}

export interface PracticeSession {
  id: string;
  mode: 'practice' | 'fullTest';
  questionCount: number;
  answers: UserAnswer[];
  startTime: number;
  endTime?: number;
}

export interface Analytics {
  accuracy: number;
  averageMastery: number;
  masteryByTopic: Record<string, number>;
  totalQuestions: number;
  totalAnswered: number;
  progressHistory: ProgressPoint[];
}

export interface ProgressPoint {
  date: string;
  accuracy: number;
  averageMastery: number;
}

export type PracticeMode = 'practice' | 'fullTest';
export type QuestionCount = 10 | 25 | 50 | 100;
