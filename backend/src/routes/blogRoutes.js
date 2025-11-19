const express = require('express');
const {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getBlogPosts).post(protect, createBlogPost);
router
  .route('/:id')
  .get(getBlogPostById)
  .put(protect, updateBlogPost)
  .delete(protect, deleteBlogPost);

module.exports = router;
