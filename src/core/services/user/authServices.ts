import { userModel } from '../../models/userModel';
import bcrypt from 'bcrypt'
import { LoginUsertypes, UserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/errorHandler/httpErrors';
import { userDuplicatesValidation } from '../helpers/userDuplicatesValidation';

export const createUserService = async (body: UserTypes) => {
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

export const loginUserServise = async ({email, password}: LoginUsertypes) => {
  try {
    const userData = new userModel({ email, password });
    await userData.validate(['email', 'password']);

    const res = await userModel.findOne({email: email});
    if(!res) throw new Error('Wrong email or password')

    const match = await bcrypt.compare(password, res.password)
    if(!match) throw new Error('Wrong email or password')

    return res
  }
  catch(error) {
    throw new HttpErrors(
      error.status || 401,
      `Failed to login user`,
      error.message,
      error.stack
    );
  }
}