import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, BookOpen, BarChart2, Award, Clock, Calendar } from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const COLORS = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    userQuizzes, 
    quizResults, 
    loading, 
    fetchUserQuizzes, 
    fetchQuizResults 
  } = useQuiz();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserQuizzes();
    fetchQuizResults();
  }, [fetchUserQuizzes, fetchQuizResults]);

  // Calculate analytics data
  const totalQuizzes = userQuizzes.length;
  const totalAttempts = quizResults.length;
  const averageScore = totalAttempts > 0 
    ? quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0) / totalAttempts 
    : 0;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Prepare data for charts
  const quizScoreData = quizResults.slice(0, 5).map(result => ({
    name: result.quiz.title.length > 15 
      ? `${result.quiz.title.substring(0, 15)}...` 
      : result.quiz.title,
    score: (result.score / result.totalQuestions) * 100
  }));

  const topicDistributionData = userQuizzes.reduce((acc: any[], quiz) => {
    const existingTopic = acc.find(item => item.name === quiz.topic);
    if (existingTopic) {
      existingTopic.value += 1;
    } else {
      acc.push({ name: quiz.topic, value: 1 });
    }
    return acc;
  }, []);

  const timeTrendData = quizResults
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(result => ({
      date: formatDate(result.createdAt),
      score: (result.score / result.totalQuestions) * 100
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600 mt-1">Manage your quizzes and view performance analytics</p>
          </div>
          <Link
            to="/create-quiz"
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Quiz
          </Link>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Quizzes</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalQuizzes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Quiz Attempts</h2>
                <p className="text-2xl font-semibold text-gray-900">{totalAttempts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-200">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Average Score</h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('myQuizzes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'myQuizzes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Quizzes
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Quizzes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Quizzes</h2>
              {userQuizzes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No quizzes created yet</p>
                  <Link
                    to="/create-quiz"
                    className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create your first quiz
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userQuizzes.slice(0, 5).map((quiz) => (
                    <div key={quiz._id} className="border-b border-gray-100 pb-3 last:border-0">
                      <Link to={`/take-quiz/${quiz._id}`} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">
                            {quiz.questions.length} questions · {quiz.topic}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {formatDate(quiz.createdAt)}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
              {quizResults.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No quiz attempts yet</p>
                  {userQuizzes.length > 0 && (
                    <Link
                      to={`/take-quiz/${userQuizzes[0]._id}`}
                      className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      Take a quiz
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {quizResults.slice(0, 5).map((result) => (
                    <div key={result._id} className="border-b border-gray-100 pb-3 last:border-0">
                      <Link to={`/quiz-results/${result._id}`} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{result.quiz.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="flex items-center mr-2">
                              <Award className="h-3 w-3 mr-1" />
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {formatDate(result.createdAt)}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Summary */}
            {quizResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Performance Summary</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quizScoreData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => [`${value.toFixed(1)}%`, 'Score']}
                      />
                      <Bar dataKey="score" fill="#6366F1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'myQuizzes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">My Quizzes</h2>
              <Link
                to="/create-quiz"
                className="flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition duration-150"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New Quiz
              </Link>
            </div>
            
            {userQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No quizzes yet</h3>
                <p className="mt-1 text-gray-500">Get started by creating your first quiz</p>
                <div className="mt-6">
                  <Link
                    to="/create-quiz"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Quiz
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Topic
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Questions
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Created
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {userQuizzes.map((quiz) => (
                      <tr key={quiz._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {quiz.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {quiz.topic}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {quiz.questions.length}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(quiz.createdAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/take-quiz/${quiz._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Take
                            </Link>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this quiz?')) {
                                  // We'll implement this function in the QuizContext
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {quizResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                <BarChart2 className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No quiz data available</h3>
                <p className="mt-1 text-gray-500">Complete some quizzes to see your analytics</p>
              </div>
            ) : (
              <>
                {/* Performance Over Time */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Performance Over Time</h2>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeTrendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 35 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                          domain={[0, 100]}
                        />
                        <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Score']} />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#6366F1" 
                          activeDot={{ r: 8 }}
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distribution Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Topic Distribution */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Quiz Distribution by Topic</h2>
                    {topicDistributionData.length > 0 ? (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topicDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={90}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {topicDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">Not enough data to display</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Quiz Scores */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Quiz Scores</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={quizScoreData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis 
                            label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                            domain={[0, 100]}
                          />
                          <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Score']} />
                          <Bar dataKey="score">
                            {quizScoreData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;