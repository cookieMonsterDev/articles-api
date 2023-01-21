import { isValidObjectId } from 'mongoose';
import { PrivateUser, PublicUser, userModel } from '../models/userModel';
import HttpErrors from '../middleware/httpErrors';
import { userDataTransformator, userDuplicatesValidation } from './helpers/userHelpers';
import { TokenTypes } from '../middleware/authMiddleware';

interface UserUpdateTypes {
  userId: string;
  tokenUser: TokenTypes;
  body: InputData;
}

interface InputData {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  picture_url: string;
  bio: string;
  isAdmin: boolean;
}

const publicUserFieldsConfig = [
  '_id',
  'username',
  'email',
  'name',
  'surname',
  'picture_url',
  'bio',
];

/**
 * Validate userId and return user
 * @param { string } id the data received from params of POST request
 * @returns { PublicUser }
 */
export const getUserService = async (id: string): Promise<PublicUser> => {
  try {
    const objectId = isValidObjectId(id);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findById(id).select(publicUserFieldsConfig);
    if (!res) throw new Error('User not found');

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find user', error.message);
  }
};

/**
 * Return all users
 * @returns { PublicUser[] }
 */
export const getAllUsersService = async (): Promise<PublicUser[]> => {
  try {
    const res = await userModel.find().select(publicUserFieldsConfig);

    return res;
  } catch (error) {
    throw new HttpErrors(404, 'Failed to find users', error.message);
  }
};

/**
 * Validate data and return user
 * @returns { PrivateUser }
 */
export const updateUserService = async ({
  userId,
  tokenUser,
  body,
}: UserUpdateTypes): Promise<PrivateUser> => {
  if (userId !== tokenUser._id)
    throw new HttpErrors(401, 'Authorization failed', 'Access denied');

  try {
    const updatedUser = new userModel({ ...body });
    await updatedUser.validate([...Array.from(Object.keys(body))]);
    await userDuplicatesValidation(body.username, body.email);

    const objectId = isValidObjectId(userId);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findByIdAndUpdate(userId, { ...body }, { new: true });
    if (!res) throw new Error('User not found');

    return userDataTransformator({ user: res, isPrivate: true });
  } catch (error) {
    throw new HttpErrors(error.status || 401, 'Failed to update user', error.message);
  }
};

/**
 * Validate userId and return userId
 * @param { string } id the data received from params of POST request
 * @returns { string } the id of deleted user
 */
export const deleteUserService = async (
  userId: string,
  tokenUserId: string
): Promise<string> => {
  if (userId !== tokenUserId)
    throw new HttpErrors(401, 'Authorization failed', 'Access denied');

  try {
    const objectId = isValidObjectId(userId);
    if (!objectId) throw new Error('Id validation failed: incorrect objectId');

    const res = await userModel.findByIdAndDelete(userId);
    if (!res) throw new Error('User not found');

    return res._id.toString();
  } catch (error) {
    throw new HttpErrors(error.status || 404, 'Failed to delete user', error.message);
  }
};
