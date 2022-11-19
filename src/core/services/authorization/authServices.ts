import { userModel } from '../../models/userModel';
import { userValidation } from '../helpers/userValidation';
import { UserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/httpErrors';
import { userDuplicatesValidation } from '../helpers/userDuplicatesValidation';

export const createUserSevice = async (body: UserTypes) => {
  try {
    const validBody = await userValidation({ ...body });

    await userDuplicatesValidation(validBody.username, validBody.email);

    const newUser = new userModel({ ...validBody });

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
