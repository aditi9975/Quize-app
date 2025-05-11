import express from 'express';
import QuizResult from '../models/QuizResult.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all results for a user
router.get('/', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user.userId })
      .populate('quiz')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Error fetching quiz results' });
  }
});

// Get single result
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('quiz');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ message: 'Error fetching quiz result' });
  }
});

// Submit quiz result
router.post('/', auth, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate score
    const score = answers.filter(answer => answer.isCorrect).length;

    const result = new QuizResult({
      quiz: quizId,
      user: req.user.userId,
      score,
      totalQuestions: answers.length,
      timeTaken,
      answers
    });

    await result.save();

    const populatedResult = await result.populate('quiz');
    res.status(201).json(populatedResult);
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error submitting quiz result' });
  }
});

export default router;