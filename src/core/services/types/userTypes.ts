export interface UserTypes {
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