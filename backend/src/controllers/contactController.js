const Message = require('../models/Message');

const createMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const saved = await Message.create({ name, email, message });
  res.status(201).json(saved);
};

module.exports = { createMessage };
