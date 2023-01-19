import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { InputUserTypes } from '../services/types/userTypes';
import HttpErrors from '../middleware/httpErrors';

const NO_SPACES = /^\S*$/;
const EMAIL_REGEX =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const URL_REGEX = /^(?:http(s)?:\/\/)/;
const ONLY_LATIN_LETTERS_REGEX = /[A-Za-z]/;
const AT_LEAST_ONE_UPPER_CASE_LETTER = /(?=.*?[A-Z])/;
const AT_LEAST_ONE_LOWER_CASE_LETTER = /(?=.*?[a-z])/;
const AT_LEAST_ONE_NUMBER = /(?=.*?[0-9])/;
const AT_LEAST_ONE_SPECIAL_CHARACTER = /(?=.*?[#?!@$%^_&*-])/;

const userSchema = new Schema(
  {
    articles: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    username: {
      type: String,
      required: [true, 'username is required'],
      minLength: [2, 'username must have at least 2 characters'],
      maxLength: [64, 'username must have less than 64 characters'],
      match: [NO_SPACES, 'username must have no spaces'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      match: [EMAIL_REGEX, 'the string is not an email'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [8, 'password must have at least 2 characters'],
      maxLength: [64, 'password must have less than 64 characters'],
      validate: [
        {
          validator: (p: string) => p.match(AT_LEAST_ONE_UPPER_CASE_LETTER),
          message: 'password must have at least 1 upper case letter',
        },
        {
          validator: (p: string) => p.match(AT_LEAST_ONE_LOWER_CASE_LETTER),
          message: 'password must have at least 1 lower case letter',
        },
        {
          validator: (p: string) => p.match(AT_LEAST_ONE_NUMBER),
          message: 'password must have at least 1 number',
        },
        {
          validator: (p: string) => p.match(AT_LEAST_ONE_SPECIAL_CHARACTER),
          message: 'password must have at least 1 special character',
        },
        {
          validator: (p: string) => p.match(NO_SPACES),
          message: 'password must have no spaces',
        },
      ],
    },
    name: {
      type: String,
      maxLength: [64, 'name must have less than 64 characters'],
      match: [ONLY_LATIN_LETTERS_REGEX, 'name must have only latin letters'],
      trim: true,
      default: '',
    },
    surname: {
      type: String,
      maxLength: [64, 'surname must have less than 64 characters'],
      match: [ONLY_LATIN_LETTERS_REGEX, 'surname must have only latin letters'],
      trim: true,
      default: '',
    },
    picture_url: {
      type: String,
      match: [URL_REGEX, 'the string is not a URL'],
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      maxLength: [5000, 'bio must have less than 5000 characters'],
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    throw new HttpErrors(401, `User validation failed: ${error.message}`);
  }
});

userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  try {
    const { password: newPassword, ...rest } = this.getUpdate() as InputUserTypes;
    if (!newPassword) next();

    const salt = await bcrypt.genSalt(10);
    const { _id } = this.getQuery();
    const res = (await userModel.findById(_id)) as InputUserTypes;
    if (!res) throw new Error('User not found');

    const match = await bcrypt.compare(newPassword, res.password);

    if (match)
      throw new Error(
        'User validation failed: password: password must be different from previous password'
      );

    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    this.setUpdate({ password: hashedNewPassword });

    next();
  } catch (error) {
    throw new HttpErrors(401, error.message, '');
  }
});

export const userModel = model('User', userSchema);
