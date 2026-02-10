import { useState } from 'react';
import { Question, QuestionCount, UserAnswer } from '../types';
import { selectQuestions, shuffleQuestions } from '../utils/questionSelection';
import { updateMastery } from '../utils/mastery';
import { addAnswerToHistory, updateQuestionMastery } from '../utils/storage';

interface PracticeModeProps {
  questions: Question[];
  onComplete: () => void;
  onUpdateQuestions: (questions: Question[]) => void;
}

export default function PracticeMode({
  questions,
  onComplete,
  onUpdateQuestions,
}: PracticeModeProps) {
  const [questionCount, setQuestionCount] = useState<QuestionCount | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectCount = (count: QuestionCount) => {
    console.log(`🎯 ===== SELECTING QUESTIONS FOR PRACTICE =====`);
    console.log(`🎯 Requested: ${count} questions`);
    console.log(`📚 Source: entrepreneurship_1.json (via App.tsx)`);
    console.log(`📚 Total available questions from JSON: ${questions.length}`);
    console.log(`📋 Available question IDs from JSON:`, questions.map(q => q.id).join(', '));
    console.log(`📋 Sample questions from JSON:`, questions.slice(0, 3).map(q => ({ id: q.id, topic: q.topic })));
    
    // Select questions using weighted algorithm (lower mastery = more likely to be selected)
    // Questions come from the 'questions' prop which was loaded from entrepreneurship_1.json
    const selected = selectQuestions(questions, count);
    console.log(`✅ Selected ${selected.length} questions from entrepreneurship_1.json:`, selected.map(q => q.id).join(', '));
    console.log(`=============================================`);
    
    const shuffled = shuffleQuestions(selected);
    setSelectedQuestions(shuffled);
    setQuestionCount(count);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = selectedQuestions[currentIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    // Update mastery
    const newMastery = updateMastery(currentQuestion.mastery, correct);
    const updatedQuestions = questions.map(q =>
      q.id === currentQuestion.id ? { ...q, mastery: newMastery } : q
    );
    onUpdateQuestions(updatedQuestions);
    updateQuestionMastery(currentQuestion.id, newMastery);

    // Save answer to history
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect: correct,
      timestamp: Date.now(),
    };
    addAnswerToHistory(userAnswer);

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete();
    }
  };

  if (!questionCount) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Select Practice Length
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {([10, 25, 50, 100] as QuestionCount[]).map(count => (
            <button
              key={count}
              onClick={() => handleSelectCount(count)}
              className="py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            >
              {count} Questions
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedQuestions.length === 0) {
    return null;
  }

  const currentQuestion = selectedQuestions[currentIndex];
  const progress = ((currentIndex + 1) / selectedQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentIndex + 1} of {selectedQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {currentQuestion.topic}
          </span>
          <span className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3 mb-6">
          {(['A', 'B', 'C', 'D'] as const).map(choice => {
            const isSelected = selectedAnswer === choice;
            const isCorrectAnswer = choice === currentQuestion.correctAnswer;
            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition ';

            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass += 'bg-green-100 border-green-500 text-green-900';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'bg-red-100 border-red-500 text-red-900';
              } else {
                buttonClass += 'border-gray-300 bg-gray-50 text-gray-700';
              }
            } else {
              buttonClass += isSelected
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-900';
            }

            return (
              <button
                key={choice}
                onClick={() => handleAnswerSelect(choice)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <span className="font-semibold">{choice}.</span>{' '}
                {currentQuestion.choices[choice]}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="font-semibold text-lg mb-2">
              {isCorrect ? (
                <span className="text-green-800">✓ Correct!</span>
              ) : (
                <span className="text-red-800">✗ Incorrect</span>
              )}
            </div>
            <div className="text-gray-700">
              <p className="font-medium mb-2">
                Correct Answer: {currentQuestion.correctAnswer}
              </p>
              <p className="mb-2">
                <strong>Explanation for your answer:</strong>{' '}
                {currentQuestion.explanations[selectedAnswer!]}
              </p>
              <p>
                <strong>Why the correct answer is right:</strong>{' '}
                {currentQuestion.explanations[currentQuestion.correctAnswer]}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {currentIndex < selectedQuestions.length - 1 ? 'Next Question' : 'Finish Practice'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
