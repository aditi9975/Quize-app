import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Menu, X, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">QuizGenius</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Dashboard
                </Link>
                <Link to="/create-quiz" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Create Quiz
                </Link>
                <div className="relative group">
                  <button className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center">
                    <span className="mr-1">{user.name}</span>
                    <User className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-1 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-600 pb-3 px-4">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-quiz" 
                  className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Quiz
                </Link>
                <Link 
                  to="/profile" 
                  className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;