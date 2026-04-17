import { Request, Response } from 'express';
import { Subscriber } from '../models/subscriber.model';
import { NewsletterLog } from '../models/newsletterLog.model';
import catchAsync from '../utils/catchAsync';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import jwt from 'jsonwebtoken';

export const subscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  let subscriber = await Subscriber.findOne({ email });

  if (subscriber) {
    if (subscriber.isActive) {
      return res.status(200).json(new ApiResponse(true, 'Already subscribed', subscriber));
    } else {
      subscriber.isActive = true;
      await subscriber.save();
      return res.status(200).json(new ApiResponse(true, 'Subscription reactivated', subscriber));
    }
  }

  subscriber = await Subscriber.create({ email });
  res.status(201).json(new ApiResponse(true, 'Subscribed successfully', subscriber));
});

export const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const token = req.params.token as string;
  if (!token) {
    throw new ApiError(400, 'Invalid unsubscribe link');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as { email: string };
    const subscriber = await Subscriber.findOne({ email: decoded.email });

    if (!subscriber) {
      throw new ApiError(404, 'Subscriber not found');
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json(new ApiResponse(true, 'Unsubscribed successfully', null));
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired unsubscribe link');
  }
});

export const getLogs = catchAsync(async (req: Request, res: Response) => {
  const logs = await NewsletterLog.find()
    .populate('post', 'title slug')
    .sort({ startedAt: -1 })
    .limit(50);
    
  res.status(200).json(new ApiResponse(true, 'Newsletter logs retrieved', logs));
});
