import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/user';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
