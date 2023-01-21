import HttpErrors from '../../middleware/httpErrors';
import { User, userModel } from '../../models/userModel';
import { generateToken } from '../../middleware/authMiddleware';
import { PrivateUser } from '../authServices';

export const userDuplicatesValidation = async (username: string, email: string) => {
  try {
    const takenUsername = await userModel.findOne({ username: username });
    if (takenUsername) throw new Error('username is taken');

    const takenEmail = await userModel.findOne({ email: email });
    if (takenEmail) throw new Error('email is taken');

    return;
  } catch (error) {
    throw new HttpErrors(409, `Duplicates validation failed: ${error.message}`);
  }
};

export const privateUserDataTransform = (user: User): PrivateUser => {
  const token = generateToken({
    _id: user._id,
    username: user.username,
    email: user.email,
    password: user.password,
    picture_url: user.picture_url,
    isAdmin: user.isAdmin,
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    surname: user.surname,
    picture_url: user.picture_url,
    bio: user.bio,
    token: token,
  };
};
