const express = require('express');
const { getCommentsForPost, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/:postId/comments').get(getCommentsForPost).post(protect, createComment);

module.exports = router;
