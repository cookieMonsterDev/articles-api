import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  getUserService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
} from '../services/userServices';

export const getUserControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = await getUserService(req.params.id);
  res.status(200).json(user);
});

export const getAllUsersControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await getAllUsersService();
    res.status(200).json(user);
  }
);

export const updateUserControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await updateUserService({
      userId: req.params.userId,
      tokenUser: req.user,
      body: req.body,
    });
    res.status(200).json(user);
  }
);

export const deleteUserControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = await deleteUserService(req.params.userId, req.user);
    res.status(200).json({ message: `user ${userId} is deleted` });
  }
);
