import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-quiz" 
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/take-quiz/:id" 
                  element={
                    <ProtectedRoute>
                      <TakeQuiz />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quiz-results/:id" 
                  element={
                    <ProtectedRoute>
                      <QuizResults />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;