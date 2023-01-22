import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createCommentService, deleteCommentService, getAllCommentsService, getCommentService, updateCommentService } from '../services/commentsServices';

export const getCommentControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const comment = await getCommentService(req.params.commentId);
    res.status(201).json(comment);
  }
);

export const getAllCommentsControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const comments = await getAllCommentsService(req.params.articleId);
    res.status(201).json(comments);
  }
);

export const createCommntControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const comment = await createCommentService({
      articleId: req.params.articleId,
      tokenUser: req.user,
      body: req.body,
    });
    res.status(201).json(comment);
  }
);

export const updateCommntControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const comment = await updateCommentService({
      articleId: req.params.articleId,
      commentId: req.params.commentId,
      tokenUser: req.user,
      body: req.body,
    });
    res.status(201).json(comment);
  }
);

export const deleteCommntControl = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const commentId = await deleteCommentService({
      articleId: req.params.articleId,
      commentId: req.params.commentId,
      tokenUser: req.user,
    });
    res.status(201).json({ message: `comment ${commentId} is deleted` });
  }
);
