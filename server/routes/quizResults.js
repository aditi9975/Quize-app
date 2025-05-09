import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all quiz results for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .populate('quiz')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz result by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('quiz');
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz result
router.post('/', auth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    
    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Calculate score
    let score = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      // Find the corresponding question
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) {
        return res.status(400).json({ message: 'Invalid question ID' });
      }
      
      const isCorrect = answer.answer === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      
      processedAnswers.push({
        question: question.question,
        userAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    }
    
    // Create result
    const result = new QuizResult({
      quiz: quizId,
      user: req.user._id,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken,
      answers: processedAnswers
    });
    
    await result.save();
    
    // Populate quiz data for response
    await result.populate('quiz');
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;