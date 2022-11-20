import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createUserService } from '../services/authorization/authServices';

export const createUserControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  }
);
