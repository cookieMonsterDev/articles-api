import { userModel } from '../models/userModel';
import bcrypt from 'bcrypt';
import { LoginUsertypes, OutputUserTypes, InputUserTypes } from './types/userTypes';
import HttpErrors from '../middleware/httpErrors';
import { userDuplicatesValidation } from './helpers/userDuplicatesValidation';
import { generateToken } from '../middleware/authMiddleware';

/**
 * Validate data and create new user
 * @param { InputUserTypes } body the data received from body of POST request
 * @returns { OutputUserTypes }
 */
export const createUserService = async (
  body: InputUserTypes
): Promise<OutputUserTypes> => {
  try {
    const newUser = new userModel({ ...body });
    await newUser.validate();
    await userDuplicatesValidation(body.username, body.email);

    const res = await newUser.save();

    return {
      _id: res._id.toString(),
      username: res.username,
      email: res.email,
      name: res.name,
      surname: res.surname,
      pictureURL: res.picture_url,
      bio: res.bio,
      token: generateToken({
        _id: res._id.toString(),
        username: res.username,
        email: res.email,
        password: res.password,
        pictureURL: res.picture_url,
        isAdmin: res.isAdmin,
      }),
    };
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to create user`, error.message);
  }
};

/**
 * Validate data and return user
 * @param { string } email the data received from body of POST request
 * @param { string } password the data received from body of POST request
 * @returns { OutputUserTypes }
 */
export const loginUserServise = async ({
  email,
  password,
}: LoginUsertypes): Promise<OutputUserTypes> => {
  try {
    const userData = new userModel({ email, password });
    await userData.validate(['email', 'password']);

    const res = await userModel.findOne({ email: email });
    if (!res) throw new Error('Wrong email or password');

    const match = await bcrypt.compare(password, res.password);
    if (!match) throw new Error('Wrong email or password');

    return {
      _id: res._id.toString(),
      username: res.username,
      email: res.email,
      name: res.name,
      surname: res.surname,
      pictureURL: res.picture_url,
      bio: res.bio,
      token: generateToken({
        _id: res._id.toString(),
        username: res.username,
        email: res.email,
        password: res.password,
        pictureURL: res.picture_url,
        isAdmin: res.isAdmin,
      }),
    };
  } catch (error) {
    throw new HttpErrors(error.status || 401, `Failed to login user`, error.message);
  }
};
