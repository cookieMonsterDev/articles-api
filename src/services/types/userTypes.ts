export interface InputUserTypes {
  username: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  pictureURL?: string;
  bio?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface LoginUsertypes {
  email: string;
  password: string;
}

export interface OutputUserTypes {
  id: string,
  username: string,
  email: string,
  name: string;
  surname: string;
  pictureURL: string;
  bio: string;
  token?: string;
}

export interface UserFromTokenTypes {
  id: string;
  username: string;
  email: string;
  password: string;
  pictureURL: string;
  isAdmin: boolean;
}