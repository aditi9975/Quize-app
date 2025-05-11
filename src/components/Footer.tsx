import React from 'react';
import { BookOpen, Github as GitHub, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <span className="ml-2 font-bold text-xl">QuizGenius</span>
            </div>
            <p className="text-gray-300 text-sm">
              Create intelligent quizzes from any content using advanced AI technology.
              Perfect for educators, students, and curious minds.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm transition duration-150">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white text-sm transition duration-150">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/create-quiz" className="text-gray-300 hover:text-white text-sm transition duration-150">
                  Create Quiz
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white text-sm transition duration-150">
                  Profile
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-150">
                <GitHub className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-150">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-150">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Have questions or suggestions? <br />
              <a href="mailto:support@quizgenius.com" className="text-indigo-400 hover:text-indigo-300">
                support@quizgenius.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} QuizGenius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;