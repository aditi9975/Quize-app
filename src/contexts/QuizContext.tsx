import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  topic: string;
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
  createQuiz: (quizData: Partial<Quiz>, file?: File, content?: string) => Promise<Quiz>;
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

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/quizzes/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserQuizzes(res.data);
    } catch (err) {
      setError('Failed to fetch user quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizById = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quizzes/${id}`);
      setCurrentQuiz(res.data);
      return res.data;
    } catch (err) {
      setError('Failed to fetch quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: Partial<Quiz>, file?: File, content?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let formData = new FormData();
      
      // Add quiz data
      formData.append('title', quizData.title || '');
      formData.append('description', quizData.description || '');
      formData.append('topic', quizData.topic || '');
      
      // Add file or content
      if (file) {
        formData.append('file', file);
      } else if (content) {
        formData.append('content', content);
      }
      
      const res = await axios.post('/api/quizzes', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newQuiz = res.data;
      setUserQuizzes([...userQuizzes, newQuiz]);
      return newQuiz;
    } catch (err) {
      setError('Failed to create quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserQuizzes(userQuizzes.filter(quiz => quiz._id !== id));
    } catch (err) {
      setError('Failed to delete quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResult = async (quizId: string, answers: any[], timeTaken: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/quiz-results`,
        { quizId, answers, timeTaken },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data;
    } catch (err) {
      setError('Failed to submit quiz result');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/quiz-results', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQuizResults(res.data);
    } catch (err) {
      setError('Failed to fetch quiz results');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResultById = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/quiz-results/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err) {
      setError('Failed to fetch quiz result');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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