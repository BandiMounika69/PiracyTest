const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for users (for demo purposes)
const users = [];

// Simple user credentials (for demo purposes)
const userCredentials = {
  username: 'admin',
  password: 'password123'
};

// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Username already taken' });
  }

  // Add the new user to the in-memory database
  users.push({ username, password });
  res.json({ success: true, message: 'Registration successful' });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match any registered user
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    res.json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Route to handle keyword search
app.post('/check', async (req, res) => {
  const { url, keyword } = req.body;

  try {
    // Fetch the webpage content using axios
    const response = await axios.get(url);
    const pageContent = response.data;

    // Check if the keyword is present in the page content
    const keywordFound = pageContent.toLowerCase().includes(keyword.toLowerCase());

    // Respond with flagging status and the URL
    res.json({ flagged: keywordFound, url: url });
  } catch (error) {
    console.error('Error fetching webpage:', error.message);
    res.status(500).json({ message: 'Failed to fetch webpage content. Please check the URL.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
