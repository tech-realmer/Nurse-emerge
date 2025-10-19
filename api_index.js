const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || '$2a$10$k3Azgymetcbdjz9ZRZ84T.v4xE3y5./6WEosHOGxP5LZHOLwQf6/i';
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || '68f2b336d0ea881f40a8bce2';

// GET /api_index: Fetch all posts
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = response.data;
    const posts = data.posts || [];
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api_index/:id: Fetch single post
app.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = response.data;
    const posts = data.posts || [];
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api_index: Add new post
app.post('/', async (req, res) => {
  try {
    const newPost = req.body;
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = response.data;
    const posts = data.posts || [];
    posts.push(newPost);
    data.posts = posts;
    await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, data, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding post:', error.message);
    res.status(500).json({ error: 'Failed to add post' });
  }
});

// DELETE /api_index/:id: Delete post
app.delete('/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    const data = response.data;
    const posts = data.posts || [];
    const updatedPosts = posts.filter(p => p.id !== req.params.id);
    data.posts = updatedPosts;
    await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, data, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = app;