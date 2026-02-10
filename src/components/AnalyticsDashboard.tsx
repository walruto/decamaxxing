import { Question } from '../types';
import { calculateAnalytics, getStrongestTopics, getWeakestTopics } from '../utils/analytics';
import { loadAnswerHistory } from '../utils/storage';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface AnalyticsDashboardProps {
  questions: Question[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function AnalyticsDashboard({ questions }: AnalyticsDashboardProps) {
  const answerHistory = loadAnswerHistory();
  const analytics = calculateAnalytics(questions, answerHistory);
  const strongestTopics = getStrongestTopics(analytics, 5);
  const weakestTopics = getWeakestTopics(analytics, 5);

  // Prepare data for mastery by topic bar chart
  const masteryByTopicData = Object.entries(analytics.masteryByTopic)
    .map(([topic, mastery]) => ({
      topic: topic.length > 15 ? topic.substring(0, 15) + '...' : topic,
      mastery: Math.round(mastery),
      fullTopic: topic,
    }))
    .sort((a, b) => b.mastery - a.mastery);

  // Prepare data for progress history line chart
  const progressData = analytics.progressHistory.map(point => ({
    date: format(new Date(point.date), 'MMM d'),
    accuracy: Math.round(point.accuracy),
    mastery: Math.round(point.averageMastery),
  }));

  // Prepare data for topic distribution pie chart (top 6 topics)
  const topicDistributionData = Object.entries(analytics.masteryByTopic)
    .map(([topic, mastery]) => ({
      name: topic.length > 20 ? topic.substring(0, 20) + '...' : topic,
      value: Math.round(mastery),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Calculate mastery distribution
  const masteryLevels = {
    mastered: questions.filter(q => q.mastery >= 90).length,
    high: questions.filter(q => q.mastery >= 80 && q.mastery < 90).length,
    medium: questions.filter(q => q.mastery >= 50 && q.mastery < 80).length,
    low: questions.filter(q => q.mastery < 50).length,
  };

  const masteryDistributionData = [
    { name: 'Mastered (90-100)', value: masteryLevels.mastered, color: '#10B981' },
    { name: 'High (80-89)', value: masteryLevels.high, color: '#3B82F6' },
    { name: 'Medium (50-79)', value: masteryLevels.medium, color: '#F59E0B' },
    { name: 'Low (0-49)', value: masteryLevels.low, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">
          Track your progress and performance across the Entrepreneurship cluster
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Overall Accuracy</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">
            {analytics.accuracy.toFixed(1)}%
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            {analytics.totalAnswered} questions answered
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Average Mastery</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {analytics.averageMastery.toFixed(1)}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            Out of 100
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Questions</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
            {analytics.totalQuestions}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            In Entrepreneurship cluster
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Mastered Questions</div>
          <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
            {masteryLevels.mastered}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            Mastery ≥ 90
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Progress Over Time */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Progress Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Accuracy (%)"
              />
              <Line
                type="monotone"
                dataKey="mastery"
                stroke="#10B981"
                strokeWidth={2}
                name="Avg Mastery"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mastery Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Mastery Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={masteryDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {masteryDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Mastery by Topic */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Mastery by Topic
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={masteryByTopicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="topic" type="category" width={100} />
              <Tooltip
                formatter={(value: any) => [`${value ?? 0}`, 'Mastery']}
                labelFormatter={(label: any) => `Topic: ${label ?? ''}`}
              />
              <Bar dataKey="mastery" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Top Topics by Mastery
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topicDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {topicDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3 sm:mb-4">
            Strongest Topics
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {strongestTopics.length > 0 ? (
              strongestTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg sm:text-2xl font-bold text-green-600 mr-2 sm:mr-3">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{topic}</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    {Math.round(analytics.masteryByTopic[topic])}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">No data available yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3 sm:mb-4">
            Weakest Topics
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {weakestTopics.length > 0 ? (
              weakestTopics.map((topic, index) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-lg sm:text-2xl font-bold text-red-600 mr-2 sm:mr-3">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{topic}</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-red-600">
                    {Math.round(analytics.masteryByTopic[topic])}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">No data available yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
