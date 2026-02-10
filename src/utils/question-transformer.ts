import { QuestionBank } from '../types';

/**
 * Transforms questions from JSON file format to the format expected by the app
 * JSON format has: options, answer, explanation
 * App expects: choices, correctAnswer, explanations
 */
export function transformQuestionsFromJSON(jsonData: any): QuestionBank {
  // Transform each question to match the expected structure
  const transformedQuestions = jsonData.questions.map((q: any) => {
    // Create explanations object - for now, use the same explanation for all options
    // In the future, we could enhance this to have specific explanations per option
    const explanations: Record<string, string> = {};
    const allOptionKeys = Object.keys(q.options || {});

    allOptionKeys.forEach(key => {
      // For the correct answer, use the main explanation
      // For incorrect answers, we could potentially customize later
      explanations[key] = q.explanation || `Explanation for option ${key}`;
    });

    return {
      id: q.id,
      question: q.question,
      choices: q.options || {},
      correctAnswer: q.answer,
      explanations: explanations,
      topic: q.topic || q.id.split('-')[0] || 'General', // Extract topic from ID if available
      difficulty: q.difficulty || 'medium',
      mastery: q.mastery || 0,
    };
  });

  return {
    cluster: jsonData.cluster,
    version: jsonData.version || '1.0',
    questions: transformedQuestions,
  };
}