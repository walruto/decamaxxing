import { Question, UserAnswer, Analytics, ProgressPoint } from '../types';
import { format } from 'date-fns';

/**
 * Calculates overall analytics from questions and answer history
 */
export function calculateAnalytics(
  questions: Question[],
  answerHistory: UserAnswer[]
): Analytics {
  // Calculate accuracy
  const totalAnswered = answerHistory.length;
  const correctCount = answerHistory.filter(a => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;
  
  // Calculate average mastery
  const totalMastery = questions.reduce((sum, q) => sum + q.mastery, 0);
  const averageMastery = questions.length > 0 ? totalMastery / questions.length : 0;
  
  // Calculate mastery by topic
  const masteryByTopic: Record<string, { total: number; count: number }> = {};
  questions.forEach(q => {
    if (!masteryByTopic[q.topic]) {
      masteryByTopic[q.topic] = { total: 0, count: 0 };
    }
    masteryByTopic[q.topic].total += q.mastery;
    masteryByTopic[q.topic].count += 1;
  });
  
  const masteryByTopicAvg: Record<string, number> = {};
  Object.keys(masteryByTopic).forEach(topic => {
    const { total, count } = masteryByTopic[topic];
    masteryByTopicAvg[topic] = count > 0 ? total / count : 0;
  });
  
  // Build progress history (daily aggregations)
  const progressHistory = buildProgressHistory(answerHistory, questions);
  
  return {
    accuracy,
    averageMastery,
    masteryByTopic: masteryByTopicAvg,
    totalQuestions: questions.length,
    totalAnswered,
    progressHistory,
  };
}

/**
 * Builds progress history from answer history
 */
function buildProgressHistory(
  answerHistory: UserAnswer[],
  questions: Question[]
): ProgressPoint[] {
  if (answerHistory.length === 0) {
    return [];
  }
  
  // Group answers by date
  const byDate: Record<string, UserAnswer[]> = {};
  answerHistory.forEach(answer => {
    const date = format(new Date(answer.timestamp), 'yyyy-MM-dd');
    if (!byDate[date]) {
      byDate[date] = [];
    }
    byDate[date].push(answer);
  });
  
  // Calculate metrics per day
  const history: ProgressPoint[] = [];
  const sortedDates = Object.keys(byDate).sort();
  
  sortedDates.forEach(date => {
    const dayAnswers = byDate[date];
    const dayCorrect = dayAnswers.filter(a => a.isCorrect).length;
    const dayAccuracy = dayAnswers.length > 0 
      ? (dayCorrect / dayAnswers.length) * 100 
      : 0;
    
    // Calculate average mastery at this point in time
    // For simplicity, use current mastery (in real app, would track historical mastery)
    const totalMastery = questions.reduce((sum, q) => sum + q.mastery, 0);
    const dayAvgMastery = questions.length > 0 ? totalMastery / questions.length : 0;
    
    history.push({
      date,
      accuracy: dayAccuracy,
      averageMastery: dayAvgMastery,
    });
  });
  
  return history;
}

/**
 * Gets strongest topics (highest average mastery)
 */
export function getStrongestTopics(analytics: Analytics, topN: number = 5): string[] {
  const entries = Object.entries(analytics.masteryByTopic);
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, topN).map(([topic]) => topic);
}

/**
 * Gets weakest topics (lowest average mastery)
 */
export function getWeakestTopics(analytics: Analytics, topN: number = 5): string[] {
  const entries = Object.entries(analytics.masteryByTopic);
  entries.sort((a, b) => a[1] - b[1]);
  return entries.slice(0, topN).map(([topic]) => topic);
}
