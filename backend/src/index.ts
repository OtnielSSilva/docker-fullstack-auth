import express from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
require('dotenv');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
