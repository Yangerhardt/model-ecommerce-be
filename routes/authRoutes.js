const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../redis');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    text: `Clique no link para redefinir sua senha: http://localhost:3001/auth/reset-password/${token}`,
  };

  await transporter.sendMail(mailOptions);
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const userExists = await redis.get(`user:${email}`);
  if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  await redis.set(
    `user:${email}`,
    JSON.stringify({ id: userId, email, password: hashedPassword }),
  );

  res.json({ message: 'Usuário cadastrado com sucesso!', id: userId });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userData = await redis.get(`user:${email}`);
  if (!userData) return res.status(400).json({ error: 'User not found' });

  const { id, password: hashedPassword } = JSON.parse(userData);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ email, id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Sucess', token, email, id });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await redis.get(`user:${email}`);
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  await redis.set(`reset:${token}`, email, 'EX', 900);

  await sendResetEmail(email, token);
  res.json({ message: 'Email de recuperação enviado!' });
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const email = await redis.get(`reset:${token}`);
  if (!email)
    return res.status(400).json({ error: 'Token inválido ou expirado' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await redis.set(
    `user:${email}`,
    JSON.stringify({ email, password: hashedPassword }),
  );

  res.json({ message: 'Senha redefinida com sucesso!' });
});

module.exports = router;
