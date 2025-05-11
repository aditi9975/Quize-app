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
      validator: function (v) {
        return v.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: false
  }
});

const settingsSchema = new mongoose.Schema({
  numQuestions: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  settings: {
    type: settingsSchema,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'Quiz must have at least one question'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
quizSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
quizSchema.index({ title: 1, topic: 1 });
quizSchema.index({ createdBy: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;