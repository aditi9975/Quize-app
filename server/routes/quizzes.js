import express from 'express';
import { generateQuiz } from '../services/aiService.js';
import Quiz from '../models/Quiz.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate quiz using AI
router.post('/ai/generate-quiz', auth, async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    const result = await generateQuiz(topic, 'medium', numQuestions || 10);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate quiz'
    });
  }
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
});

// Get user's quizzes
router.get('/user', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.userId })
      .sort('-createdAt');
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    res.status(500).json({ message: 'Error fetching your quizzes' });
  }
});

// Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Error fetching quiz' });
  }
});

// Create quiz
router.post('/', auth, async (req, res) => {
  try {
    const { title, topic, questions, settings } = req.body;

    // Validate required fields
    if (!title || !topic || !questions || !Array.isArray(questions) || !settings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create quiz
    const quiz = new Quiz({
      title,
      topic,
      questions,
      settings,
      createdBy: req.user.userId
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating quiz' });
  }
});

// Update quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating quiz' });
  }
});

// Delete quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
});

export default router;