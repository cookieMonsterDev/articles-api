import { UserTypes } from '../types/userTypes';
import HttpErrors from '../../middleware/httpErrors';

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const userValidation = (user: UserTypes): UserTypes => {
  const { username, email, password, name, surname, pictureURL, bio, ...other } = user;

  try {
    const validUser = {
      ...other,
      username: usernameValidation(username),
      email: emailValidation(email),
      password: passwordValidation(password),
      name: nameValidation(name!),
      surname: surnameValidation(surname!),
      pictureURL: pictureURLValidation(pictureURL!),
      bio: bioValidation(bio!),
    };

    return validUser;
  } catch (error) {
    throw new HttpErrors(400, `Validation falied: ${error.message}`);
  }
};

const usernameValidation = (username: string): string => {
  try {
    if (!username) throw new Error('username is required');

    if (typeof username !== 'string') throw new Error('username type must be string');

    const trimmedUSername = username.trim();

    if (trimmedUSername.length < 2)
      throw new Error('username must have at least 2 characters');

    if (trimmedUSername.length > 64)
      throw new Error('username must have less than 64 characters');

    if (trimmedUSername.split(' ').length !== 1)
      throw new Error('username must not have spaces');

    return trimmedUSername;
  } catch (error) {
    throw error;
  }
};

const emailValidation = (email: string): string => {
  try {
    if (!email) throw new Error('email is required');

    if (typeof email !== 'string') throw new Error('email type must be string');

    const trimmedEmail = email.trim();

    if (!trimmedEmail.match(EMAIL_REGEX)) throw new Error('the string is not an email');

    return trimmedEmail;
  } catch (error) {
    throw error;
  }
};

const passwordValidation = (password: string): string => {
  try {
    if (!password) throw new Error('password is required');

    if (typeof password !== 'string') throw new Error('password type must be string');

    const trimmedPassword = password.trim();

    return trimmedPassword;
  } catch (error) {
    throw error;
  }
};

const nameValidation = (name: string): string => {
  try {
    return name;
  } catch (error) {
    throw error;
  }
};

const surnameValidation = (surname: string): string => {
  try {
    return surname;
  } catch (error) {
    throw error;
  }
};

const pictureURLValidation = (pictureURL: string): string => {
  try {
    return pictureURL;
  } catch (error) {
    throw error;
  }
};

const bioValidation = (bio: string): string => {
  try {
    return bio;
  } catch (error) {
    throw error;
  }
};
