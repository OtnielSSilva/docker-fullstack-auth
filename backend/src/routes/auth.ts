import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import dotenv from 'dotenv';
import authenticateToken from '../middlewares/auth';

dotenv.config();
const router = Router();

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!JWT_SECRET) {
      return res.sendStatus(500).send({ error: 'Not a valid JWT key' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create a JWT without an expiration
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.cookie('token', token, { httpOnly: true, secure: false });
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected router' });
});

export default router;
