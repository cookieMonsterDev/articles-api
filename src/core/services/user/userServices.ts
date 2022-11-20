import { userModel } from '../../models/userModel';
import { UserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/errorHandler/httpErrors';
import { userDuplicatesValidation } from '../helpers/userDuplicatesValidation';

export const getUserService = async (id: string): Promise<UserTypes> => {
  try {
    const res = await userModel.findById(id);

    return res!;
  } catch (error) {
    throw new HttpErrors(404, 'User not found', error.message, error.stack);
  }
};

export const updateUserService = async (
  id: string,
  body: UserTypes
): Promise<UserTypes> => {
  try {
    const updatedUser = new userModel({ ...body });

    await updatedUser.validate([...Array.from(Object.keys(body))]);
    await userDuplicatesValidation(body.username, body.email);
    const res = await userModel.findByIdAndUpdate(id, { ...body }, { new: true });

    return res!;
  } catch (error) {
    throw new HttpErrors(
      error.status || 401,
      'User not updated',
      error.message,
      error.stack
    );
  }
};

export const deleteUserService = async (id: string): Promise<void> => {
  try {
    await userModel.findByIdAndDelete(id);

    return;
  } catch (error) {
    throw new HttpErrors(
      error.status || 404,
      'User not found',
      error.message,
      error.stack
    );
  }
}