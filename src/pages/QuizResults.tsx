import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { Award, Clock, Calendar, ArrowLeft, Check, X, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#10B981', '#EF4444'];

const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchQuizResultById, loading } = useQuiz();
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResult = async () => {
      try {
        if (id) {
          const data = await fetchQuizResultById(id);
          setResult(data);
        }
      } catch (err) {
        setError('Failed to load quiz results');
      }
    };
    
    loadResult();
  }, [id, fetchQuizResultById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const score = Math.round((result.score / result.totalQuestions) * 100);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const pieData = [
    { name: 'Correct', value: result.score },
    { name: 'Incorrect', value: result.totalQuestions - result.score }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">{result.quiz.title} - Results</h1>
            <p className="text-indigo-200 mt-1">{result.quiz.topic}</p>
          </div>
          
          {/* Score Overview */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
                <Award className="h-10 w-10 text-indigo-600 mb-2" />
                <span className="text-gray-500 text-sm">Your Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
                <span className="text-gray-500 text-sm">
                  {result.score}/{result.totalQuestions} correct
                </span>
              </div>
              
              {/* Time */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
                <Clock className="h-10 w-10 text-indigo-600 mb-2" />
                <span className="text-gray-500 text-sm">Time Taken</span>
                <span className="text-3xl font-bold text-gray-800">
                  {formatTime(result.timeTaken)}
                </span>
                <span className="text-gray-500 text-sm">
                  {Math.round(result.timeTaken / result.totalQuestions)} seconds per question
                </span>
              </div>
              
              {/* Date */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
                <Calendar className="h-10 w-10 text-indigo-600 mb-2" />
                <span className="text-gray-500 text-sm">Completed</span>
                <span className="text-xl font-bold text-gray-800">
                  {formatDate(result.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Score Visualization */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="bg-green-500 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Correct Answers</h3>
                      <p className="text-green-600 text-sm">{result.score} questions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center">
                    <div className="bg-red-500 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                      <X className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-800">Incorrect Answers</h3>
                      <p className="text-red-600 text-sm">
                        {result.totalQuestions - result.score} questions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600">
                    {score >= 80 ? (
                      'Excellent work! You have a strong understanding of the material.'
                    ) : score >= 60 ? (
                      'Good job! You have a decent grasp of the material, but there\'s room for improvement.'
                    ) : (
                      'You might want to review the material again to improve your understanding.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Question Review */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-6">
              {result.answers.map((answer: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                      answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answer.isCorrect ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Question {index + 1}: {answer.question}
                      </h3>
                      
                      {answer.isCorrect ? (
                        <p className="mt-1 text-green-700">
                          <span className="font-medium">Correct!</span> You answered: {answer.userAnswer}
                        </p>
                      ) : (
                        <div className="mt-1 space-y-1">
                          <p className="text-red-700">
                            <span className="font-medium">Incorrect.</span> You answered: {answer.userAnswer}
                          </p>
                          <p className="text-green-700">
                            <span className="font-medium">Correct answer:</span> {answer.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <Link
              to={`/take-quiz/${result.quiz._id}`}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retry Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;