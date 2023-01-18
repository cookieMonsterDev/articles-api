import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createCommentService } from '../services/comments/commentsServices';

export const createCommntControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const comment = await createCommentService(req.user, req.params.id, req.body);
    res.status(201).json(comment);
  }
);
