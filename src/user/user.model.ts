import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
  },
  {
    versionKey: false,
    collection: 'user',
  },
);
