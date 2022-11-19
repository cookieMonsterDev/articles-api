import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      default: ''
    },
    surname: {
      type: String,
      default: ''
    },
    pictureURL: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const userModel = model('User', userSchema);
