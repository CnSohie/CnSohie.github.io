/* eslint-disable no-console */
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

dotenv.config();

const seedData = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Project.deleteMany(), BlogPost.deleteMany(), Comment.deleteMany()]);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123'
  });

  const projects = await Project.insertMany([
    {
      title: 'Sample Portfolio',
      description: 'A showcase of my work.',
      user: admin._id
    },
    {
      title: 'API Project',
      description: 'REST API built with Node and Express.',
      user: admin._id
    }
  ]);

  const posts = await BlogPost.insertMany([
    {
      title: 'Welcome to the Blog',
      content: 'This is the first post on the new blog.',
      author: admin._id
    }
  ]);

  await Comment.create({
    body: 'Excited to follow along!',
    author: admin._id,
    post: posts[0]._id
  });

  console.log(`Seeded ${projects.length} projects and ${posts.length} posts`);
  process.exit();
};

const destroyData = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Project.deleteMany(), BlogPost.deleteMany(), Comment.deleteMany()]);
  console.log('Data destroyed');
  process.exit();
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  seedData();
}
