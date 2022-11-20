import { userModel } from '../../models/userModel';
import { UserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/errorHandler/httpErrors';
import { userDuplicatesValidation } from '../helpers/userDuplicatesValidation';

export const createUserSevice = async (body: UserTypes) => {
  try {
    const newUser = new userModel({ ...body });

    await newUser.validate();
    await userDuplicatesValidation(body.username, body.email);
    const res = await newUser.save();

    return res;
  } catch (error) {
    throw new HttpErrors(
      error.status || 401,
      `Failed to create user`,
      error.message,
      error.stack
    );
  }
};
