import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
} as any);

export const sendEmail = async (options: { email: string; subject: string; message: string; html?: string }): Promise<void> => {
  const mailOptions = {
    from: `"RoboBlogs" <${config.email.user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`;

  await sendEmail({
    email,
    subject: 'Password Reset Token',
    message,
    html: `<p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
  });
};
