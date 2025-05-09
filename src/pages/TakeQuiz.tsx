import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { Clock, ArrowRight, Check, X, AlertTriangle } from 'lucide-react';

interface Answer {
  questionId: string;
  answer: string;
}

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchQuizById, submitQuizResult, loading } = useQuiz();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState('');

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (id) {
          const data = await fetchQuizById(id);
          setQuiz(data);
        }
      } catch (err) {
        setError('Failed to load quiz');
      }
    };
    
    loadQuiz();
  }, [id, fetchQuizById]);

  // Timer
  useEffect(() => {
    if (!quiz || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quiz, quizCompleted]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;
    
    // Save answer
    const question = quiz.questions[currentQuestionIndex];
    setAnswers([...answers, { questionId: question._id, answer: selectedOption }]);
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    if (!id) return;
    
    setQuizCompleted(true);
    
    try {
      const result = await submitQuizResult(id, answers, timeElapsed);
      navigate(`/quiz-results/${result._id}`);
    } catch (err) {
      setError('Failed to submit quiz results');
    }
  };

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
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{quiz.title}</h1>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>
            <p className="text-indigo-200 text-sm mt-1">{quiz.topic}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-indigo-600 h-1 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Question */}
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
            
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOption === option
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                      selectedOption === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <span className="text-sm text-gray-500">
              {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                !selectedOption
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete <Check className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;