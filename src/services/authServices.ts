import { PrivateUser, userModel } from '../models/userModel';
import bcrypt from 'bcrypt';
import HttpErrors from '../middleware/httpErrors';
import { userDataTransformator, userDuplicatesValidation } from './helpers/userHelpers';

interface InputData {
  username: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  picture_url?: string;
  bio?: string;
  isAdmin?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Validate data and create new user
 * @param { InputData } body the data received from body of POST request
 * @returns { OutputUserTypes }
 */
export const createUserService = async (body: InputData): Promise<PrivateUser> => {
  try {
    const newUser = new userModel({ ...body });
    await newUser.validate();
    await userDuplicatesValidation(body.username, body.email);

    const res = await newUser.save();

    return userDataTransformator({ user: res, isPrivate: true });
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create user`, error.message);
  }
};

/**
 * Validate data and return user
 * @param { string } email the data received from body of POST request
 * @param { string } password the data received from body of POST request
 * @returns { PrivateUser }
 */
export const loginUserServise = async ({
  email,
  password,
}: LoginData): Promise<PrivateUser> => {
  try {
    const userData = new userModel({ email, password });
    await userData.validate(['email', 'password']);

    const res = await userModel.findOne({ email: email });
    if (!res) throw new Error('Wrong email or password');

    const match = await bcrypt.compare(password, res.password);
    if (!match) throw new Error('Wrong email or password');

    return userDataTransformator({ user: res, isPrivate: true });
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to login user`, error.message);
  }
};
