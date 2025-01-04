import express from 'express';
import Comment from '../models/caseComment.js';

const router = express.Router();

// Add a comment to a case
router.post('/:caseId', async (req, res) => {
  const newComment = new Comment({
    caseId: req.params.caseId,
    commenter: req.body.commenter,
    comment: req.body.comment,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get comments for a case
router.get('/:caseId', async (req, res) => {
  try {
    const comments = await Comment.find({ caseId: req.params.caseId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;