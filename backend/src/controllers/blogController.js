const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

const getBlogPosts = async (req, res) => {
  const posts = await BlogPost.find().populate('author', 'username');
  res.json(posts);
};

const getBlogPostById = async (req, res) => {
  const post = await BlogPost.findById(req.params.id).populate('author', 'username');

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const comments = await Comment.find({ post: post._id })
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  res.json({ ...post.toObject(), comments });
};

const createBlogPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = await BlogPost.create({ title, content, author: req.user._id });
  res.status(201).json(post);
};

const updateBlogPost = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not allowed to modify this post');
  }

  Object.assign(post, req.body);
  const updated = await post.save();
  res.json(updated);
};

const deleteBlogPost = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not allowed to delete this post');
  }

  await post.deleteOne();
  res.status(204).send();
};

module.exports = {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};
