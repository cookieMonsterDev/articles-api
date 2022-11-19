import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createUserSevice } from '../services/authorization/authServices';

export const createUserControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await createUserSevice(req.body);
    res.status(201).json(user);
  }
);
