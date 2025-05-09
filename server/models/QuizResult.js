import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // Time in seconds
    required: true
  },
  answers: {
    type: [answerSchema],
    required: true
  }
}, {
  timestamps: true
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;