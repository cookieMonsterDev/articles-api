import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    user_id: {
      type: String,
      required: [true, 'userId is required'],
    },
    author: {
      type: String,
      required: [true, 'author is required'],
    },
    author_picture: {
      type: String,
      default: '',
      trim: true,
    },
    comment_content: {
      type: String,
      maxLength: [5000, 'comment content must have less than 5000 characters'],
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export const commentModel = model('Comment', commentSchema);
