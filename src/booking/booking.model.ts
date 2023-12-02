import * as mongoose from 'mongoose';

export const BookingSchema = new mongoose.Schema(
  {
    start: { type: Date, require: true },
    userFirst: mongoose.Schema.Types.ObjectId,
    userSecond: mongoose.Schema.Types.ObjectId,
  },
  {
    versionKey: false,
    collection: 'booking',
  },
);
