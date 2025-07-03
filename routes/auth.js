import express from 'express';
import bcrypt from 'bcrypt';
import { readJSON, writeJSON } from '../utils/fileHandler.js';
import { generateToken } from '../middlewares/auth.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await readJSON('./data/users.json');
    const userExists = users.find(u => u.email === email);

    if (userExists) {
      return res.status(409).json({ success: false, message: 'This email is already registered. Please login.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ id: uuid(), email, password: hashed });
    await writeJSON('./data/users.json', users);

    res.status(201).json({ success: true, message: 'Registration successful. You can now log in.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong while registering. Please try again later.' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await readJSON('./data/users.json');
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong while logging in. Please try again later.' });
  }
});

export default router;
