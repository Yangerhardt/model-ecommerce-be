const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../redis');
const nodemailer = require('nodemailer');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Função auxiliar para enviar email
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

// 📌 Rota para cadastrar usuário
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const userExists = await redis.get(`user:${email}`);
  if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await redis.set(
    `user:${email}`,
    JSON.stringify({ email, password: hashedPassword }),
  );

  res.json({ message: 'Usuário cadastrado com sucesso!' });
});

// 📌 Rota para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await redis.get(`user:${email}`);
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

  const { password: hashedPassword } = JSON.parse(user);
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) return res.status(400).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login realizado com sucesso!', token });
});

// 📌 Rota para solicitar recuperação de senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await redis.get(`user:${email}`);
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  await redis.set(`reset:${token}`, email, 'EX', 900); // Expira em 15 min

  await sendResetEmail(email, token);
  res.json({ message: 'Email de recuperação enviado!' });
});

// 📌 Rota para redefinir senha
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
