import { Schema, model, ObjectId } from 'mongoose';

interface CommentUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  pictureURL: string;
}

export interface Comment {
  _id: string;
  article: ObjectId;
  author: CommentUser;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<Comment>(
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
