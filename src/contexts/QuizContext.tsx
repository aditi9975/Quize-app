import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import api from '../config/axios';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizSettings {
  numQuestions: number;
  timeLimit: number;
}

interface Quiz {
  _id: string;
  title: string;
  topic: string;
  questions: Question[];
  settings: QuizSettings;
  createdBy: string;
  createdAt: string;
}

interface QuizResult {
  _id: string;
  quiz: Quiz;
  user: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  createdAt: string;
}

interface QuizContextType {
  quizzes: Quiz[];
  userQuizzes: Quiz[];
  quizResults: QuizResult[];
  loading: boolean;
  error: string | null;
  currentQuiz: Quiz | null;
  fetchQuizzes: () => Promise<void>;
  fetchUserQuizzes: () => Promise<void>;
  fetchQuizById: (id: string) => Promise<Quiz>;
  createQuiz: (quizData: { title: string; topic: string; settings: QuizSettings }) => Promise<Quiz>;
  deleteQuiz: (id: string) => Promise<void>;
  submitQuizResult: (quizId: string, answers: any[], timeTaken: number) => Promise<QuizResult>;
  fetchQuizResults: () => Promise<void>;
  fetchQuizResultById: (id: string) => Promise<QuizResult>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/quizzes/user');
      setUserQuizzes(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user quizzes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('Quiz ID is required');
      }

      const res = await api.get(`/quizzes/${id}`);
      
      if (!res.data || !res.data._id) {
        throw new Error('Quiz not found');
      }

      if (!res.data.questions || res.data.questions.length === 0) {
        throw new Error('Quiz has no questions');
      }

      setCurrentQuiz(res.data);
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch quiz';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuiz = useCallback(async (quizData: { title: string; topic: string; settings: QuizSettings }) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, generate questions using AI with retry logic
      let aiResponse: any;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          aiResponse = await api.post('/quizzes/ai/generate-quiz', {
            topic: quizData.topic,
            numQuestions: quizData.settings.numQuestions
          });
          
          if (!aiResponse?.data?.success || !aiResponse?.data?.questions) {
            throw new Error(aiResponse?.data?.error || 'Failed to generate quiz questions');
          }
          
          break; // If successful, break the retry loop
        } catch (err: any) {
          if (err.message.includes('timeout') && retryCount < maxRetries) {
            retryCount++;
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw err; // If not a timeout or max retries reached, throw the error
        }
      }

      if (!aiResponse?.data?.questions) {
        throw new Error('Failed to generate quiz questions after retries');
      }

      // Then create the quiz with the generated questions
      const quizPayload = {
        title: quizData.title,
        topic: quizData.topic,
        settings: quizData.settings,
        questions: aiResponse.data.questions
      };

      const res = await api.post('/quizzes', quizPayload);
      
      if (!res.data || !res.data._id) {
        throw new Error('Failed to create quiz: No quiz ID received');
      }
      
      const newQuiz = res.data;
      setUserQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (err: any) {
      console.error('Error in createQuiz:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create quiz';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/quizzes/${id}`);
      setUserQuizzes(prev => prev.filter(quiz => quiz._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuizResult = useCallback(async (quizId: string, answers: any[], timeTaken: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Submit quiz result
      const res = await api.post('/quiz-results', { 
        quizId, 
        answers, 
        timeTaken 
      });

      if (!res.data || !res.data._id) {
        throw new Error('Failed to submit quiz result');
      }

      // Update quiz results in context
      setQuizResults(prev => [...prev, res.data]);
      
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit quiz result';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/quiz-results');
      setQuizResults(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz results');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizResultById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/quiz-results/${id}`);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        userQuizzes,
        quizResults,
        loading,
        error,
        currentQuiz,
        fetchQuizzes,
        fetchUserQuizzes,
        fetchQuizById,
        createQuiz,
        deleteQuiz,
        submitQuizResult,
        fetchQuizResults,
        fetchQuizResultById
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};