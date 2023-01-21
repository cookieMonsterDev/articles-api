import { Schema, model } from 'mongoose';

interface ArticleUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  pictureURL: string;
}

interface ArticleComment {
  _id: string;
  author: ArticleUser;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  _id: string;
  author: ArticleUser;
  title: string;
  description: string;
  text: string;
  tags: string[];
  comments: ArticleComment[];
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<Article>(
  {
    author: {type: Schema.Types.ObjectId, ref: 'User'},
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
    },
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  },
  { timestamps: true }
);

export const articleModle = model('Article', articleSchema);
