import { PlayCircle, BrainCircuit, BookMarked, Target, Award, ChevronRight } from 'lucide-react';
import { Question } from '../types';
import { calculateAnalytics } from '../utils/analytics';
import { loadAnswerHistory } from '../utils/storage';

interface HomeProps {
  onStartPractice: () => void;
  onStartFullTest: () => void;
  questions: Question[];
  selectedCluster?: string;
}

export default function Home({ onStartPractice, onStartFullTest, questions, selectedCluster = 'Entrepreneurship' }: HomeProps) {
  const answerHistory = loadAnswerHistory();
  const analytics = calculateAnalytics(questions, answerHistory);
  
  // Calculate stats
  const masteredCount = questions.filter(q => q.mastery >= 90).length;
  const averageMastery = analytics.averageMastery;
  const totalAnswered = analytics.totalAnswered;
  
  // Get topics with lowest mastery (priority PIs)
  const topicsByMastery = Object.entries(analytics.masteryByTopic)
    .map(([topic, mastery]) => ({
      id: topic,
      topic,
      mastery: Math.round(mastery),
      questionCount: questions.filter(q => q.topic === topic).length,
    }))
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-10 text-white shadow-2xl transition-all duration-500"
        style={{ background: `var(--cluster-gradient-${selectedCluster.replace(/\s+/g, '-')})` }}
      >
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-black mb-4">Master {selectedCluster} with Adaptive Practice</h2>
          <p className="text-white/80 mb-6 text-lg">
            Practice with questions tailored to your mastery level. Get immediate feedback and track your progress.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onStartPractice}
              className="bg-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-colors"
              style={{ color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
            >
              <PlayCircle size={20} />
              Start Practice
            </button>
            <button 
              onClick={onStartFullTest}
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              Full Test
            </button>
          </div>
        </div>
        {/* Background Decoration */}
        <div 
          className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
        ></div>
        <div className="absolute bottom-10 right-10">
          <BrainCircuit 
            size={160} 
            className="opacity-20"
            style={{ color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div
              className="p-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})20`,
                color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})`
              }}
            >
              <BookMarked size={20} />
            </div>
            <span className="text-xs sm:text-xs font-bold text-slate-400">TOTAL QUESTIONS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{questions.length}</h3>
          <p className="text-sm text-slate-500">In {selectedCluster} cluster</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div
              className="p-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})20`,
                color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})`
              }}
            >
              <Target size={20} />
            </div>
            <span className="text-xs sm:text-xs font-bold text-slate-400">AVERAGE MASTERY</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{Math.round(averageMastery)}%</h3>
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})` }}
          >
            {masteredCount} questions mastered
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div
              className="p-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})20`,
                color: `var(--cluster-primary-${selectedCluster.replace(/\s+/g, '-')})`
              }}
            >
              <Award size={20} />
            </div>
            <span className="text-xs sm:text-xs font-bold text-slate-400">PRACTICE SESSIONS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{totalAnswered}</h3>
          <p className="text-sm text-slate-500">Questions answered</p>
        </div>
      </div>

      {/* Priority Topics Table */}
      {topicsByMastery.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              Priority Topics (Lowest Mastery)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Topic</th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Questions</th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Mastery</th>
                  <th className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topicsByMastery.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 sm:px-8 py-3 sm:py-5">
                      <div>
                        <p
                          className="font-bold text-slate-800 transition-colors group-hover:opacity-80 text-sm sm:text-base"
                          style={{ color: 'inherit' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})`}
                          onMouseLeave={(e) => e.currentTarget.style.color = ''}
                        >
                          {item.topic}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-5">
                      <span className="px-2 sm:px-3 py-1 bg-slate-100 rounded-full text-[10px] sm:text-xs font-bold text-slate-600">
                        {item.questionCount} questions
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-16 sm:w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.mastery > 80 ? 'bg-green-500' : item.mastery > 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                            style={{ width: `${item.mastery}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-600">{item.mastery}%</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-3 sm:py-5">
                      <button
                        onClick={onStartPractice}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400"
                        style={{
                          '--hover-color': `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})`
                        } as React.CSSProperties}
                        onMouseEnter={(e) => e.currentTarget.style.color = `var(--cluster-text-${selectedCluster.replace(/\s+/g, '-')})`}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
