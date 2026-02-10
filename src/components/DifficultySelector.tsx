import { useState } from 'react';

export type StarterDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: StarterDifficulty) => void;
}

export default function DifficultySelector({ onSelectDifficulty }: DifficultySelectorProps) {
  const [selected, setSelected] = useState<StarterDifficulty | null>(null);

  const difficulties: Array<{
    level: StarterDifficulty;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      level: 'beginner',
      title: 'Beginner',
      description: 'Start with easier questions. Good for new learners or first-time DECA participants.',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
    },
    {
      level: 'intermediate',
      title: 'Intermediate',
      description: 'Mix of easy and medium difficulty questions. For those with some business knowledge.',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
    },
    {
      level: 'advanced',
      title: 'Advanced',
      description: 'Challenging questions across all difficulty levels. For experienced entrepreneurs.',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DecaMaxxing</h1>
          <p className="text-xl text-gray-600 mb-2">Choose your starting difficulty level</p>
          <p className="text-gray-500">
            Don't worry - you can always adjust your practice to focus on any difficulty level later!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.level}
              onClick={() => setSelected(difficulty.level)}
              className={`text-left p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                selected === difficulty.level
                  ? `${difficulty.bgColor} ${difficulty.borderColor} border-4 shadow-lg`
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center mb-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selected === difficulty.level
                      ? `${difficulty.borderColor}`
                      : 'border-gray-400'
                  }`}
                >
                  {selected === difficulty.level && (
                    <div className={`w-3 h-3 rounded-full ${
                      difficulty.level === 'beginner' ? 'bg-green-600' :
                      difficulty.level === 'intermediate' ? 'bg-blue-600' :
                      'bg-purple-600'
                    }`} />
                  )}
                </div>
                <h3 className={`text-2xl font-bold ${difficulty.color}`}>{difficulty.title}</h3>
              </div>
              <p className="text-gray-600">{difficulty.description}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => selected && onSelectDifficulty(selected)}
            disabled={!selected}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition ${
              selected
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}
