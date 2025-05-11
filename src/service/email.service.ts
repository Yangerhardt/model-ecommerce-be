import transporter from '../config/emailConfig';
import { EmailSendingError } from '../utils/errors';

export const sendForgetPasswordEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Redefinição de Senha',
    //TODO REDEFINIR QUAL A URL DO SITE PARA RECUPERAR A SENHA
    html: `
      <p>Olá,</p>
      <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para redefinir sua senha:</p>
      <a href="http://localhost:8000/auth/reset-password?token=${token}">Redefinir Senha</a>
      <p>Este link expirará em 1 hora.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw new EmailSendingError('Error sending password reset email');
  }
};

export const sendConfirmationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Confirmação de Conta',
    // TODO: Definir a URL correta para confirmar a conta
    html: `
      <p>Olá,</p>
      <p>Seu registro foi concluído com sucesso! Por favor, clique no link abaixo para confirmar sua conta:</p>
      <a href="http://localhost:8000/auth/confirm-account?token=${token}">Confirmar Conta</a>
      <p>Obrigado!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email: ', error);
    throw new EmailSendingError('Error sending confirmation email');
  }
};
