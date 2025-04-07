import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import redis from './config/redis';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

app.get('/', async (req: Request, res: Response) => {
  await redis.set('test', 'API funcionando!');
  const value = await redis.get('test');
  res.send({ message: value });
});

app.use(errorHandler);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
