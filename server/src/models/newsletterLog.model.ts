import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterLog extends Document {
  post: mongoose.Types.ObjectId;
  status: 'pending' | 'sent' | 'partially_sent' | 'failed';
  recipientCount: number;
  successCount: number;
  errorCount: number;
  errorDetails: string[];
  startedAt: Date;
  completedAt?: Date;
}

const newsletterLogSchema = new Schema<INewsletterLog>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'partially_sent', 'failed'],
      default: 'pending',
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    errorDetails: [
      {
        type: String,
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const NewsletterLog = mongoose.model<INewsletterLog>('NewsletterLog', newsletterLogSchema);
