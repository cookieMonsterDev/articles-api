import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createArticleService, deleteArticleService, getAllArticleService, getArticleService, updateArticleService } from '../services/article/articleServices';

export const createArticleControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const article = await createArticleService(req.user, req.body)
  res.status(201).json(article);
})

export const getArticleControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const article = await getArticleService(req.params.id)
  res.status(201).json(article);
})

export const getAllArticleControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const articles = await getAllArticleService()
  res.status(201).json(articles);
})

export const updateArticleControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const articles = await updateArticleService(req.params.id, req.user, req.body)
  res.status(201).json(articles);
})

export const deleteArticleControl = expressAsyncHandler(async (req: Request, res: Response) => {
  const articleId = await deleteArticleService(req.params.id, req.user)
  res.status(200).json({ message: `article ${articleId} is deleted` });
})


