import HttpErrors from '../../../middleware/errorHandler/httpErrors';
import { userModel } from '../../../models/userModel';

export const userDuplicatesValidation = async (username: string, email: string) => {
  try {
    const takenUsername = await userModel.findOne({ username: username });
    if (takenUsername) throw new Error('username is taken');

    const takenEmail = await userModel.findOne({ email: email });
    if (takenEmail) throw new Error('email is taken');

    return;
  } catch (error) {
    throw new HttpErrors(409, `Validation for duplicates failed: ${error.message}`);
  }
};
