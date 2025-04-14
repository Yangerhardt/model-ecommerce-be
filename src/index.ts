import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import redis from './config/redis';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import addressRoutes from './routes/address.routes';
import couponRoutes from './routes/coupon.routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimitHandler } from './middleware/rateLimitHandler';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', rateLimitHandler, authRoutes);
app.use('/cart', rateLimitHandler, cartRoutes);
app.use('/address', rateLimitHandler, addressRoutes);
app.use('/coupon', rateLimitHandler, couponRoutes);

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
