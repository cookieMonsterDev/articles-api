declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      username: string;
      email: string;
      password: string;
      picture_url: string;
      isAdmin: boolean;
    };
  }
}
