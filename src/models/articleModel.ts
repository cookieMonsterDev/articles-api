import { Schema, model } from 'mongoose';
import { commentModle } from './commentModel';

const articleSchema = new Schema(
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
    title: {
      type: String,
      required: [true, 'author is required'],
      maxLength: [150, 'title must have less than 150 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [1000, 'description must have less than 100 characters'],
      default: '',
      trim: true,
    },
    article_content: {
      type: String,
      required: [true, 'article content is required'],
      maxLength: [10000, 'article content must have less than 10000 characters'],
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    comments: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

export const articleModle = model('Article', articleSchema);
