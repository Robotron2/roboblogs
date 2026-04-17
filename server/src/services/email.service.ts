import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { IPost } from '../models/post.model';
import { ISubscriber } from '../models/subscriber.model';
import { NewsletterLog } from '../models/newsletterLog.model';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};




export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = createTransporter();
  
  try {
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP transporter verification succeeded');

    await transporter.sendMail({
      from: `"RoboBlogs" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Rethrow to ensure Promise.allSettled in bulk dispatch catches the failure
    throw error;
  }
};

export const sendBulkNewsletter = async (subscribers: ISubscriber[], post: IPost) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  // Create initial log entry
  const log = await NewsletterLog.create({
    post: post._id,
    status: 'pending',
    recipientCount: subscribers.length,
    startedAt: new Date()
  });

  // Extract a short excerpt (first 150 chars, stripping HTML if present)
  let excerpt = (post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150);
  if ((post.content || '').length > 150) excerpt += '...';

  const promises = subscribers.map((sub) => {
    // Generate secure unsubscribe token using JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ email: sub.email }, secret, { expiresIn: '30d' });
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
  Promise.allSettled(promises).then(async (results) => {
    const total = results.length;
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = total - successful;

    // Determine dynamic status
    if (successful === total && total > 0) {
      log.status = 'sent';
    } else if (successful === 0 && total > 0) {
      log.status = 'failed';
    } else {
      log.status = 'partially_sent';
    }
    
    log.successCount = successful;
    log.errorCount = failed;

    log.completedAt = new Date();
    
    // Collect error messages from rejected promises if available
    const errorMessages = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => String(r.reason));
    
    if (errorMessages.length > 0) {
      log.errorDetails = errorMessages;
    }

    await log.save();
    console.log(`Newsletter sent to ${successful} out of ${promises.length} subscribers. Log updated.`);
  }).catch(async (err) => {
    console.error('Fatal error in bulk newsletter process:', err);
    log.status = 'failed';
    log.errorDetails = [String(err)];
    await log.save();
  });
};
