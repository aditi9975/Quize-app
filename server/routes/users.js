import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get authenticated user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }
  
  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user account
router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;