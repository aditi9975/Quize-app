import express from 'express';
import Quiz from '../models/Quiz.js';
import auth from '../middleware/auth.js';
import { generateQuestionsWithTogetherAI } from '../services/aiService.js';

const router = express.Router();

// Create a new quiz
router.post('/', auth, async (req, res) => {
  try {
    const { title, topic, settings } = req.body;
    
    // Generate questions using TogetherAI
    const questions = await generateQuestionsWithTogetherAI(topic, settings?.numQuestions || 10);
    
    // Create quiz
    const quiz = new Quiz({
      title,
      description: `Quiz about ${topic}`,
      topic,
      questions,
      settings: {
        timeLimit: settings?.timeLimit || 30,
        numQuestions: settings?.numQuestions || 10
      },
      createdBy: req.user._id
    });
    
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all quizzes created by authenticated user
router.get('/user', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;