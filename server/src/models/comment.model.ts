import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please add a comment content'],
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
