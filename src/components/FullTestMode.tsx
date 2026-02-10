import { useState, useEffect } from 'react';
import { Question, QuestionCount, UserAnswer } from '../types';
import { selectQuestions, shuffleQuestions } from '../utils/questionSelection';
import { updateMastery } from '../utils/mastery';
import { addAnswerToHistory, updateQuestionMasteries } from '../utils/storage';

interface FullTestModeProps {
  questions: Question[];
  onComplete: () => void;
  onUpdateQuestions: (questions: Question[]) => void;
}

interface TestAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
}

const TEST_DURATION_MINUTES = 60; // 60 minutes for full test

export default function FullTestMode({
  questions,
  onComplete,
  onUpdateQuestions,
}: FullTestModeProps) {
  const [questionCount, setQuestionCount] = useState<QuestionCount | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_MINUTES * 60); // seconds
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (!testStarted || testCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testStarted, testCompleted]);

  const handleSelectCount = (count: QuestionCount) => {
    const selected = selectQuestions(questions, count);
    const shuffled = shuffleQuestions(selected);
    setSelectedQuestions(shuffled);
    setAnswers(selected.map(() => ({ questionId: '', selectedAnswer: null })));
    setQuestionCount(count);
    setCurrentIndex(0);
    setTimeRemaining(TEST_DURATION_MINUTES * 60);
    setTestStarted(false);
    setTestCompleted(false);
  };

  const handleStartTest = () => {
    // Initialize answers array
    const initialAnswers = selectedQuestions.map(q => ({
      questionId: q.id,
      selectedAnswer: null as 'A' | 'B' | 'C' | 'D' | null,
    }));
    setAnswers(initialAnswers);
    setTestStarted(true);
  };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: selectedQuestions[currentIndex].id,
      selectedAnswer: answer,
    };
    setAnswers(newAnswers);
  };

  const handleTimeUp = () => {
    finishTest();
  };

  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit the test? You cannot go back.')) {
      finishTest();
    }
  };

  const finishTest = () => {
    setTestCompleted(true);
    
    // Calculate score
    let correct = 0;
    const masteryUpdates: Record<string, number> = {};
    const userAnswers: UserAnswer[] = [];

    selectedQuestions.forEach((question, index) => {
      const answer = answers[index];
      const isCorrect = answer?.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) correct++;
      
      // Update mastery
      const newMastery = updateMastery(question.mastery, isCorrect);
      masteryUpdates[question.id] = newMastery;

      // Create user answer record
      if (answer?.selectedAnswer) {
        userAnswers.push({
          questionId: question.id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          timestamp: Date.now(),
        });
        addAnswerToHistory({
          questionId: question.id,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
          timestamp: Date.now(),
        });
      }
    });

    setScore({ correct, total: selectedQuestions.length });

    // Update all masteries
    const updatedQuestions = questions.map(q =>
      masteryUpdates[q.id] !== undefined ? { ...q, mastery: masteryUpdates[q.id] } : q
    );
    onUpdateQuestions(updatedQuestions);
    updateQuestionMasteries(masteryUpdates);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questionCount) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Select Test Length
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {([10, 25, 50, 100] as QuestionCount[]).map(count => (
            <button
              key={count}
              onClick={() => handleSelectCount(count)}
              className="py-3 sm:py-4 px-4 sm:px-6 bg-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-green-700 transition"
            >
              {count} Questions
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!testStarted && !testCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Full Practice Test
        </h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-gray-700">
            <strong>Test Rules:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
            <li>{selectedQuestions.length} questions</li>
            <li>Time limit: {TEST_DURATION_MINUTES} minutes</li>
            <li>No immediate feedback</li>
            <li>Review all answers at the end</li>
          </ul>
        </div>
        <button
          onClick={handleStartTest}
          className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition"
        >
          Start Test
        </button>
      </div>
    );
  }

  if (testCompleted) {
    const percentage = (score.correct / score.total) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Test Complete!
          </h2>
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {score.correct} / {score.total}
            </div>
            <div className="text-2xl text-gray-700">
              {percentage.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-6">
            {selectedQuestions.map((question, index) => {
              const answer = answers[index];
              const userAnswer = answer?.selectedAnswer;
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = userAnswer !== null;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-6 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                        {question.topic}
                      </span>
                      <span className="text-sm text-gray-600">
                        Question {index + 1}
                      </span>
                    </div>
                    {wasAnswered ? (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                        Not Answered
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {question.question}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {(['A', 'B', 'C', 'D'] as const).map(choice => {
                      const isUserAnswer = userAnswer === choice;
                      const isCorrectAnswer = choice === question.correctAnswer;
                      let className = 'p-3 rounded-lg border-2 ';

                      if (isCorrectAnswer) {
                        className += 'bg-green-100 border-green-500 text-green-900';
                      } else if (isUserAnswer && !isCorrect) {
                        className += 'bg-red-100 border-red-500 text-red-900';
                      } else {
                        className += 'border-gray-300 bg-gray-50 text-gray-700';
                      }

                      return (
                        <div key={choice} className={className}>
                          <span className="font-semibold">{choice}.</span>{' '}
                          {question.choices[choice]}
                          {isUserAnswer && ' (Your Answer)'}
                          {isCorrectAnswer && ' (Correct Answer)'}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="font-medium text-gray-900 mb-2">Explanation:</p>
                    {wasAnswered && userAnswer && (
                      <p className="text-gray-700 mb-2">
                        <strong>Your answer:</strong>{' '}
                        {question.explanations[userAnswer]}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <strong>Correct answer explanation:</strong>{' '}
                      {question.explanations[question.correctAnswer]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progress = ((currentIndex + 1) / selectedQuestions.length) * 100;
  const answeredCount = answers.filter(a => a.selectedAnswer !== null).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer and Progress */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">
            {answeredCount} / {selectedQuestions.length} answered
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          Question {currentIndex + 1} of {selectedQuestions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4">
          <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
            {currentQuestion.topic}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {(['A', 'B', 'C', 'D'] as const).map(choice => {
            const isSelected = currentAnswer?.selectedAnswer === choice;
            return (
              <button
                key={choice}
                onClick={() => handleAnswerSelect(choice)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition ${
                  isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-900'
                }`}
              >
                <span className="font-semibold">{choice}.</span>{' '}
                {currentQuestion.choices[choice]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={handleSubmitTest}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Submit Test
            </button>
            <button
              onClick={() =>
                setCurrentIndex(
                  Math.min(selectedQuestions.length - 1, currentIndex + 1)
                )
              }
              disabled={currentIndex === selectedQuestions.length - 1}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Question Navigation</h4>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2">
          {selectedQuestions.map((_, index) => {
            const answer = answers[index];
            const isAnswered = answer?.selectedAnswer !== null;
            const isCurrent = index === currentIndex;

            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-8 sm:h-10 rounded text-xs sm:text-sm ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : isAnswered
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded mr-1 sm:mr-2"></div>
            Answered
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded mr-1 sm:mr-2"></div>
            Not Answered
          </div>
        </div>
      </div>
    </div>
  );
}
