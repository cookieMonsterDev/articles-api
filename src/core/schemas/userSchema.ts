import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: String
});

export const userModel = model('User', userSchema);
