import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    article: { type: Schema.Types.ObjectId, ref: 'Article' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: {
      type: String,
      maxLength: [5000, 'comment content must have less than 5000 characters'],
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export const commentModel = model('Comment', commentSchema);
