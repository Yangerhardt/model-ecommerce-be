require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('./redis');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  await redis.set('test', 'API funcionando!');
  const value = await redis.get('test');
  res.send({ message: value });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
