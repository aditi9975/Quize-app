import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Quiz must have at least one question'
    }
  },
  settings: {
    timeLimit: {
      type: Number,
      default: 30,
      min: 1
    },
    numQuestions: {
      type: Number,
      default: 10,
      min: 1
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;