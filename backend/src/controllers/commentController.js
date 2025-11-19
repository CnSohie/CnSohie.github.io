const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

const getCommentsForPost = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(comments);
};

const createComment = async (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;

  const post = await BlogPost.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (!body) {
    res.status(400);
    throw new Error('Comment body is required');
  }

  const comment = await Comment.create({
    body,
    post: postId,
    author: req.user._id
  });

  const populated = await comment.populate('author', 'username');
  res.status(201).json(populated);
};

module.exports = {
  getCommentsForPost,
  createComment
};
