import { isValidObjectId } from 'mongoose';
import { userModel } from '../../models/userModel';
import { InputUserTypes, OutputUserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/httpErrors';
import { userDuplicatesValidation } from '../helpers/userDuplicatesValidation';

/**
 * Validate userId and return user
 * @param { string } id the data received from params of POST request
 * @returns { OutputUserTypes }
 */
export const getUserService = async (id: string): Promise<OutputUserTypes> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findById(id);
    if (!res) throw new Error('User not found');

    return {
      id: res._id.toString(),
      username: res.username,
      email: res.email,
      name: res.name,
      surname: res.surname,
      pictureURL: res.picture_url,
      bio: res.bio,
    };
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find user', error.message);
  }
};

/**
 * Return all users
 * @returns { OutputUserTypes[] }
 */
export const getAllUsersService = async (): Promise<OutputUserTypes[]> => {
  try {
    const res = await userModel.find();

    const resUsers = res.map((item) => {
      return {
        id: item._id.toString(),
        username: item.username,
        email: item.email,
        name: item.name,
        surname: item.surname,
        pictureURL: item.picture_url,
        bio: item.bio,
      };
    });

    return resUsers;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find users', error.message);
  }
};

/**
 * Validate data and return user
 * @param { string } id the data received from params of POST request
 * @param { InputUserTypes } body the data received from body of POST request
 * @returns { OutputUserTypes }
 */
export const updateUserService = async (
  id: string,
  body: InputUserTypes
): Promise<OutputUserTypes> => {
  try {
    const updatedUser = new userModel({ ...body });
    await updatedUser.validate([...Array.from(Object.keys(body))]);
    await userDuplicatesValidation(body.username, body.email);

    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findByIdAndUpdate(id, { ...body }, { new: true });
    if (!res) throw new Error('User not found');

    return {
      id: res._id.toString(),
      username: res.username,
      email: res.email,
      name: res.name,
      surname: res.surname,
      pictureURL: res.picture_url,
      bio: res.bio,
      token: '',
    };
  } catch (error) {
    throw new HttpErrors(
      error.status || 401,
      'Failed to update user',
      error.message
    );
  }
};

/**
 * Validate userId and return userId
 * @param { string } id the data received from params of POST request
 * @returns { string } the id of deleted user
 */
export const deleteUserService = async (id: string): Promise<string> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findByIdAndDelete(id);
    if (!res) throw new Error('User not found');

    return res._id.toString();
  } catch (error) {
    throw new HttpErrors(
      error.status || 404,
      'Failed to delete user',
      error.message
    );
  }
};
