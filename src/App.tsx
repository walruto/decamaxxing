import { useState, useEffect } from 'react';
import { Question, QuestionBank } from './types';
import {
  initializeQuestions,
  loadQuestions,
  loadStarterDifficulty,
  saveStarterDifficulty
} from './utils/storage';
import { applyStarterDifficulty } from './utils/difficulty';
import Home from './components/Home';
import PracticeMode from './components/PracticeMode';
import FullTestMode from './components/FullTestMode';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DifficultySelector, { StarterDifficulty } from './components/DifficultySelector';
import Layout from './components/Layout';

// IMPORTANT: Questions MUST come from entrepreneurship_1.json only - this is the single source of truth
import entrepreneurshipData from '../entrepreneurship_1.json';
import marketingData from '../marketing_1.json';
import { transformQuestionsFromJSON } from './utils/question-transformer';

type View = 'home' | 'practice' | 'fullTest' | 'analytics' | 'difficultySelector';

// Transform the JSON data to match the expected structure
const questionBanks: Record<string, QuestionBank> = {
  Entrepreneurship: transformQuestionsFromJSON(entrepreneurshipData),
  Marketing: transformQuestionsFromJSON(marketingData),
};

function App() {
  const [view, setView] = useState<View>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState('Marketing');

  useEffect(() => {
    const savedDifficulty = loadStarterDifficulty();

    if (!savedDifficulty) {
      setShowDifficultySelector(true);
      setLoading(false);
      return;
    }

    loadQuestionsWithDifficulty(savedDifficulty, selectedCluster);
  }, [selectedCluster]);

  const loadQuestionsWithDifficulty = (
    starterDifficulty: StarterDifficulty,
    cluster: string
  ) => {
    const questionBank =
      questionBanks[cluster] || questionBanks.Entrepreneurship;

    const storedQuestions = loadQuestions();

    let mergedQuestions = questionBank.questions.map(q => {
      const stored = storedQuestions?.find(sq => sq.id === q.id);
      return stored ? { ...q, mastery: stored.mastery } : q;
    });

    if (!storedQuestions || storedQuestions.length === 0) {
      mergedQuestions = applyStarterDifficulty(
        mergedQuestions,
        starterDifficulty
      );
    }

    setQuestions(mergedQuestions);
    initializeQuestions(mergedQuestions);
    setLoading(false);
  };

  const handleDifficultySelected = (difficulty: StarterDifficulty) => {
    saveStarterDifficulty(difficulty);
    setShowDifficultySelector(false);
    loadQuestionsWithDifficulty(difficulty, selectedCluster);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading DecaMaxxing...</div>
      </div>
    );
  }

  if (showDifficultySelector) {
    return <DifficultySelector onSelectDifficulty={handleDifficultySelected} />;
  }

  return (
    <Layout
      activeTab={view}
      onTabChange={tab => setView(tab as View)}
      selectedCluster={selectedCluster}
      onClusterChange={setSelectedCluster}
    >
      {view === 'home' && (
        <Home
          onStartPractice={() => setView('practice')}
          onStartFullTest={() => setView('fullTest')}
          questions={questions}
          selectedCluster={selectedCluster}
        />
      )}

      {view === 'practice' && (
        <PracticeMode
          questions={questions}
          onComplete={() => setView('home')}
          onUpdateQuestions={setQuestions}
        />
      )}

      {view === 'fullTest' && (
        <FullTestMode
          questions={questions}
          onComplete={() => setView('home')}
          onUpdateQuestions={setQuestions}
        />
      )}

      {view === 'analytics' && (
        <AnalyticsDashboard questions={questions} />
      )}
    </Layout>
  );
}

export default App;
