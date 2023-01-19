import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
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
    text: {
      type: String,
      required: [true, 'article content is required'],
      maxLength: [10000, 'article content must have less than 10000 characters'],
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

export const articleModle = model('Article', articleSchema);
