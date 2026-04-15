import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}
