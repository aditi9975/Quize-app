import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, BarChart, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Create Smart Quizzes with AI
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                QuizGenius uses advanced AI to generate intelligent quizzes from your 
                PDFs, syllabi, or any text content. Perfect for educators, students, and 
                lifelong learners.
              </p>
              <div className="pt-4">
                {user ? (
                  <Link
                    to="/create-quiz"
                    className="inline-block px-6 py-3 text-lg font-medium rounded-lg bg-white text-indigo-600 hover:bg-indigo-100 transition duration-200"
                  >
                    Create a Quiz
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-block px-6 py-3 text-lg font-medium rounded-lg bg-white text-indigo-600 hover:bg-indigo-100 transition duration-200"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                alt="Student studying" 
                className="rounded-lg shadow-xl h-80 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose QuizGenius?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes quiz creation effortless while providing powerful insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition duration-300">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Our TogetherAI integration creates intelligent questions that test true understanding.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition duration-300">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Processing</h3>
              <p className="text-gray-600">
                Upload any PDF document and generate quizzes instantly from its content.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition duration-300">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Syllabus Friendly</h3>
              <p className="text-gray-600">
                Input your course syllabus to create targeted quizzes aligned with learning objectives.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition duration-300">
              <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-600">
                Gain insights into student performance with detailed quiz analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Create intelligent quizzes in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
              <p className="text-gray-600">
                Upload a PDF, enter a syllabus, or paste text content you want to create a quiz from.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
              <p className="text-gray-600">
                Our AI analyzes the content and generates relevant questions with appropriate difficulty.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Analyze</h3>
              <p className="text-gray-600">
                Share the quiz with students and analyze their results with our detailed dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Intelligent Quizzes?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of educators and students who are already using QuizGenius to enhance learning.
          </p>
          {user ? (
            <Link
              to="/create-quiz"
              className="inline-block px-6 py-3 text-lg font-medium rounded-lg bg-white text-teal-600 hover:bg-teal-50 transition duration-200"
            >
              Create Your First Quiz
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block px-6 py-3 text-lg font-medium rounded-lg bg-white text-teal-600 hover:bg-teal-50 transition duration-200"
            >
              Sign Up Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;