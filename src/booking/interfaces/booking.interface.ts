import { Document, Types } from 'mongoose';

export interface Booking extends Document {
  start: Date;
  userFirst?: Types.ObjectId;
  userSecond?: Types.ObjectId;
}
