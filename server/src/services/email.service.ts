import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { IPost } from '../models/post.model';
import { ISubscriber } from '../models/subscriber.model';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"RoboBlogs" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

export const sendBulkNewsletter = async (subscribers: ISubscriber[], post: IPost) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  // Extract a short excerpt (first 150 chars, stripping HTML if present)
  let excerpt = post.content.replace(/<[^>]*>?/gm, '').substring(0, 150);
  if (post.content.length > 150) excerpt += '...';

  const promises = subscribers.map((sub) => {
    // Generate secure unsubscribe token using JWT
    const token = jwt.sign({ email: sub.email }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
    const unsubscribeLink = `${clientUrl}/newsletter/unsubscribe/${token}`;
    const postLink = `${clientUrl}/article/${post.slug}`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1A1B1E;">New Story: ${post.title}</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          ${excerpt}
        </p>
        <a href="${postLink}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #0AAF55; color: #fff; text-decoration: none; border-radius: 5px;">Read the full story</a>
        
        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          You received this email because you are subscribed to RoboBlogs.<br>
          <a href="${unsubscribeLink}" style="color: #999;">Unsubscribe</a>.
        </p>
      </div>
    `;

    return sendEmail(sub.email, `New Story from RoboBlogs: ${post.title}`, html);
  });

  // Execute asynchronously
  Promise.allSettled(promises).then((results) => {
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    console.log(`Newsletter sent to ${successful} out of ${promises.length} subscribers.`);
  });
};
