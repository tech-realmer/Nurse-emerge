const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID;

// GET /api/posts
app.get('/api/posts', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    res.json(response.data.record || []);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const posts = response.data.record || [];
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

// POST /api/posts
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, imagePath } = req.body;
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
      imagePath: imagePath || null
    };
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const posts = response.data.record || [];
    posts.push(newPost);
    await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, posts, {
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding post:', error.message);
    res.status(500).json({ error: 'Failed to add post' });
  }
});

module.exports = app;