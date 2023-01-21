import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import HttpErrors from './httpErrors';

export interface TokenTypes {
  _id: string;
  username: string;
  email: string;
  password: string;
  picture_url: string;
  isAdmin: boolean;
}

export const generateToken = (tokenData: TokenTypes): string => {
  return jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    )
      throw new Error('Token not provided');

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as TokenTypes;

    req.user = decodedToken;
    return;
  } catch (error) {
    throw new HttpErrors(401, error.message, error.reason);
  }
};

export const isAuthorized = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyToken(req, res);

      next();
    } catch (error) {
      throw new HttpErrors(
        error.status || 401,
        'Authorization failed',
        error.message
      );
    }
  }
);

export const isAuthorizedAndAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyToken(req, res);

      if (!req.user.isAdmin) throw new Error('Access denied');

      next();
    } catch (error) {
      throw new HttpErrors(401, 'Authorization failed', error.message);
    }
  }
);
