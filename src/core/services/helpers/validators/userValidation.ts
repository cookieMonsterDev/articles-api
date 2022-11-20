import { UserTypes } from '../../types/userTypes';
import HttpErrors from '../../../middleware/errorHandler/httpErrors';

const EMAIL_REGEX =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const AT_LEAST_ONE_UPPER_CASE_LETTER = /(?=.*?[A-Z])/;
const AT_LEAST_ONE_LOWER_CASE_LETTER = /(?=.*?[a-z])/;
const AT_LEAST_ONE_NUMBER = /(?=.*?[0-9])/;
const AT_LEAST_ONE_SPECIAL_CHARACTER = /(?=.*?[?=.*?[#?!@$%^&*-_])/;
const ONLY_LATIN_LETTERS_REGEX = /[A-Za-z]/;
const URL_REGEX = /^(?:http(s)?:\/\/)/;

export const userValidation = async (user: UserTypes): Promise<UserTypes> => {
  const { username, email, password, name, surname, pictureURL, bio, ...other } = user;

  try {
    const validUser = {
      ...other,
      username: await usernameValidation(username),
      email: await emailValidation(email),
      password: await passwordValidation(password),
      name: name ? await nameValidation(name) : name,
      surname: surname ? await surnameValidation(surname) : surname,
      pictureURL: pictureURL ? await pictureURLValidation(pictureURL) : pictureURL,
      bio: bio ? await bioValidation(bio) : bio,
    };

    return validUser;
  } catch (error) {
    throw new HttpErrors(400, `Validation falied: ${error.message}`);
  }
};

const usernameValidation = async (username: string): Promise<string> => {
  try {
    if (!username) throw new Error('username is required');

    if (typeof username !== 'string') throw new Error('username type must be string');

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 2)
      throw new Error('username must have at least 2 characters');

    if (trimmedUsername.length > 64)
      throw new Error('username must have less than 64 characters');

    if (trimmedUsername.split(' ').length !== 1)
      throw new Error('username must not have spaces');

    return trimmedUsername;
  } catch (error) {
    throw new Error(error);
  }
};

const emailValidation = async (email: string): Promise<string> => {
  try {
    if (!email) throw new Error('email is required');

    if (typeof email !== 'string') throw new Error('email type must be string');

    const trimmedEmail = email.trim();

    if (!trimmedEmail.match(EMAIL_REGEX)) throw new Error('the string is not an email');

    return trimmedEmail;
  } catch (error) {
    throw new Error(error);
  }
};

const passwordValidation = async (password: string): Promise<string> => {
  try {
    if (!password) throw new Error('password is required');

    if (typeof password !== 'string') throw new Error('password type must be string');

    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8)
      throw new Error('password must have at least 8 characters');

    if (!trimmedPassword.match(AT_LEAST_ONE_UPPER_CASE_LETTER))
      throw new Error('password must have at least 1 upper case letter');

    if (!trimmedPassword.match(AT_LEAST_ONE_LOWER_CASE_LETTER))
      throw new Error('password must have at least 1 lower case letter');

    if (!trimmedPassword.match(AT_LEAST_ONE_NUMBER))
      throw new Error('password must have at least 1 number');

    if (!trimmedPassword.match(AT_LEAST_ONE_SPECIAL_CHARACTER))
      throw new Error('password must have at least 1 special character');

    return trimmedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

const nameValidation = async (name: string): Promise<string> => {
  try {
    if (typeof name !== 'string') throw new Error('name type must be string');

    const trimmedName = name.trim();

    if (trimmedName.length < 2) throw new Error('name must have at least 2 characters');

    if (trimmedName.length > 64)
      throw new Error('name must have less than 64 characters');

    if (!trimmedName.match(ONLY_LATIN_LETTERS_REGEX))
      throw new Error('name must have only latin letters');

    return trimmedName;
  } catch (error) {
    throw new Error(error);
  }
};

const surnameValidation = async (surname: string): Promise<string> => {
  try {
    if (typeof surname !== 'string') throw new Error('surname type must be string');

    const trimmedSurname = surname.trim();

    if (trimmedSurname.length < 2)
      throw new Error('surname must have at least 2 characters');

    if (trimmedSurname.length > 64)
      throw new Error('surname must have less than 64 characters');

    if (!trimmedSurname.match(ONLY_LATIN_LETTERS_REGEX))
      throw new Error('surname must have only latin letters');

    return trimmedSurname;
  } catch (error) {
    throw new Error(error);
  }
};

const pictureURLValidation = async (pictureURL: string): Promise<string> => {
  try {
    if (typeof pictureURL !== 'string') throw new Error('pictureURL type must be string');

    const trimmedPictureURL = pictureURL.trim();

    if (!trimmedPictureURL.match(URL_REGEX)) throw new Error('the string is not a URL');

    return trimmedPictureURL;
  } catch (error) {
    throw new Error(error);
  }
};

const bioValidation = async (bio: string): Promise<string> => {
  try {
    if (typeof bio !== 'string') throw new Error('bio type must be string');

    if (bio.length > 5000) throw new Error('bio must have less than 5000 characters');

    return bio;
  } catch (error) {
    throw new Error(error);
  }
};
