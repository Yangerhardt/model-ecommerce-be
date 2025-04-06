import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
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
