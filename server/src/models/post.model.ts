import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  categories?: mongoose.Types.ObjectId[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    coverImage: {
      type: String,
      default: 'no-photo.jpg',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create post slug from the title
postSchema.pre('save', function (this: any) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

export const Post = mongoose.model<IPost>('Post', postSchema);
