require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Simple in-memory store (resets on server restart)
const users = []; // { id, name, email, passwordHash }
const notesByUserId = {}; // { [userId]: [{id, text, createdAt}] }

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: false, // we’re using localStorage token
  })
);

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email, password required' });

  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email,
    passwordHash,
  };
  users.push(user);
  notesByUserId[user.id] = [
    { id: 'welcome', text: `Welcome ${name}! 🎉`, createdAt: new Date().toISOString() },
  ];

  const token = makeToken(user);
  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = makeToken(user);
  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/notes', auth, (req, res) => {
  res.json({ notes: notesByUserId[req.user.id] || [] });
});

app.post('/api/notes', auth, (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: 'text required' });

  const note = {
    id: Date.now().toString(),
    text,
    createdAt: new Date().toISOString(),
  };
  notesByUserId[req.user.id] = notesByUserId[req.user.id] || [];
  notesByUserId[req.user.id].push(note);
  res.status(201).json({ note });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
